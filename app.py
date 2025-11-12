"""Entry point for Hugging Face Spaces.

This file ensures the FastAPI app defined in backend/app.py can be
imported when the repository root is treated as the working directory.
"""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
BACKEND_DIR = ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from importlib import import_module

backend_app_module = import_module("app")

app = backend_app_module.app
