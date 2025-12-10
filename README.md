# autodarts-liga.de Browser Extension

Eine minimale Browser-Extension, die Autodarts-Spieldaten an autodarts-liga.de sendet.

## Features

- **Aktiviert/Deaktiviert**: Einfaches Toggle zum Aktivieren der Extension
- **Token**: Optionales Bearer Token für Authentifizierung
- **Each Dart**: Sendet jeden einzelnen Dart-Wurf
- **All Game Data**: Sendet komplette Spiel-Daten bei jeder Änderung

## Installation

### Development

```bash
# Dependencies installieren
yarn install

# Development Server starten
yarn dev
```

### Build

```bash
# Chrome Build
yarn build

# Firefox Build
yarn build:firefox

# Distribution ZIP erstellen
yarn zip
```

## Verwendung

1. Extension in Chrome/Firefox laden
2. Zu play.autodarts.io navigieren
3. Extension-Icon in der Toolbar klicken
4. Einstellungen vornehmen:
   - Extension aktivieren
   - Optional: Token eingeben
   - "Each Dart" aktivieren (für jeden Wurf)
   - "All Game Data" aktivieren (für komplette Spiel-Daten)
5. Ein Spiel starten - die Daten werden automatisch an autodarts-liga.de gesendet

## Technische Details

- **Framework**: WXT (Web Extension Toolbox)
- **Sprache**: TypeScript
- **Webhook URL**: https://autodarts-liga.de/api/webhooks
- **Manifest**: V3

## Projektstruktur

```
autodarts-liga-extension/
├── entrypoints/
│   ├── popup.html          # Popup UI
│   ├── popup.ts            # Popup Logik
│   ├── background.ts       # Background Service Worker
│   ├── websocket-capture.ts        # WebSocket Interceptor
│   ├── websocket-monitor.content.ts # Content Script für WebSocket
│   └── match.content/
│       ├── index.ts        # Match Content Script
│       └── webhooks.ts     # Webhook-Logik
├── utils/
│   ├── storage.ts          # Config Storage
│   ├── game-data-storage.ts # Game Data Storage
│   ├── websocket-helpers.ts # WebSocket Helper
│   └── helpers.ts          # Utility Functions
└── package.json

```

