# In Mistral Studio als App deployen

Die App ist eine Chat-Web-App: Das Frontend (TanStack Start) schickt den Gesprächsverlauf an
`POST /api/chat`, das FastAPI-Backend ruft mit dem offiziellen Python-SDK (`mistralai`) das Modell
`mistral-small-latest` auf und liefert die Antwort zurück. `MISTRAL_API_KEY` bleibt serverseitig:
lokal in `.env`, in Studio im **Secrets-Tab** der App (pro Modul, z. B. `api`) – die CLI lädt `.env`
niemals hoch.

Die Dateien hier sind Drop-ins für das Scaffold, das die Mistral CLI erzeugt.

## Voraussetzungen

- Mistral CLI: `curl -fsSL https://mistral.ai/cli/install.sh | bash`, danach neues Terminal
  (`source ~/.zshrc` bzw. `~/.bashrc`) und `mistral --version` prüfen. Apps brauchen Bun – der
  Installer installiert es auf Nachfrage (`MISTRAL_INSTALL_BUN=1` für ohne Nachfrage).
- `mistral login` (Browser-Sign-in) und `mistral context show`.
- Docker (lokal für `mistral dev`, wegen der Postgres-DB des Presets).
- GitHub: Die **Mistral-GitHub-App muss auf diesem Repository installiert** sein und dein
  Mistral-Account mit GitHub verbunden sein – die Plattform klont den gepushten Commit darüber.
- Plan: Apps anlegen erfordert einen Plan mit Apps (auf dem Free-Plan sind die Deploy-Befehle
  sichtbar, aber Apps können nicht angelegt werden).

## Schritte

```bash
# 1. Scaffold erzeugen (in einem leeren Verzeichnis)
mistral init mistral-app-prototype --preset app
cd mistral-app-prototype

# 2. Chat-Code aus diesem Repo als Drop-ins übernehmen
cp /Pfad/zu/mistral_app_prototype/studio-app/api/chat.py \
   apps/api/src/api/routers/api/internal/chat.py
cp /Pfad/zu/mistral_app_prototype/studio-app/web/index.tsx \
   apps/web/src/routes/index.tsx

# 3. Lokal testen: in .env den MISTRAL_API_KEY eintragen, dann
mistral dev
# URL aus der Ausgabe öffnen, z. B. http://mistral-app-prototype.apps.localhost:8080

# 4. Deployen: Repo als origin anbinden, pushen, deployen (clean working tree!)
git remote add origin https://github.com/user4523/mistral_app_prototype.git
git add -A && git commit -m "Mistral Studio chat app" && git push -u origin main
mistral deploy
# Organisation/Workspace auswählen; die CLI druckt am Ende die App-URL und den Link in Studio
```

Danach erscheint die App unter **Apps** in Mistral Studio (console.mistral.ai). Vor dem ersten
Benutzen im **Secrets-Tab** der App `MISTRAL_API_KEY` für das Modul `api` setzen. Die erste
Bereitstellung schreibt das Deployment-Ziel in `mistral.json` – die angebotene Datei mit
committen und pushen.

Weitere Abrufe/Logs: `mistral apps logs api` (siehe [Deploy-Doku](https://docs.mistral.ai/studio/apps/deploy)).
Optional kann die App danach mit `mistral apps publish` in Vibe veröffentlicht werden
(siehe [Publish to Vibe](https://docs.mistral.ai/studio/apps/publish-to-vibe)).

## Dateien

- `api/chat.py` → `apps/api/src/api/routers/api/internal/chat.py` – FastAPI-Router,
  `POST /api/chat`, ruft `mistral-small-latest` über `utils.mistral.mistral_client()` auf
  (Key aus `MISTRAL_API_KEY`). Das Router-Verzeichnis ist das URL-Verzeichnis: die Datei landet
  unter `/api/chat`.
- `web/index.tsx` → `apps/web/src/routes/index.tsx` – Chat-Seite (React/TanStack Router), ruft
  per `fetch` same-origin `/api/chat` auf.
