FROM python:3.12-slim

WORKDIR /app

# Install dependencies required to build and run dockaudit/python
RUN apt-get update && apt-get install -y gcc sqlite3 && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY dashboard/backend/requirements.txt .

# Copy dockaudit source into the image so we can install it
COPY pyproject.toml README.md /app/dockaudit-src/
COPY dockaudit /app/dockaudit-src/dockaudit

# Install dockaudit and backend requirements
RUN pip install --no-cache-dir /app/dockaudit-src
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend app code
COPY dashboard/backend/app /app/app

# Expose FastAPI port
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
