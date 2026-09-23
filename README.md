# FreshBites: beginner practice project

A small implementation inspired by pages 2 and 4 of your PDF. It uses FastAPI, synchronous SQLAlchemy, local SQLite, Next.js App Router, plain JavaScript, and Tailwind CSS 4.

The complete source is included. Work through the steps below in order; you do not need to understand all of React before getting the API running.

## 1. Understand what you are building

| Part | Responsibility |
| --- | --- |
| SQLite | Stores food name, description, category, image URL and price |
| FastAPI | Reads SQLite and returns the food list as JSON |
| Next.js home page | Fetches and displays foods; provides search and categories |
| React cart state | Remembers selected food IDs and quantities; recalculates totals |
| Browser localStorage | Keeps the cart after refreshing this browser |
| Cart page | Displays selected foods, quantity buttons, remove buttons and total |

There is one database table: `foods`. There is no login, user table, shared server cart, payment, or order processing. Different browsers have separate carts. The cart is not synchronized across devices or already-open tabs. Clearing site data removes it.

The only application endpoint you need is `GET /foods`. `GET /health` is a small deployment health check. An Add to Cart click updates React state, so it does not need a POST request. This is the simplest design for the requested demo; storing carts in SQLite would be a separate exercise.

All backend database operations and route functions are synchronous: ordinary `def`, a normal SQLAlchemy `Session`, and no `await`. Browser `fetch` still works asynchronously, as normal browser networking does.

The styling follows the reference's orange accents, pale background, food cards, hero, categories and two-column cart. It is a simplified recreation. App-store promotions, account links, promo codes and checkout are omitted; the total is simply the sum of item prices, with free delivery and no added tax. Photos are external sample Unsplash image URLs, not the PDF's exact images.

## 2. Open the project

Extract `freshbites-starter.zip` and open its `freshbites` folder in VS Code. Install Python 3.12 and Node.js 22 first if they are missing. Run commands from VS Code's terminal.

Key files:

| File | What to learn from it |
| --- | --- |
| `backend/main.py` | Engine, table model, response model, session dependency and GET endpoint |
| `backend/foods.json` | Sample rows inserted when the database is empty |
| `frontend/app/page.jsx` | Home page, search, filtering and Add to Cart |
| `frontend/app/cart/page.jsx` | Cart items, plus/minus/remove and order total |
| `frontend/app/store.jsx` | Shared React state, fetch and localStorage |
| `frontend/lib/cart.js` | Small functions for quantities and exact price calculation |
| `frontend/app/layout.jsx` | Wraps both pages with the shared provider and header/footer |
| `frontend/app/components.jsx` | Header, footer, loading and error messages |
| `frontend/app/globals.css` | Tailwind import and a few shared styles |
| `.github/workflows/ci.yml` | Tests and builds when code is pushed to GitHub |

You do not need to run create-next-app: this download already includes the Next.js setup and package-lock.json. If learning by typing, create these files manually using the full code companion instead.

## 3. Run just the backend first

From the project root:

```bash
cd backend
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Or on Linux/macOS:

```bash
source .venv/bin/activate
```

Then:

```bash
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```

If your machine calls Python `python3`, use that for the venv command. On Windows, `py -3.12 -m venv .venv` also works.

Open http://localhost:8000/docs and try **GET /foods → Try it out → Execute**. You should get six foods. The first startup creates `backend/food.db` and inserts the rows from `foods.json`; later startups reuse them.

Example response item:

```json
{
  "id": 1,
  "name": "Truffle Burger Supreme",
  "description": "Beef patty, melted cheese, mushrooms and truffle mayo.",
  "category": "Burgers",
  "price_cents": 1499,
  "image_url": "https://images.unsplash.com/..."
}
```

`1499` means $14.99. Integer cents avoid floating-point surprises when adding money.

Read `main.py` in this order:

1. `create_engine(...)` points SQLAlchemy at your SQLite file.
2. `Food` describes the table; `FoodOut` describes the returned JSON.
3. `initialize_database()` creates and seeds an empty database. For this small single-worker app it runs when the module loads.
4. `get_db()` opens one session for each request and closes it afterwards.
5. `get_foods()` selects the rows and returns them.
6. CORS allows the browser at port 3000 to call the API at port 8000. It is not authentication.

## 4. Run the frontend

Leave the backend terminal running. Open a second terminal at the project root:

```bash
cd frontend
npm ci
```

Create `frontend/.env.local` containing:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then:

```bash
npm run dev
```

Open http://localhost:3000. The home page requests the menu from FastAPI. Add some foods, then click Cart. You can also open http://localhost:3000/cart/ directly.

## 5. Understand the frontend data flow

`layout.jsx` puts `ShopProvider` around both pages. The provider holds shared data, so navigating between Home and Cart does not discard the cart. Components read it with `useShop()`.

The provider fetches foods once when it mounts:

```javascript
fetch(`${API_URL}/foods`)
  .then((response) => response.json())
  .then(setFoods);
