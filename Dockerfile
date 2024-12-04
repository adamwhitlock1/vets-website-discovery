# base node image
FROM node:14.15.5-alpine3.13

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libxml2-dev \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV YARN_VERSION=1.19.1
ENV NODE_ENV=development

# Install Yarn
RUN curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
    && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz

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