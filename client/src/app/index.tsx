import { Editor } from '../components/editor';

export function App() {
  return (
    <div>
      <Editor
        title="com.example.Main"
        fileUri="file:///path/to/java-project/demo/src/main/java/com/example/Main.java"
      />
      <Editor
        title="com.example.Car"
        fileUri="file:///path/to/java-project/demo/src/main/java/com/example/Car.java"
      />
    </div>
  );
}
