import { AutodartsLigaConfig } from "@/utils/storage";
import type { IConfig } from "@/utils/storage";
import { AutodartsLigaGameData } from "@/utils/game-data-storage";
import { backgroundFetch, safeClone } from "@/utils/helpers";
import type { IMatch } from "@/utils/websocket-helpers";

const WEBHOOK_URL = "https://autodarts-liga.de/api/webhooks";
const LOCAL_DEBUG_URL = "https://ads.localhost.test/api/webhooks";

let unwatchGameData: (() => void) | null = null;
let lastMatchId: string | null = null;
let lastMatchSnapshot = "";
const processedThrowIds = new Set<string>();
const processedThrowIdsQueue: string[] = [];
const MAX_TRACKED_THROWS = 500;

export async function initWebhooks() {
  if (unwatchGameData) return;

  unwatchGameData = AutodartsLigaGameData.watch(handleGameDataUpdate);
}

export function removeWebhooks() {
  if (unwatchGameData) {
    unwatchGameData();
    unwatchGameData = null;
  }

  processedThrowIds.clear();
  processedThrowIdsQueue.length = 0;
  lastMatchId = null;
  lastMatchSnapshot = "";
}

async function handleGameDataUpdate(current: { match?: IMatch }) {
  const config = await AutodartsLigaConfig.getValue();
  if (!config?.enabled) return;

  const match = current?.match;
  if (!match) return;

  if (lastMatchId && match.id !== lastMatchId) {
    processedThrowIds.clear();
    processedThrowIdsQueue.length = 0;
    lastMatchSnapshot = "";
  }
  lastMatchId = match.id;

  if (config.allGameData) {
    const snapshot = JSON.stringify(match);
    if (snapshot && snapshot !== lastMatchSnapshot) {
      lastMatchSnapshot = snapshot;
      dispatchWebhook("match_state", { match: safeClone(match) }, config);
    }
  }

  if (config.eachDart) {
    processThrows(match, config);
  }
}

function processThrows(match: IMatch, config: IConfig) {
  const turns = match.turns || [];
  for (const turn of turns) {
    const throws = turn.throws || [];
    for (let index = 0; index < throws.length; index += 1) {
      const throwData = throws[index];
      const throwKey = throwData.id ? `${turn.id}:${throwData.id}` : `${turn.id}:${index}:${throwData.createdAt}`;
      if (processedThrowIds.has(throwKey)) continue;

      processedThrowIds.add(throwKey);
      processedThrowIdsQueue.push(throwKey);
      if (processedThrowIdsQueue.length > MAX_TRACKED_THROWS) {
        const oldest = processedThrowIdsQueue.shift();
        if (oldest) processedThrowIds.delete(oldest);
      }

      dispatchWebhook(
        "throw",
        {
          matchId: match.id,
          turnId: turn.id,
          playerId: turn.playerId,
          playerName: match.players?.find(player => player.id === turn.playerId)?.name,
          leg: match.leg,
          set: match.set,
          round: turn.round,
          score: turn.score,
          throw: safeClone(throwData),
        },
        config,
      );
    }
  }
}

async function dispatchWebhook(event: string, data: Record<string, any>, config: IConfig) {
  const payload = {
    event,
    timestamp: new Date().toISOString(),
    source: "autodarts-liga.de",
    matchId: data.match?.id ?? data.matchId,
    variant: (data.match as IMatch)?.variant || undefined,
    data,
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.token) {
    headers.Authorization = `Bearer ${config.token}`;
    headers["X-Autodarts-Liga-Token"] = config.token;
  }

  const webhookUrl = config.localDebug ? LOCAL_DEBUG_URL : WEBHOOK_URL;

  try {
    const response = await backgroundFetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error(
        "[autodarts-liga] Webhook failed",
        event,
        webhookUrl,
        response.status,
        response.statusText ?? response.error,
      );
      return;
    }
    console.log(
      "[autodarts-liga] Sent webhook",
      event,
      webhookUrl,
      "status",
      response.status,
      response.statusText || response.error,
    );
  } catch (error) {
    console.error("[autodarts-liga] Webhook error", event, webhookUrl, error);
  }
}

