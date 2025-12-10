import { AutodartsLigaConfig } from "@/utils/storage";
import { initWebhooks, removeWebhooks } from "./webhooks";

let matchInitialized = false;

export default defineContentScript({
  matches: [ "*://play.autodarts.io/*" ],
  async main(ctx) {
    const url = window.location.href;
    const matchId = url.match(/matches\/([0-9a-f-]+)/)?.[1];

    if (matchId) {
      await initMatch(ctx, url, matchId);
    } else {
      clearMatch();
    }

    // Watch for URL changes
    let lastUrl = url;
    const urlWatcher = setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        const newMatchId = currentUrl.match(/matches\/([0-9a-f-]+)/)?.[1];
        if (newMatchId) {
          initMatch(ctx, currentUrl, newMatchId);
        } else {
          clearMatch();
        }
      }
    }, 1000);

    ctx.onInvalidated(() => {
      clearInterval(urlWatcher);
      clearMatch();
    });
  },
});

async function initMatch(ctx: any, url: string, matchId?: string) {
  if (matchInitialized) return;
  matchInitialized = true;

  console.log("[autodarts-liga] Initializing match", matchId);

  const config = await AutodartsLigaConfig.getValue();
  if (config.enabled) {
    await initWebhooks().catch(console.error);
  }
}

function clearMatch() {
  if (!matchInitialized) return;
  matchInitialized = false;

  console.log("[autodarts-liga] Clearing match");
  removeWebhooks();
}

