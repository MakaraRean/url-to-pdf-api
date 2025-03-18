# Use an official Node.js runtime as the base image
FROM node:18-slim

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Puppeteer dependencies (needed for Chromium)
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libxtst6 \
    libxss1 \
    fonts-noto \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Optional: Install a specific Khmer font (e.g., Khmer OS)
RUN wget reanmakara.com/assets/fonts/Kantumruy_Pro/static/KantumruyPro-Regular.ttf -P /usr/share/fonts/truetype/ \
    && fc-cache -fv

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (default is 9000 per the project README)
EXPOSE 9000

# Start the application
CMD ["npm", "start"]