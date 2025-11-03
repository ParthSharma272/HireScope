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

# Create fontconfig cache directory with proper permissions
RUN mkdir -p /root/.cache/fontconfig && chmod 777 /root/.cache/fontconfig

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy model
RUN python -m spacy download en_core_web_sm

# Copy backend application code
COPY backend/ .

# Expose port
EXPOSE 7860

# Set environment variable
ENV PORT=7860

# Start command
CMD uvicorn app:app --host 0.0.0.0 --port ${PORT} --workers 1
