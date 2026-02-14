# Project Context

Fridge Assist is a personal fridge management app. Users photograph or describe their groceries, the system extracts and normalizes ingredients using AI (Google Gemini), stores them in inventory (Supabase), and suggests recipes based on what's available.

## User Flow

1. User sends a photo or text message to the Telegram bot describing groceries
2. API extracts ingredients from the input using Gemini AI
3. Ingredients are normalized against a master list and matched to existing inventory
4. User gets a preview of detected items and confirms
5. Confirmed items are added to the user's fridge inventory
6. User can ask for recipe suggestions based on current inventory
7. When a recipe is cooked, consumed ingredients are deducted from inventory

## Architecture

- **Telegram Bot** — user-facing interface, handles commands and messages, calls the API over HTTP
- **API** — backend logic, AI processing, database operations
- **Supabase** — Postgres database and auth infrastructure
- **Gemini AI** — ingredient extraction from photos/text, recipe suggestions

## Key Domains

- **Ingestion** — the pipeline for processing user input into inventory items (extraction → normalization → preview → confirmation)
- **Inventory** — user's current fridge contents with quantities and statuses
- **Recipes** — AI-generated recipe suggestions based on available ingredients
- **Users** — user registration and identification via Telegram ID + phone number
