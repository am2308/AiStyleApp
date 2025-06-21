# Step 1: Use Node.js base image
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install && npm install cors && npm install aws-sdk multer multer-s3 dotenv

# Step 5: Copy all project files to the container
COPY . .

# Step 6: Expose the port the app runs on
EXPOSE 5000

# Step 7: Command to run the app
CMD ["node", "server.js"]
