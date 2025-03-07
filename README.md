# Monaco Editor Test Client (with Java LS)

This monorepo contains a Monaco Editor test client integrated with a Java Language Server through a Node.js WebSocket server.

## Structure

- **client/**: Monaco Editor test client built with Vite.
- **server/**: Node.js WebSocket server that communicates with the Java Language Server.
- **java-project/demo/**: Java project source code used for testing in the Monaco Editor.

## Getting Started

### Server Setup

To set up and start the server:

```bash
cd server
npm install
npm run build
npm run start
```

### Client Setup

In the file client/src/app/index.tsx, change the paths to absolute paths according to your machine because the language server works with file URIs, which are based on absolute paths.

To set up and run the client:

```bash
cd client
npm install
npm run dev
```

Open the browser at http://localhost:5173/. Then, simply copy and paste the source code from the Java project classes from the /java-project/demo into the Monaco Editor, or write your own code to test the Monaco Editor features.
