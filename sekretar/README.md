# sekretar

Konversationaler Sekretär als Agent mit dem [Mistral Agents SDK](https://docs.mistral.ai/studio/agents/getting-started/quickstart) (`from mistralai import agents`, Agent in `main.py`).

Der Agent arbeitet ausschließlich mit dem Studio-Connector **`google_calendar`** (muss in [Mistral Studio](https://console.mistral.ai/build/connectors) verfügbar und vom Nutzer verbunden sein; beim ersten Lauf meldet der Agent sonst einen Sign-in):

- **Termine** — im primären Kalender lesen, anlegen, ändern, löschen, Einladungen beantworten; Kollisionsprüfung vor dem Anlegen; Bestätigung vor Löschen/Ablehnen; Zeitzone Europe/Berlin.
- **To-Dos** — als ganztägige Einträge mit Titel-Präfix `To-Do: ` im Kalender „Mistral Kalender" (Fallback: primärer Kalender); Fälligkeit = Datum; Abhaken = Eintrag löschen (nach Bestätigung).

Hinweis: **Google Tasks** wird von Mistral nicht unterstützt (kein Connector im Katalog, kein `tasks`-Scope bei den Google-Connectors) — deshalb laufen To-Dos über Google Calendar.

## Direkt in Mistral/Le Chat anlegen (ohne eigenes Hosting)

Der Agent lässt sich als Agent in deinem Workspace registrieren (erscheint dann in Studio unter **Build > Agents** und in **Le Chat** chat.mistral.ai):

```bash
export MISTRAL_API_KEY=<key aus console.mistral.ai/api-keys>
uv run python create_agent_api.py
```

`create_agent_api.py` ruft `POST /v1/agents` auf (`client.beta.agents.create`) mit `tools=[{"type": "connector", "connector_id": "google_calendar"}]` und denselben Anweisungen aus `main.py`. Alternativ manuell: Studio → **Build > Agents** → neuen Agenten anlegen, Name `sekretar`, Modell `mistral-large-4`, Anweisungen aus `main.py` (`INSTRUCTIONS`), Connector `google_calendar` anhängen.

## Lokal mit dem Agents SDK

`MISTRAL_API_KEY` in `.env` eintragen. `.env` ist git-ignored und darf nie committet werden. Ein exportierter `MISTRAL_API_KEY` im Shell hat Vorrang vor `.env`.

```bash
uv run --env-file .env agents info     # zeigt, was die CLI lädt
uv run --env-file .env agents chat     # Chat mit dem Agenten im Terminal
uv run --env-file .env python main.py  # Einmal-Abfrage aus main()
```

## Deployen (Mistral-managed, Agents SDK)

Das Projekt muss in einem GitHub-Repository liegen (gepusht), und der GitHub-Connector muss in Studio verbunden sein. `agents deploy` baut den gepushten Commit:

```bash
git remote add origin <repository-url>
git push -u origin HEAD
uv run --env-file .env agents deploy
```

Danach erreichbar per `uv run --env-file .env agents chat sekretar`, `agents list`, `agents logs sekretar` oder aus der eigenen App mit `agents.Agent.load_from(agent_name="sekretar")`. Siehe [Deploy your agent](https://docs.mistral.ai/studio/agents/getting-started/deploy-it).
