import { WebSocketServer } from 'ws';
import path from 'path';
import os from 'os';
import express from 'express';
import {
  IWebSocket,
  WebSocketMessageReader,
  WebSocketMessageWriter,
} from 'vscode-ws-jsonrpc';
import {
  Message,
  InitializeRequest,
  InitializeParams,
} from 'vscode-languageserver';
import {
  createServerProcess,
  forward,
  createConnection,
} from 'vscode-ws-jsonrpc/server';
import { fileURLToPath } from 'url';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception: ', err.toString());
  if (err.stack !== undefined) {
    console.error(err.stack);
  }
});

const launchLanguageServer = (socket: IWebSocket) => {
  const reader = new WebSocketMessageReader(socket);
  const writer = new WebSocketMessageWriter(socket);
  const socketConnection = createConnection(reader, writer, () => {
    socket.dispose();
  });

  const defineConfigDir = () => {
    let configDir;
    const platform = os.platform();

    if (platform === 'win32') {
      configDir = 'config_win';
    } else if (platform === 'darwin') {
      configDir = 'config_mac';
    } else {
      configDir = 'config_linux';
    }

    return configDir;
  };

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const serverPath = path.resolve(__dirname, '../java-ls');

  const launcherJar = path.join(
    serverPath,
    'plugins',
    'org.eclipse.equinox.launcher_1.6.900.v20240613-2009.jar'
  );

  const serverConnection = createServerProcess('JavaLS', 'java', [
    '-Declipse.application=org.eclipse.jdt.ls.core.id1',
    '-Dosgi.bundles.defaultStartLevel=4',
    '-Declipse.product=org.eclipse.jdt.ls.core.product',
    '-Dlog.level=ALL',
    '-Xmx1G',
    '--add-modules=ALL-SYSTEM',
    '--add-opens',
    'java.base/java.util=ALL-UNNAMED',
    '--add-opens',
    'java.base/java.lang=ALL-UNNAMED',
    '-jar',
    launcherJar,
    '-configuration',
    path.join(serverPath, defineConfigDir()),
    '-data',
    path.join(serverPath, 'data'), // specify your data directory
  ]);

  if (serverConnection) {
    forward(socketConnection, serverConnection, (message) => {
      if (Message.isNotification(message)) {
        console.log('NOTIFICATION', message.method);
      }

      if (Message.isRequest(message)) {
        if (message.params) {
          console.log('REQUEST', message.method, message.params);
        }

        if (message.method === InitializeRequest.type.method) {
          const initializeParams = message.params as InitializeParams;
          initializeParams.processId = process.pid;
        }
      }

      if (Message.isResponse(message)) {
        console.log('RESPONSE', message.result);
      }

      return message;
    });

    socketConnection.onClose(() => {
      console.log('Socket connection closed, disposing server connection');
      serverConnection.dispose();
    });
  }
};

const app = express();
app.use(express.json());

const httpServer = app.listen(3000);
const wss = new WebSocketServer({ noServer: true, perMessageDeflate: false });
httpServer.on('upgrade', (request, socket, head) => {
  const baseURL = `http://${request.headers.host}/`;
  const pathName =
    request.url !== undefined
      ? new URL(request.url, baseURL).pathname
      : undefined;

  if (pathName === '/') {
    wss.handleUpgrade(request, socket, head, (webSocket) => {
      const socket = {
        send: (content: any) =>
          webSocket.send(content, (error) => {
            if (error) {
              throw error;
            }
          }),
        onMessage: (cb: any) =>
          webSocket.on('message', (data) => {
            cb(data);
          }),
        onError: (cb: any) => webSocket.on('error', cb),
        onClose: (cb: any) => webSocket.on('close', cb),
        dispose: () => webSocket.close(),
      };

      if (webSocket.readyState === webSocket.OPEN) {
        launchLanguageServer(socket);
      } else {
        webSocket.on('open', () => {
          launchLanguageServer(socket);
        });
      }
    });
  }
});