```

The actual file also handles HTTP errors, loading, and request cancellation.

The cart's shape is intentionally small:

```javascript
{ "1": 2, "4": 1 }
```

This means two of food 1 and one of food 4. Prices are read from the fetched food list, not saved in the cart. An ID absent from the current menu is ignored when displaying the cart.

Add to Cart calls `change(food.id, 1)`. The minus button calls `change(food.id, -1)`. Going below one removes that item; the Remove button removes the entire row. The upper limit is 99 of each food.

The total is derived from current state on every render:

```javascript
const subtotal = items.reduce(
  (sum, item) => sum + item.price_cents * item.quantity,
  0
);
```

`setCart(...)` makes React render again. That is how the price updates immediately; no WebSocket, polling, or backend calculation request is needed. `localStorage` is accessed inside `useEffect`, so server-side page generation does not try to use browser-only APIs.

Do not trust a browser-calculated total for real payment. If you later add checkout, the server must read current database prices and calculate the amount itself. This project does not accept payments.

## 6. Try the main behavior

1. Add one burger ($14.99) and one pizza ($12.50): total **$27.49**.
2. In Cart, press plus on the burger: total **$42.48**.
3. Press minus on the burger: total **$27.49**.
4. Remove pizza: total **$14.99**.
5. Refresh: the burger should remain.
6. Remove the final item: you should see the empty-cart page.
7. Try searching and category filters on Home.

Food IDs and quantities persist on this browser origin only. Localhost and your deployed website have separate storage.

## 7. Change the foods

For this exercise, edit `backend/foods.json` instead of building an admin panel. To replace your local sample data:

1. Stop the backend with Ctrl+C.
2. Edit the JSON. Keep IDs unique and positive, and prices as nonnegative integer cents.
3. Delete only `backend/food.db` (this resets the local sample database).
4. Start the backend again and refresh the browser.

Keep an existing ID associated with the same food, because saved carts refer to IDs. No database file is committed to Git. On a fresh Render deployment, the current JSON will seed a new database automatically.

For your own photos, put files in `frontend/public/foods/` and use values such as `/foods/burger.jpg` for `image_url`. Also change the hero image in `app/page.jsx` if desired.

## 8. Run the small checks

In the backend terminal, with its virtual environment active:

```bash
python -m pip install -r requirements-dev.txt
python -m pytest -q
```

This uses a disposable SQLite database to check seeding, the API response and CORS. It does not modify your normal `food.db`.

In the frontend terminal:

```bash
npm test
npm run build
```

The tests check quantity changes and money calculations. The build checks that Next.js can generate the static pages. `output: "export"` in `next.config.mjs` produces a folder named `out`; the API fetch happens in the visitor's browser, so the API does not need to run during this build.

## 9. Push to GitHub

Create an empty GitHub repository named `freshbites` without initializing a README. Then run these commands from your local project root, replacing YOUR_USERNAME:

```bash
git init
git add .
git commit -m "Build simple food menu and cart"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/freshbites.git
git push -u origin main
```

The repository root should directly contain `backend`, `frontend`, and `.github`. Commit `frontend/package-lock.json`: `npm ci` uses it to install the same dependency versions in CI and on Render. The included `.gitignore` excludes your database, environments, installed packages and build output.

## 10. Deploy the backend on Render

Use one free Python Web Service for the API and one free Static Site for the exported Next.js frontend. Both connect to the same repository.

Create a **Web Service** and choose your GitHub repository:

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Root Directory | `backend` |
| Language | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Instance Type | Free |
| Health Check Path | `/health` |
| Environment variable | `PYTHON_VERSION=3.12.14` |

Deploy. Copy the actual URL Render gives you, for example `https://freshbites-api-xxxx.onrender.com`. Confirm `/docs` and `/foods` work at that URL. Names here are examples, not existing deployments.

