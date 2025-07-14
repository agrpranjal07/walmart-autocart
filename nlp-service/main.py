from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Literal, Union
import uvicorn
import json
import google.generativeai as genai
from PIL import Image
import os
from dotenv import load_dotenv

load_dotenv()


# SETUP GEMINI
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
model_text = genai.GenerativeModel("gemini-2.0-flash-lite")
model_vision = genai.GenerativeModel("gemini-2.0-flash-lite")

# ==== FastAPI Setup ====
app = FastAPI()

class InputPayload(BaseModel):
    type: Literal["image", "text", "list"]
    content: Union[str, list]

# === JSON Save Utility ===
def save_json(data, filename="output.json"):
    with open(filename, "w") as f:
        json.dump(data, f, indent=2)

# === Format conversion ===
def convert_to_final_format(items):
    result = []
    for line in items:
        if not line.strip():
            continue
        name = line.split()[0]
        query = line.strip()
        result.append({"name": name, "query": query})
    return result

# === Handlers ===
def handle_image_input(content):
    image = Image.open(image)

    prompt = """
You are an AI assistant.
Read the image of a shopping list and return the list items as plain lines (no JSON formatting).
If the image is too blurry or can't be interpreted properly, respond exactly with:
{ "flag": "bad_image" }
Otherwise, return items like:
milk 2L
colgate mint toothpaste
5kg basmati rice
some chocolates for kids
"""
    response = model_vision.generate_content([prompt, image])
    raw = response.text.strip()

    if '{"flag": "bad_image"}' in raw or "bad_image" in raw:
        return {"flag": "bad_image"}

    lines = raw.splitlines()
    return convert_to_final_format(lines)

def handle_text_input(text):
    prompt = f"""
You are an AI assistant. Your job is to convert shopping lists written in free text to a structured format.
For each item, return a JSON object with:
- "name": product name
- "query": full detailed search query (quantity, brand, context)

Only return the JSON array. Example:
[
  {{
    "name": "Milk",
    "query": "2L Amul Milk"
  }},
  {{
    "name": "Rice",
    "query": "5kg Basmati Rice"
  }}
]

List:
{text}
"""
    response = model_text.generate_content(prompt)
    content = response.text.strip()

    if content.startswith("json"):
        content = content.replace("json", "").replace("", "").strip()
    elif content.startswith(""):
        content = content.replace("```", "").strip()

    try:
        return json.loads(content)
    except:
        return {"error": "Failed to parse Gemini response", "raw": content}

def handle_list_input(json_str):
    # try:
    #     items = json.loads(json_str)
    #     result = []
    #     for item in items:
    #         name = item.get("Product Name", "").strip()
    #         qty = item.get("Quantity", "").strip()
    #         extra = item.get("Extra Context", "").strip()
    #         query = " ".join(part for part in [qty, name, extra] if part)
    #         result.append({"name": name or "unknown", "query": query})
    #     return result
    # except:
    #     return {"error": "Invalid list format"}
    prompt = f"""
You are an AI assistant. Your job is to convert a list of products into a structured format.
For each item, return a JSON object with:
- "name": product name
- "query": full detailed search query (quantity, brand, context)
Only return the JSON array. Example:
[
  {{
    "name": "Milk",
    "query": "2L Amul Milk"
  }},
  {{
    "name": "Rice",
    "query": "5kg Basmati Rice"
  }}
]

List:
{json_str}
"""
    response = model_text.generate_content(prompt)
    # Clean the response
    content = response.text.strip()
    print(f"nlp-service: Gemini response: {content}")
    if content.startswith("json"):
        content = content.replace("json", "").replace("", "").strip()
    if content.startswith("```json"):
        content = content.replace("```json", "").strip()
    if content.startswith("```"):
        content = content.replace("```", "").strip()
    if content.startswith(""):
        content = content.replace("```", "").strip()
    try:
        return json.loads(content)
    except:
        return {"error": "Failed to parse Gemini response", "raw": content}
    

    # === Route ===
@app.post("/api/extract-products")
async def process_input(payload: InputPayload):
    input_type = payload.type
    content = payload.content

    if input_type == "image":
        result = handle_image_input(content)
    elif input_type == "text":
        result = handle_text_input(content)
        # Try to fix Gemini's response if parsing failed
        if isinstance(result, dict) and "error" in result and "raw" in result:
            raw = result["raw"]
            # Remove leading 'json' and any code block markers
            cleaned = raw.replace("json", "").replace("```", "").strip()
            try:
                result = json.loads(cleaned)
            except Exception:
                result = {"error": "Failed to parse Gemini response after cleaning", "raw": cleaned}
    elif input_type == "list":
        json_str = json.dumps(content) if isinstance(content, list) else content
        result = handle_list_input(json_str)
    else:
        return JSONResponse(status_code=400, content={"error": "Invalid input type"})

    save_json(result)
    print(f"nlp-service: Processed input and saved to output.json, {result}")
    return JSONResponse(content=result)

# === Start the server ===
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=4001, reload=True)