# backend/utils/common.py
import hashlib

def hash_bytes(b: bytes):
    return hashlib.sha256(b).hexdigest()
