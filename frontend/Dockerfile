# Build the React application
FROM node:18 as build

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy source code and build
COPY . ./
RUN yarn build

# Serve the app with NGINX
FROM nginx:stable-alpine

# Copy NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy React build files to NGINX serving directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
