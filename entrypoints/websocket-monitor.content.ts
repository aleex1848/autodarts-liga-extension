/**
 * Content script that injects the WebSocket capture script
 */
import { processWebSocketMessage } from "@/utils/websocket-helpers";

export default defineContentScript({
  matches: [ "*://play.autodarts.io/*" ],
  async main(ctx) {
    console.log("[autodarts-liga] Injecting WebSocket capture script...");

    try {
      // Inject the script into the page
      await injectScript("/websocket-capture.js", {
        keepInDom: true,
      });

      console.log("[autodarts-liga] WebSocket capture script injected successfully");

      // Listen for incoming WebSocket messages
      ctx.addEventListener(window, "websocket-incoming", (event: CustomEvent) => {
        const { data } = event.detail;

        // Only process string data that can be parsed as JSON
        if (typeof data === "string") {
          try {
            // Try to parse JSON data
            const jsonData = JSON.parse(data);
            processWebSocketMessage(jsonData.channel, jsonData.data).catch(console.error);
          } catch (e) {
            // Not JSON data, don't log
          }
        }
      });

      // Listen for outgoing WebSocket messages (not needed for webhooks, but keeping for consistency)
      ctx.addEventListener(window, "websocket-outgoing", (event: CustomEvent) => {
        const { data } = event.detail;

        // Only process string data that can be parsed as JSON
        if (typeof data === "string") {
          try {
            // Try to parse JSON data
            const jsonData = JSON.parse(data);
            // Not needed for webhooks
          } catch (e) {
            // Not JSON data, don't log
          }
        }
      });
    } catch (error) {
      console.error("[autodarts-liga] Failed to inject WebSocket capture script:", error);
    }
  },
});

