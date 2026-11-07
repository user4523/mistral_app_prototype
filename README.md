# mistral_app_prototype

Minimale Chat-Web-App mit der Mistral-API: Du schreibst eine Nachricht, die App schickt den
Gesprächsverlauf an ihr Backend, das Backend ruft über das offizielle SDK das Modell
**`mistral-small-latest`** auf und zeigt die Antwort im Chat an. Der `MISTRAL_API_KEY` bleibt
immer serverseitig – das Frontend bekommt ihn nie zu sehen.

Zwei Wege, die App zu betreiben:

| Weg | Wo läuft sie | Details |
| --- | --- | --- |
| **Lokaler Prototyp** (Node.js + TypeScript-SDK) | `http://localhost:3000` auf deinem Rechner | siehe [local-prototype/README.md](local-prototype/README.md) |
| **Als App in Mistral Studio** (FastAPI + Python-SDK, TanStack-Start-Frontend) | gehostet auf Mistral Cloud, sichtbar unter **Apps** in console.mistral.ai | siehe [studio-app/README.md](studio-app/README.md) |

## Aufbau

- `local-prototype/` – lauffähiger lokaler Prototyp: Node/TypeScript-Server (`src/server.ts`)
  mit `POST /api/chat` über das offizielle TypeScript-SDK `@mistralai/mistralai`, Key aus `.env`;
  Chat-Oberfläche in `public/index.html`.
- `studio-app/` – Drop-in-Dateien für das Scaffold der Mistral CLI, um die App als **Studio-App**
  zu deployen (`mistral init --preset app` + `mistral deploy`): FastAPI-Router `api/chat.py`
  (Python-SDK `mistralai`, Modell `mistral-small-latest`) und Chat-Seite `web/index.tsx`.
  In Studio liegt der Key im **Secrets-Tab** der App, nicht im Repo.
