import { HocuspocusProvider} from "@hocuspocus/provider";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Connect it to the backend
const provider = new HocuspocusProvider({
  url: "ws://127.0.0.1:1234",
  name: "example-document",
  onConnect() {
    console.log("\nConnected to Hocuspocus server...");
    rl.prompt();
  },
});

// Define `tasks` as an Array
const tasks = provider.document.getArray("tasks");

// Optional: Watch for external changes (other clients)
tasks.observe(() => {
  console.log("\nTasks were modified:");
  console.log("Current tasks:", JSON.stringify(tasks.toArray(), null, 2));

  // Clear current input line and re-show prompt
  rl.write(null, { ctrl: true, name: 'u' }); // Clears the current line
  rl.prompt(); // Re-displays the prompt
});

// Function to ask user for input
const askForTask = () => {
  rl.setPrompt("Enter a task (or 'exit'): ");
  rl.prompt();

  rl.once("line", (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      process.exit(0);
    } else {
      tasks.push([input]);
      askForTask();
    }
  });
};

askForTask();