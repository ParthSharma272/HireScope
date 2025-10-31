# backend/core/parsing.py
import io
import logging

from PyPDF2 import PdfReader
from docx import Document
from pdf2image import convert_from_bytes
from pdf2image.exceptions import (
    PDFInfoNotInstalledError,
    PDFPageCountError,
    PDFSyntaxError,
)
import pytesseract
from pytesseract import TesseractNotFoundError

logger = logging.getLogger(__name__)

def extract_text_from_file(content_bytes: bytes, filename: str):
    fname = filename.lower()
    if fname.endswith(".pdf"):
        return extract_text_pdf(content_bytes)
    elif fname.endswith(".docx"):
        return extract_text_docx(content_bytes)
    else:
        raise ValueError("Unsupported file type. Supported: .pdf, .docx")

def extract_text_pdf(content_bytes: bytes):
    reader = PdfReader(io.BytesIO(content_bytes))
    pages_text = []
    for i, page in enumerate(reader.pages):
        try:
            text = page.extract_text() or ""
        except Exception:
            text = ""
        pages_text.append(text)
    full_text = "\n".join(pages_text).strip()
    metadata = {"pages": len(pages_text), "file_type": "pdf"}
    # if extracted text is very short -> try OCR fallback
    if len(full_text) < 80:
        try:
            ocr_text = ocr_pdf(content_bytes)
            if ocr_text and ocr_text.strip():
                full_text = ocr_text
                metadata["ocr"] = True
        except (TesseractNotFoundError, PDFInfoNotInstalledError, PDFPageCountError, PDFSyntaxError) as ocr_error:
            logger.warning("OCR fallback skipped: %s", ocr_error)
        except Exception as ocr_error:  # pragma: no cover - safety net
            logger.exception("Unexpected OCR error: %s", ocr_error)
    return full_text, pages_text, metadata

def ocr_pdf(content_bytes: bytes):
    images = convert_from_bytes(content_bytes, dpi=300)
    texts = []
    for img in images:
        texts.append(pytesseract.image_to_string(img))
    return "\n".join(texts)

def extract_text_docx(content_bytes: bytes):
    doc = Document(io.BytesIO(content_bytes))
    paras = [p.text for p in doc.paragraphs if p.text and p.text.strip()!='']
    full_text = "\n".join(paras)
    metadata = {"pages": len(paras), "file_type": "docx"}
    return full_text, paras, metadata