**Free-tier SQLite limitation:** Render's free web-service filesystem is temporary. Local database changes are lost on redeploy, restart, or spin-down; free web services cannot attach persistent disks. This demo works around that only for sample foods by recreating and seeding the database. It does not provide durable online SQLite storage. Your local SQLite file remains persistent on your own computer. The frontend cart remains in the visitor's browser. Free services can also sleep after inactivity, so the first request can take longer.

## 11. Deploy the frontend on Render

Create a **Static Site** from the same repository:

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Root Directory | `frontend` |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `out` |
| Environment variable | `NODE_VERSION=22` |
| Environment variable | `NEXT_PUBLIC_API_URL=https://YOUR-ACTUAL-API.onrender.com` |

Set the API URL before building. Do not include `/foods` or a trailing slash. No frontend Start Command is needed for a Static Site. You do not need a wildcard SPA rewrite: the export includes both `index.html` and `cart/index.html`.

After Render gives you the frontend URL, open the **backend's** Environment settings and add:

```dotenv
FRONTEND_URL=https://YOUR-ACTUAL-FRONTEND.onrender.com
```

Save and redeploy the backend. This value is the frontend origin, with no path or trailing slash. To allow more than one origin, separate them with commas.

Now visit the frontend, add a food, open Cart, and refresh `/cart/` directly. The API URL is public configuration, not a secret. Changes to `NEXT_PUBLIC_API_URL` require rebuilding the frontend because Next.js embeds it in the generated JavaScript.

## 12. Basic CI/CD

The included GitHub Actions workflow does two jobs:

1. Install backend dependencies and run the API test.
2. Install frontend dependencies, run cart tests, and build Next.js.

After the first successful GitHub Actions run, open **each** Render service's Settings and set **Auto-Deploy → After CI Checks Pass**.

From then on, edit your code and run:

```bash
git add .
git commit -m "Update food menu"
git push
```

GitHub runs the checks; Render deploys after they pass. You do not need Docker, deploy hooks or Render API secrets for this workflow. Render will not auto-deploy in this mode if no checks are detected or a check fails.

## Troubleshooting

| Problem | First check |
| --- | --- |
| Menu never loads locally | Backend is running; open `http://localhost:8000/foods` |
| CORS error in browser console | Backend `FRONTEND_URL` exactly matches the browser's origin |
| Deployed site tries localhost | Set `NEXT_PUBLIC_API_URL` on the Static Site and rebuild |
| First deployed request is slow | Free backend may be waking up; leave the page open |
| Edited JSON does not change local menu | Seeding only happens when the table is empty; follow step 7 |
| `npm ci` complains about lock mismatch | Run `npm install` locally after changing dependencies, then commit the updated lockfile |
| Images fail but menu text works | External photo host may be unavailable; use local photos as described in step 7 |
| `/cart/` fails when opened directly | Publish `out`, keep `trailingSlash: true`, and redeploy |

## Official references

Checked September 23, 2026:

- FastAPI CORS: https://fastapi.tiangolo.com/tutorial/cors/
- FastAPI SQL database guide: https://fastapi.tiangolo.com/tutorial/sql-databases/
- Tailwind with Next.js: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- Next.js static export: https://nextjs.org/docs/app/guides/static-exports
- Render FastAPI: https://render.com/docs/deploy-fastapi
- Render Next.js: https://render.com/docs/deploy-nextjs-app
- Render free-service limits: https://render.com/docs/free
- Render CI-based deployments: https://render.com/docs/deploys

## Verification of this starter

The backend API test, frontend cart calculation tests, and Next.js production static build passed in the authoring environment. Browser visual and click-through verification could not be completed because a Chromium download failed. Use the manual checks in step 6 after starting the project. No GitHub repository or Render service has been created for you.
