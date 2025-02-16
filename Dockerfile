# Use Node.js 20
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy only source code
COPY . .

# Expose the application port
EXPOSE 3000

# Increase memory limit and start the app
CMD ["node", "--max-old-space-size=512", "node_modules/.bin/nest", "start"]
