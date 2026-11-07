# mistral_app_prototype

Minimale Web-App: Chat-Schnittstelle im Browser, die die Mistral-API über das offizielle TypeScript-SDK (`@mistralai/mistralai`) aufruft. Der `MISTRAL_API_KEY` bleibt dabei ausschließlich auf dem Server – das Frontend kommuniziert nur mit dem lokalen Endpunkt `/api/chat`.

## Voraussetzungen

- Node.js 20 oder neuer
- Ein Mistral-API-Key von <https://console.mistral.ai>

## Installation

```bash
npm install
```

## Konfiguration

```bash
cp .env.example .env
```

In `.env` den eigenen Key eintragen:

```
MISTRAL_API_KEY=dein-key
```

`.env` ist via `.gitignore` vom Commit ausgeschlossen.

## Lokal ausführen

Entwicklung (mit automatischem Neustart):

```bash
npm run dev
```

Oder produktiv (Build + Start):

```bash
npm run build
npm start
```

Die App ist dann unter <http://localhost:3000> erreichbar.

## Aufbau

- `src/server.ts` – Node/TypeScript-Server: liefert `public/index.html` aus und stellt `POST /api/chat` bereit. Ruft `mistral-small-latest` über das offizielle SDK auf; der API-Key wird nur serverseitig aus `process.env` gelesen.
- `public/index.html` – einfache Chat-Oberfläche (Vanilla JS), sendet den Gesprächsverlauf an `/api/chat`.
