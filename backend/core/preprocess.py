# backend/core/preprocess.py
import re
import spacy

# Use small English model; user must `python -m spacy download en_core_web_sm`
try:
    nlp = spacy.load("en_core_web_sm")
except Exception:
    nlp = None

HEADER_KEYWORDS = {
    "EXPERIENCE": "experience",
    "WORK EXPERIENCE": "experience",
    "EDUCATION": "education",
    "PROJECTS": "projects",
    "SKILLS": "skills",
    "CERTIFICATIONS": "certifications",
    "CONTACT": "contact",
    "SUMMARY": "summary",
    "PROFILE": "summary"
}

def segment_text(raw_text: str):
    """
    Heuristic section splitter: looks for header lines and groups following lines under them.
    Returns dict(section -> text).
    """
    lines = [l.rstrip() for l in raw_text.splitlines()]
    sections = {}
    current = "header"
    for line in lines:
        up = line.strip().upper()
        # detect if line is a header
        if up in HEADER_KEYWORDS:
            current = HEADER_KEYWORDS[up]
            sections[current] = sections.get(current, [])
            continue
        # also detect lines that are all-caps and short (possible header)
        if len(line) < 60 and line.strip() == line.strip().upper() and len(line.split()) <= 4:
            key = HEADER_KEYWORDS.get(line.strip().upper(), None)
            if key:
                current = key
                sections[current] = sections.get(current, [])
                continue
        sections.setdefault(current, []).append(line)
    # join
    return {k: "\n".join(v).strip() for k, v in sections.items()}

def sentence_split_with_offsets(text: str):
    """
    Returns list of dicts: {"sentence": s, "start": int, "end": int}
    Uses spaCy if available, else naive split on punctuation.
    """
    out = []
    if nlp:
        doc = nlp(text)
        for sent in doc.sents:
            out.append({"sentence": sent.text.strip(), "start": sent.start_char, "end": sent.end_char})
        return out
    # naive fallback
    pattern = re.compile(r'([^.!?\\n][^.!?]*[.!?])', re.M)
    idx = 0
    for m in pattern.finditer(text):
        s = m.group(0).strip()
        start = m.start()
        end = m.end()
        out.append({"sentence": s, "start": start, "end": end})
    # if empty
    if not out:
        out = [{"sentence": text.strip(), "start": 0, "end": len(text)}]
    return out
