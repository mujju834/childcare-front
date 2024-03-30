# Step 1: Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json files from your project into the container
COPY package*.json ./

# Step 4: Install your application's dependencies
RUN npm install

# Step 5: Copy the rest of your application's code into the container
COPY . .

# Step 6: Build your React application
RUN npm run build

# Step 7: Install serve to serve your static files
RUN npm install -g serve

# Step 8: Inform Docker that the container listens on port 5000 at runtime
EXPOSE 5000

# Step 9: Define the command to run your app using serve
CMD ["serve", "-s", "build", "-l", "5000"]
