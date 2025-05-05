import { Server } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";

let requestCount = 0;

let logger = new Logger({
  onLoadDocument: true,
      onChange: true,
      onConnect: true,
      onDisconnect: true,
      onUpgrade: true,
      onRequest: true,
      onListen: true,
      onDestroy: true,
      onConfigure: true,
});

const server = new Server({
  name: "hocuspocus-fra1-01",
  port: 1234,
  timeout: 30000,
  debounce: 5000,
  maxDebounce: 30000,
  quiet: false,
  extensions: [
    logger,
  ],
  async onConnect({documentName}) {
    console.log(`✅ Client connected to document: ${documentName}`)
  },
});

server.listen();