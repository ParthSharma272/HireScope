FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for WeasyPrint and PDF processing
RUN apt-get update && apt-get install -y \
    build-essential \
    poppler-utils \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    libffi-dev \
    shared-mime-info \
    libcairo2 \
    libpangoft2-1.0-0 \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Create cache directories with proper permissions
RUN mkdir -p /app/.cache /tmp/.cache /root/.cache/fontconfig && \
    chmod -R 777 /app/.cache /tmp/.cache /root/.cache/fontconfig

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy model
RUN python -m spacy download en_core_web_sm

# Pre-download sentence-transformers model to avoid runtime permission issues
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-mpnet-base-v2')"

# Copy application code
COPY . .

# Expose port
EXPOSE 7860

# Set environment variables for cache directories
ENV PORT=7860
ENV TRANSFORMERS_CACHE=/app/.cache/huggingface
ENV HF_HOME=/app/.cache/huggingface
ENV SENTENCE_TRANSFORMERS_HOME=/app/.cache/sentence-transformers
ENV XDG_CACHE_HOME=/app/.cache

# Start command
CMD uvicorn app:app --host 0.0.0.0 --port ${PORT} --workers 1
