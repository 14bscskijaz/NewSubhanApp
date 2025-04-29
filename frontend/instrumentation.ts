import { Logger } from "pino";

declare global {
  // var usage is required for global declaration
  // eslint-disable-next-line no-var
  var logger: Logger | undefined;  // Declare a global variable for the logger
}

export async function register() {
  console.log("Instrumentation registered");  
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log("-----------------Node.js runtime detected-------------------");

    const pino = (await import("pino")).default;
    const pinoLoki = (await import("pino-loki")).default;

    const transport = pinoLoki({
      // host: process.env.NEXT_PUBLIC_LOKI_URL || "http://localhost:3100" || "https://newsubhan.com/3000",  // Loki server URL
      host: "http://localhost:3100",  // Loki server URL
      batching: true,  // Enable batching of logs for better performance
      interval: 5,  // Send logs every 5 seconds
      labels: { app: "ns-accounts-app" },  // Add application labels to all logs
    });

    const logger = pino(transport);
    globalThis.logger = logger;  // Make logger globally accessible
  }
  // Client-side logging is handled separately via the logger.ts utility
}