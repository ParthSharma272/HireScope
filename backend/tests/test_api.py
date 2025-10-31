# backend/tests/test_api.py
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_health():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}

def test_upload_no_file():
    resp = client.post("/api/resume/upload", data={"job_description":"data scientist"})
    assert resp.status_code == 422  # file required
