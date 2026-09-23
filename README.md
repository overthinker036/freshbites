# FreshBites

**A simple food menu and shopping cart built with FastAPI and Next.js.**

Browse dishes, search by name, filter by category, and build a cart with instantly updated totals. FreshBites is a small full-stack learning project with a synchronous Python backend, a local SQLite database, and a responsive interface built with Tailwind CSS.

**FastAPI · SQLAlchemy · SQLite · Next.js · React · Tailwind CSS**

[Quick start](#quick-start) · [How it works](#how-it-works) · [Configuration](#configuration) · [Testing](#testing) · [Deployment](#deployment) · [Troubleshooting](#troubleshooting)

## Features

- Browse a menu populated automatically with six sample foods.
- Search dishes by name and filter them by category.
- Add items, adjust quantities, and remove items from the cart.
- See item totals, the cart count, and the overall total update immediately.
- Keep the cart after refreshing through browser `localStorage`.
- Use the interface on desktop or mobile.
- Explore the API through FastAPI's interactive documentation.

The project focuses on browsing and cart interactions. It does not process payments or place orders, and no account is required.

## Quick start

### Before you begin

Install these tools first:

| Tool | Recommended version | Check your installation |
| --- | --- | --- |
| Python | 3.12 | `python3 --version` |
| Node.js | 22 | `node --version` |
| npm | Included with Node.js | `npm --version` |
| Git | A recent version | `git --version` |

The commands below are for **Ubuntu/Linux and macOS**. Internet access is needed to install dependencies and load the sample food photos. SQLite is included with Python; no separate database server is needed.

### 1. Download the project

Replace `YOUR_USERNAME` with the repository owner's GitHub username:

```bash
git clone https://github.com/YOUR_USERNAME/freshbites.git freshbites
cd freshbites
```

Already downloaded the ZIP? Extract it and open a terminal in the folder containing `backend` and `frontend`, then continue below.

### 2. Start the backend — Terminal 1

From the project root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```

On first launch, the backend creates `backend/food.db` and inserts the sample menu automatically. You do not need to create tables or import data yourself.

Open **[http://localhost:8000/docs](http://localhost:8000/docs)** to confirm the API is running. Try **GET /foods → Try it out → Execute** to see the menu.

**Leave this terminal running.**

### 3. Start the frontend — Terminal 2

Open a second terminal **in the project root**, then run:

```bash
cd frontend
npm ci
cp .env.example .env.local
npm run dev
```

The copied environment file already points to the local API:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Open the app

Visit **[http://localhost:3000](http://localhost:3000)**.

Add a burger and a pizza, then open **Cart**. The total should be **$27.49**. Change a quantity, remove an item, or refresh the page to try the cart behavior.

| Address | Purpose |
| --- | --- |
| [localhost:3000](http://localhost:3000) | Food menu |
| [localhost:3000/cart/](http://localhost:3000/cart/) | Shopping cart |
| [localhost:8000/docs](http://localhost:8000/docs) | Interactive API documentation |
| [localhost:8000/foods](http://localhost:8000/foods) | Menu data as JSON |

Press **Ctrl+C** in each terminal to stop the app.

<details>
<summary><strong>Running it again later</strong></summary>

You only need to install dependencies during the initial setup or when they change.

From the project root, in Terminal 1:

```bash
cd backend
source .venv/bin/activate
python -m uvicorn main:app --reload
```

From the project root, in Terminal 2:

```bash
cd frontend
npm run dev
```

</details>

<details>
<summary><strong>Windows PowerShell adjustments</strong></summary>

Use these commands to create and activate the backend environment:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

To copy the frontend environment file, use:

```powershell
Copy-Item .env.example .env.local
```

The remaining install and run commands are the same.

</details>

## How it works

1. FastAPI reads food records from SQLite and returns them through `GET /foods`.
2. The Next.js frontend fetches the records and displays the menu.
3. Clicking **Add to Cart** updates shared React state.
4. The cart page calculates totals from the current quantities and fetched food prices.
5. The browser saves food IDs and quantities in `localStorage` for the next visit.

Backend routes and database operations are synchronous. Cart interactions happen in the browser and do not require an API request for every click.

Prices are stored as **integer cents**: `1499` represents `$14.99`. Calculations stay in cents until display, avoiding floating-point rounding issues. Delivery is free in this demo, with no added taxes or discounts.

Each browser has its own cart. Carts are not synchronized across devices or already-open tabs, and clearing site data removes the saved selection. A future payment feature would need the backend to calculate and validate the final amount.

## Project structure

| Path | Responsibility |
| --- | --- |
| `backend/main.py` | Database model, session handling, sample-data initialization, and API routes |
| `backend/foods.json` | Sample menu data |
| `backend/requirements.txt` | Backend dependencies |
| `backend/test_main.py` | API and database-initialization test |
| `frontend/app/page.jsx` | Home page, search, and categories |
| `frontend/app/cart/page.jsx` | Cart page and order summary |
| `frontend/app/store.jsx` | Shared state, API fetching, and browser storage |
| `frontend/app/components.jsx` | Header, footer, loading, and error messages |
| `frontend/app/layout.jsx` | Shared page layout |
| `frontend/app/globals.css` | Tailwind import and shared styles |
| `frontend/lib/cart.js` | Quantity and price calculations |
| `frontend/tests/cart.test.js` | Cart calculation tests |
| `.github/workflows/ci.yml` | Automated tests and frontend build |

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/foods` | Returns all foods ordered by ID |
| `GET` | `/health` | Returns `{"status": "ok"}` |

Each food contains `id`, `name`, `description`, `category`, `price_cents`, and `image_url`.

## Configuration

The default configuration works locally without additional backend settings.

| Variable | Where to set it | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `frontend/.env.local` or frontend hosting settings | `http://localhost:8000` |
| `FRONTEND_URL` | Backend process environment or hosting settings | `http://localhost:3000,http://127.0.0.1:3000` |
| `DATABASE_URL` | Backend process environment or hosting settings | SQLite file at `backend/food.db` |

`FRONTEND_URL` controls which browser origins can access the API through CORS. Multiple origins can be separated with commas. The backend does not automatically read a `.env` file.

Restart the frontend development server after changing `.env.local`. For deployment, rebuild the frontend after changing `NEXT_PUBLIC_API_URL`; this public value is embedded during the build.

### Customize the menu

Edit `backend/foods.json` to change names, descriptions, categories, prices, or image URLs. Use unique positive IDs and nonnegative integer prices in cents.

Sample data is inserted only when the food table is empty. To load your edited menu locally:

1. Stop the backend.
2. Delete **only** `backend/food.db`. This resets the local food database.
3. Restart the backend and refresh the frontend.

Keep existing IDs associated with the same foods because saved carts reference those IDs.

To use your own photos, add files to `frontend/public/foods/` and set an `image_url` such as `/foods/burger.jpg`. The homepage hero image is configured separately in `frontend/app/page.jsx`.

## Testing

**Backend** — from `backend`, with the virtual environment active:

```bash
python -m pip install -r requirements-dev.txt
python -m pytest -q
```

The test checks menu data, repeat initialization, CORS, and the health endpoint. It uses a temporary database and leaves your normal `food.db` untouched.

**Frontend** — from `frontend`:

```bash
npm test
npm run build
```

The tests cover quantity changes, price calculations, and saved-cart validation. The production build exports the pages to `frontend/out`.

## Deployment

The project supports a **Render Web Service** for FastAPI and a **Render Static Site** for the frontend, both connected to the same GitHub repository.

| Setting | Backend | Frontend |
| --- | --- | --- |
| Service type | Web Service, Free instance | Static Site |
| Root directory | `backend` | `frontend` |
| Build command | `pip install -r requirements.txt` | `npm ci && npm run build` |
| Start command | `uvicorn main:app --host 0.0.0.0 --port $PORT` | Not required |
| Publish directory | Not applicable | `out` |
| Health check | `/health` | Not applicable |

1. Deploy the backend and copy its public URL.
2. Set the frontend's `NEXT_PUBLIC_API_URL` to that URL before building it.
3. Deploy the frontend and copy its public URL.
4. Set the backend's `FRONTEND_URL` to the frontend URL and redeploy the backend.

Use the service origins, such as `https://your-api.onrender.com`, without `/foods`, `/cart`, or a trailing slash. Use Python 3.12 for the backend and Node.js 22 for the frontend. Both `/` and `/cart/` are exported as static pages; no catch-all SPA rewrite is needed.

> **Free-tier storage:** Render's free web services use a temporary filesystem. SQLite changes are lost when the service redeploys, restarts, or spins down. This project recreates the sample menu automatically, but does not provide durable hosted database storage. The cart remains in the visitor's browser. The first API request after inactivity may take longer while the server wakes up.

See the official [FastAPI deployment guide](https://render.com/docs/deploy-fastapi), [Next.js deployment guide](https://render.com/docs/deploy-nextjs-app), and [free-service limits](https://render.com/docs/free).

### Continuous integration and deployment

GitHub Actions runs on pushes and pull requests targeting `main`. It tests the backend, tests the cart logic, and builds the frontend.

After the first successful workflow run, set **Auto-Deploy → After CI Checks Pass** in both Render services. Future changes pushed to `main` will deploy after the checks pass. No deployment hooks or Render API secrets are required for this setup.

Commit `frontend/package-lock.json` so local development, CI, and Render use the same dependency versions. Environment files, the SQLite database, installed dependencies, and build output are excluded by `.gitignore`.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| `python3 -m venv` fails on Ubuntu | Install virtual-environment support with `sudo apt install python3-venv`. If using a separately installed Python version, install its matching venv package. |
| `npm` or `node` is not found | Install Node.js 22 with npm, then reopen the terminal. |
| `No module named uvicorn` | Activate `backend/.venv` and install `requirements.txt` in that environment. |
| `Could not import module "main"` | Run the Uvicorn command from the `backend` folder. |
| The menu does not load | Keep the backend running and check [localhost:8000/foods](http://localhost:8000/foods). |
| The browser reports a CORS error | Ensure the backend's `FRONTEND_URL` matches the frontend's exact origin, including its port. |
| Next.js starts on port 3001 | Port 3000 is occupied. Stop the other development server and restart, or allow port 3001 through `FRONTEND_URL`. |
| The menu did not change after editing JSON | Follow the database reset steps under **Customize the menu**. |
| `npm ci` reports a lockfile mismatch | If dependencies were intentionally changed, run `npm install` and commit the updated lockfile. |
| A deployed page tries to call localhost | Correct `NEXT_PUBLIC_API_URL` in the frontend hosting settings and rebuild. |
| Food photos do not load | Check access to the external image host, or replace the sample URLs with local photos. |

## Acknowledgments

The interface is based on a food-ordering design supplied as a practice brief. Sample food photography is loaded from Unsplash. FreshBites is intended as an educational project for learning how a small frontend and API work together.