# Use an official Python runtime as a parent image
# python:3.11-slim is a lightweight version of Python, good for production
FROM python:3.11-slim

# Set environment variables
# PYTHONDONTWRITEBYTECODE 1: Prevents Python from writing .pyc files to disc
# PYTHONUNBUFFERED 1: Ensures that Python output is sent straight to terminal (logs) without buffering
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
# gcc and libpq-dev are often needed for building Python packages (like psycopg2 for Postgres)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the application code
COPY . /app/

# Expose port 8000 to the outside world
EXPOSE 8000

# Command to run the application
# We use gunicorn for production. 
# 'VitoTechWebsite.wsgi:application' points to the WSGI application object in your project
# --bind 0.0.0.0:8000 makes it accessible from outside the container
CMD ["gunicorn", "VitoTechWebsite.wsgi:application", "--bind", "0.0.0.0:8000"]
