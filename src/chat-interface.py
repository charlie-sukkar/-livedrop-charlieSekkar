import requests
import json
import traceback
from datetime import datetime, timezone

# Ask for ngrok URL
NGROK_URL = input("Enter the ngrok base URL (e.g. https://xxxx.ngrok.io): ").strip().rstrip('/')
CHAT_ENDPOINT = f"{NGROK_URL}/chat"

LOGFILE = "chat_log.jsonl"

def log_interaction(question, answer, sources, confidence):
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),  # ✅ FIXED
        "question": question,
        "answer": answer,
        "sources": sources,
        "confidence": confidence
    }
    with open(LOGFILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

def call_api(question):
    payload = {"query": question}  # <-- must match Flask
    try:
        r = requests.post(CHAT_ENDPOINT, json=payload, timeout=30)
        r.raise_for_status()
        data = r.json()
        return data.get("answer", "No answer"), data.get("sources", [])
    except requests.exceptions.Timeout:
        return "❌ Request timed out. Is your backend slow or stuck?", []
    except Exception as e:
        print(traceback.format_exc())  # ✅ FIXED
        return f"Error calling API: {e}", []
    
def main():
    print("Shoplite CLI (type 'exit' to quit)")
    while True:
        q = input("> ").strip()
        if q.lower() in ("exit", "quit"):
            print("Bye!")
            break
        print("[Retrieving context...]")
        ans, sources = call_api(q)
        print("[Calling LLM...]")
        
        print("Answer:", ans)
        print("Sources:", sources)
        confidence = "High" if sources else "Low"
        print("Confidence:", confidence)
        log_interaction(q, ans, sources, confidence)

if __name__ == "__main__":
    main()