FROM python:3.12.6-slim

# 2. Set the working directory in the container
WORKDIR /app

# 3. Copy requirements first for better caching during builds
COPY requirements.txt .

# 4. Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy the rest of the application code
COPY . .

# 6. Expose the port FastAPI will run on
EXPOSE 8080

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]