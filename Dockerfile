# Use ARM64-compatible Node 14 base image
FROM arm64v8/node:14

# Create app user
ARG userid=1000
RUN groupadd -g $userid appuser \
    && useradd -u $userid -r -m -d /application -g appuser appuser

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
RUN mkdir -p /application
WORKDIR /application

# Switch to non-root user
USER appuser

# Copy package.json and yarn.lock (if they exist)
COPY --chown=appuser:appuser package*.json yarn*.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY --chown=appuser:appuser . .

# Expose port 3001
EXPOSE 3001

# Command to run the application
CMD ["yarn", "watch", "--env", "entry=mock-form-ae-design-patterns"]