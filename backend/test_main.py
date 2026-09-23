import importlib

from fastapi.testclient import TestClient


def test_foods_are_seeded_once_and_cors_works(tmp_path, monkeypatch):
    # Tests get a disposable database, not your real food.db.
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{tmp_path / 'test.db'}")
    monkeypatch.setenv("FRONTEND_URL", "http://localhost:3000")
    main = importlib.import_module("main")
    try:
        main.initialize_database()
        with TestClient(main.app) as client:
            response = client.get("/foods", headers={"Origin": "http://localhost:3000"})
            assert response.status_code == 200
            foods = response.json()
            assert len(foods) == 6
            assert foods[0]["price_cents"] == 1499
            assert len({food["id"] for food in foods}) == 6
            assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
            assert client.get("/health").json() == {"status": "ok"}
    finally:
        main.engine.dispose()
