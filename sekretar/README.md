# sekretar

Konversationaler Sekretär als Agent mit dem [Mistral Agents SDK](https://docs.mistral.ai/studio/agents/getting-started/quickstart) (`from mistralai import agents`, Agent in `main.py`).

Der Agent verwaltet über zwei Studio-Connectoren:

- **Kalender** — Google Calendar (`google_calendar`): Termine lesen, anlegen, ändern, löschen, Einladungen beantworten.
- **To-Dos** — Notion (`notion`): Einträge in der Datenbank „To-Do-Liste (Kurz · Mittel · Lang)“ anlegen, aktualisieren (Status „Erledigt“), suchen.

Beide Connectoren müssen in [Mistral Studio](https://console.mistral.ai/build/connectors) verfügbar und vom Nutzer verbunden sein; beim ersten Lauf meldet der Agent sonst einen Sign-in.

## Setup

`MISTRAL_API_KEY` in `.env` eintragen (Key über die [API-Keys-Seite](https://console.mistral.ai/api-keys) in Studio erzeugen). `.env` ist git-ignored und darf nie committet werden. Ein exportierter `MISTRAL_API_KEY` im Shell hat Vorrang vor `.env`.

## Lokal ausprobieren

```bash
uv run --env-file .env agents info     # zeigt, was die CLI lädt
uv run --env-file .env agents chat     # Chat mit dem Agenten im Terminal
uv run --env-file .env python main.py  # Einmal-Abfrage aus main()
```

## Deployen (Mistral-managed)

Das Projekt muss in einem GitHub-Repository liegen (gepusht), und der GitHub-Connector muss in Studio verbunden sein. `agents deploy` baut den gepushten Commit:

```bash
git remote add origin <repository-url>
git push -u origin HEAD
uv run --env-file .env agents deploy
```

Danach erreichbar per `uv run --env-file .env agents chat sekretar`, `agents list`, `agents logs sekretar` oder aus der eigenen App mit `agents.Agent.load_from(agent_name="sekretar")`. Siehe [Deploy your agent](https://docs.mistral.ai/studio/agents/getting-started/deploy-it).
