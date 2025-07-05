from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
from datetime import datetime, timedelta
from typing import List, Dict
from dotenv import load_dotenv
load_dotenv() 

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Example using OpenRouter (https://openrouter.ai/) as a free/cheap LLM API
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")  # Set in Render env
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

print("Using OpenRouter key:", OPENROUTER_API_KEY)

# --- Suggestion logic helpers ---
def get_category_spending(expenses_by_day: List[Dict], category_id: str) -> float:
    total = 0
    for day in expenses_by_day:
        for exp in day.get("expenses", []):
            if exp.get("category") and exp["category"].get("_id") == category_id:
                total += exp.get("amount", 0)
    return total

def ml_agent_suggestions(expenses_by_day, category_budgets):
    prompt = (
        "Given the following user expenses and category budgets, "
        "suggest up to 5 personalized financial tips. "
        "Return your answer as a JSON array, where each item is an object with: "
        "'type' (error, warning, info), 'title' (short summary), and 'details' (explanation). "
        "Example: "
        '[{"type": "error", "title": "Travel budget exceeded", "details": "You spent 1200 on Travel, exceeding your budget of 1000."}] '
        f"Expenses: {expenses_by_day} Budgets: {category_budgets}"
    )
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "deepseek/deepseek-chat-v3-0324:free",
        "messages": [
            {"role": "system", "content": "You are a helpful financial assistant. Always respond in valid JSON as instructed."},
            {"role": "user", "content": prompt}
        ]
    }
    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        import json
        content = response.json()["choices"][0]["message"]["content"].strip()
        if content.startswith("```json"):
            content = content.split("```json")[1].split("```", 1)[0].strip()
        elif content.startswith("```"):
            content = content.split("```", 1)[1].split("```", 1)[0].strip()
        return json.loads(content)
    except Exception as e:
        print("LLM API error:", e)
        return []

@app.get("/")
def root():
    return {"status": "ok", "message": "Suggestion API is running."}

@app.get("/suggestions")
def get_suggestions(request: Request, user_token: str = Query(..., alias="token")):
    api_key = request.headers.get("x-api-key")
    if api_key != os.environ.get("SUGGESTION_API_KEY"):
        raise HTTPException(status_code=401, detail="Unauthorized")
    headers = {"Authorization": f"Bearer {user_token}"}
    # --- Fetch data from Node backend ---
    NODE_API_BASE = os.environ.get("NODE_API_BASE", "https://finease-0dj7.onrender.com/api")
    end = datetime.now()
    start = end - timedelta(days=30)
    start_str = start.strftime("%Y-%m-%d")
    end_str = end.strftime("%Y-%m-%d")
    # Expenses
    expenses_url = f"{NODE_API_BASE}/dashboard/expenses-by-day?startDate={start_str}&endDate={end_str}"
    expenses_resp = requests.get(expenses_url, headers=headers)
    expenses_data = expenses_resp.json()
    # Budgets
    budgets_url = f"{NODE_API_BASE}/categories/user-expense-categories"
    budgets_resp = requests.get(budgets_url, headers=headers)
    budgets_data = budgets_resp.json()
    result = {
        "expenses_by_day": expenses_data.get("data", []),
        "category_budgets": budgets_data.get("categories", [])
    }
    # --- Suggestion logic ---
    suggestions = []
    for cat in result["category_budgets"]:
        limit = cat.get("limit", -1)
        if limit > 0:
            spent = get_category_spending(result["expenses_by_day"], cat["_id"])
            percent = spent / limit * 100
            if percent >= 100:
                suggestions.append({"type": "error", "title": f"{cat['title']} budget exceeded", "details": f"You have exceeded your budget for {cat['title']}!"})
            elif percent >= 80:
                suggestions.append({"type": "error", "title": f"{cat['title']} budget at 80%", "details": f"You have reached 80% of your budget for {cat['title']}."})
    # Add ML agent suggestions
    generated_ml_suggestions = ml_agent_suggestions(result["expenses_by_day"], result["category_budgets"])
    suggestions.extend(generated_ml_suggestions)
    return {"suggestions": suggestions}