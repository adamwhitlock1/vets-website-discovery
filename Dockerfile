# base node image
FROM node:14.15.5-alpine3.13

# Set environment variables
ENV YARN_VERSION=1.19.1
ENV NODE_ENV=development

# Create and set working directory
WORKDIR /application

# Copy package.json and yarn.lock (if they exist)
COPY package*.json yarn*.lock ./

# Install dependencies
RUN yarn install --ignore-engines

# Copy the rest of the application
COPY . .

# Expose port 3001
EXPOSE 3001

# Command to run the application
CMD ["yarn", "watch", "--env", "entry=mock-form-ae-design-patterns"]