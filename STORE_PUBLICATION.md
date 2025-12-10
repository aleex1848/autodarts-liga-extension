# Anleitung: Extension in Chrome Web Store und Firefox Add-ons veröffentlichen

## Vorbereitung

### 1. Builds erstellen

```bash
# Chrome Build erstellen
yarn build

# Firefox Build erstellen
yarn build:firefox

# ZIP-Dateien für Upload erstellen
yarn zip          # Chrome: .output/chrome-mv3.zip
yarn zip:firefox  # Firefox: .output/firefox-mv3.zip
```

Die ZIP-Dateien befinden sich im `.output/` Verzeichnis.

### 2. Version aktualisieren

Vor jeder Veröffentlichung die Version in `package.json` erhöhen:
- Patch: `1.0.0` → `1.0.1` (Bugfixes)
- Minor: `1.0.0` → `1.1.0` (neue Features)
- Major: `1.0.0` → `2.0.0` (Breaking Changes)

## Chrome Web Store

### 1. Developer Account erstellen

1. Gehe zu [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Melde dich mit deinem Google-Account an
3. Zahle einmalig $5 USD Registrierungsgebühr
4. Akzeptiere die Developer Agreement

### 2. Extension hochladen

1. Klicke auf "Neues Element"
2. Wähle "Extension" aus
3. Lade die ZIP-Datei hoch: `.output/chrome-mv3.zip`
4. Fülle die Store-Listing-Informationen aus:

**Erforderliche Informationen:**
- **Name**: autodarts-liga.de
- **Kurze Beschreibung** (132 Zeichen max):
  ```
  Sendet Autodarts-Spieldaten an autodarts-liga.de für Liga-Verwaltung und Statistiken.
  ```
- **Detaillierte Beschreibung**:
  ```
  Diese Browser-Extension ermöglicht es, Autodarts-Spieldaten automatisch an autodarts-liga.de zu senden.

  Features:
  - Einfaches Aktivieren/Deaktivieren
  - Optionales Bearer Token für Authentifizierung
  - Jeden Dart-Wurf einzeln senden (Each Dart)
  - Komplette Spiel-Daten bei jeder Änderung senden (All Game Data)
  - Local Debug Modus für Entwicklung

  Verwendung:
  1. Extension aktivieren
  2. Optional: Token eingeben
  3. Zu play.autodarts.io navigieren
  4. Ein Spiel starten - Daten werden automatisch gesendet
  ```

**Bilder:**
- **Kleines Symbol** (128x128): `public/icon/icon.png`
- **Screenshots** (mindestens 1, empfohlen 3-5):
  - Screenshot des Popups
  - Screenshot der Extension in Aktion auf play.autodarts.io
  - Optional: Screenshot der Einstellungen

**Kategorien:**
- Primär: "Produktivität" oder "Spiele"
- Sekundär: Optional

**Kontakt-Informationen:**
- E-Mail-Adresse für Support
- Website (optional): https://autodarts-liga.de

**Datenschutz:**
- Datenschutzerklärung URL (falls erforderlich)
- Erkläre, welche Daten gesammelt werden:
  - Spiel-Daten von play.autodarts.io
  - Lokale Speicherung der Konfiguration
  - Daten werden nur an die konfigurierte Webhook-URL gesendet

### 3. Review-Prozess

- Chrome prüft die Extension automatisch
- Dauer: Normalerweise 1-3 Werktage
- Du erhältst eine E-Mail mit dem Ergebnis
- Bei Ablehnung: Fehler beheben und erneut einreichen

### 4. Updates veröffentlichen

1. Neue Version in `package.json` setzen
2. Neuen Build erstellen: `yarn build && yarn zip`
3. Im Developer Dashboard: "Paket" → "Neue Version hochladen"
4. Änderungsprotokoll angeben

## Firefox Add-ons (AMO)

### 1. Developer Account erstellen

1. Gehe zu [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
2. Melde dich mit deinem Firefox Account an (kostenlos)
3. Verifiziere deine E-Mail-Adresse

### 2. Extension hochladen

1. Klicke auf "Neues Add-on einreichen"
2. Wähle "Auf dieser Website einreichen" (nicht "Self-distribution")
3. Lade die ZIP-Datei hoch: `.output/firefox-mv3.zip`
4. Fülle die Store-Informationen aus:

**Erforderliche Informationen:**
- **Name**: autodarts-liga.de
- **Zusammenfassung** (250 Zeichen max):
  ```
  Sendet Autodarts-Spieldaten an autodarts-liga.de für Liga-Verwaltung und Statistiken.
  ```
- **Beschreibung**:
  ```
  Diese Browser-Extension ermöglicht es, Autodarts-Spieldaten automatisch an autodarts-liga.de zu senden.

  Features:
  - Einfaches Aktivieren/Deaktivieren
  - Optionales Bearer Token für Authentifizierung
  - Jeden Dart-Wurf einzeln senden (Each Dart)
  - Komplette Spiel-Daten bei jeder Änderung senden (All Game Data)
  - Local Debug Modus für Entwicklung

  Verwendung:
  1. Extension aktivieren
  2. Optional: Token eingeben
  3. Zu play.autodarts.io navigieren
  4. Ein Spiel starten - Daten werden automatisch gesendet
  ```

**Bilder:**
- **Icon** (48x48): `public/icon/icon.png`
- **Screenshots** (mindestens 1, empfohlen 3-5):
  - Screenshot des Popups
  - Screenshot der Extension in Aktion

**Kategorien:**
- Primär: "Spiele" oder "Produktivität"

**Kontakt-Informationen:**
- E-Mail-Adresse für Support
- Website (optional): https://autodarts-liga.de

**Datenschutz:**
- Datenschutzerklärung URL (falls erforderlich)
- Erkläre, welche Daten gesammelt werden

### 3. Source Code Upload (optional, aber empfohlen)

Firefox erlaubt es, den Source Code hochzuladen für bessere Transparenz:
- Erstelle ein ZIP mit dem Source Code (ohne `node_modules`, `.output`, etc.)
- Optional hochladen

### 4. Review-Prozess

- Firefox prüft die Extension manuell
- Dauer: Normalerweise 1-7 Werktage
- Du erhältst eine E-Mail mit dem Ergebnis
- Bei Ablehnung: Fehler beheben und erneut einreichen

### 5. Updates veröffentlichen

1. Neue Version in `package.json` setzen
2. Neuen Build erstellen: `yarn build:firefox && yarn zip:firefox`
3. Im Developer Hub: "Versionen" → "Neue Version hochladen"
4. Änderungsprotokoll angeben

## Wichtige Hinweise

### Permissions rechtfertigen

Beide Stores prüfen, ob die angeforderten Permissions gerechtfertigt sind:

- **host_permissions**: `*://play.autodarts.io/*` - für WebSocket-Interception
- **host_permissions**: `https://autodarts-liga.de/*` - für Webhook-Versand
- **storage**: für lokale Konfigurationsspeicherung

Erkläre in der Beschreibung, warum diese Permissions benötigt werden.

### Datenschutz

- Erkläre klar, welche Daten gesammelt werden
- Erkläre, wohin die Daten gesendet werden
- Erkläre, dass Daten nur lokal gespeichert werden (Konfiguration)
- Erkläre, dass Spiel-Daten nur an die konfigurierte URL gesendet werden

### Testing vor Veröffentlichung

1. Extension lokal testen:
   ```bash
   yarn dev          # Chrome
   yarn dev:firefox  # Firefox
   ```

2. Build testen:
   ```bash
   yarn build
   # Extension aus .output/chrome-mv3/ manuell in Chrome laden
   ```

3. Alle Features testen:
   - Extension aktivieren/deaktivieren
   - Token eingeben
   - Each Dart aktivieren
   - All Game Data aktivieren
   - Local Debug testen
   - Webhook-Versand prüfen

## Checkliste vor Veröffentlichung

- [ ] Version in `package.json` aktualisiert
- [ ] Icon vorhanden (`public/icon/icon.png`)
- [ ] Build erfolgreich erstellt
- [ ] ZIP-Dateien erstellt
- [ ] Extension lokal getestet
- [ ] Beschreibungstexte vorbereitet
- [ ] Screenshots erstellt
- [ ] Datenschutzerklärung vorbereitet (falls erforderlich)
- [ ] Support-E-Mail-Adresse bereit

## Nützliche Links

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Firefox Add-on Policies](https://extensionworkshop.com/documentation/publish/add-on-policies/)

