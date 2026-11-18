import os

from mistralai import Mistral

from main import INSTRUCTIONS

MODEL = "mistral-large-4"
NAME = "sekretar"
CONNECTORS = ["google_calendar"]


def main() -> None:
    api_key = os.environ.get("MISTRAL_API_KEY")
    if not api_key:
        raise SystemExit("MISTRAL_API_KEY ist nicht gesetzt (Key in console.mistral.ai/api-keys erzeugen).")
    client = Mistral(api_key=api_key)
    agent = client.beta.agents.create(
        model=MODEL,
        name=NAME,
        description="Persönlicher Sekretär: verwaltet Termine und To-Dos in Google Calendar.",
        instructions=INSTRUCTIONS,
        tools=[{"type": "connector", "connector_id": connector} for connector in CONNECTORS],
    )
    print(f"Agent angelegt: id={agent.id} name={agent.name} version={agent.version}")
    print("Er erscheint in Studio unter Build > Agents und ist in Le Chat (chat.mistral.ai) wählbar.")


if __name__ == "__main__":
    main()
