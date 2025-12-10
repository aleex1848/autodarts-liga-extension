console.log("[autodarts-liga] Background script loading...");

export default defineBackground({
  main() {
    console.log("[autodarts-liga] Background script initialized!", { id: browser.runtime.id });

    // Handle messages from content scripts
    browser.runtime.onMessage.addListener(async (message, sender) => {
      // Handle fetch requests (for CORS bypass)
      if (message.type === "fetch") {
        try {
          // Extract the URL and options from the message
          const { url, options = {} } = message;
          console.log("[autodarts-liga] Background fetch:", url);

          // For regular fetches (webhooks)
          return fetch(url, options)
            .then(async (response) => {
              if (response.ok) {
                const text = await response.text();
                return {
                  ok: true,
                  status: response.status,
                  statusText: response.statusText,
                  data: text,
                };
              } else {
                return {
                  ok: false,
                  status: response.status,
                  statusText: response.statusText,
                  error: `HTTP ${response.status}: ${response.statusText}`,
                };
              }
            })
            .catch((error) => {
              console.error("[autodarts-liga] Error in background fetch:", error);
              return {
                ok: false,
                error: error instanceof Error ? error.message : String(error),
              };
            });
        } catch (error) {
          console.error("[autodarts-liga] Error in background fetch:", error);
          return {
            ok: false,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      }

      return true; // Keep the message channel open for async responses
    });
  },
});

