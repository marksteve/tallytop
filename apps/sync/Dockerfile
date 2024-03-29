# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.17.0
FROM node:${NODE_VERSION}-alpine as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
RUN npm install -g pnpm


# Throw-away build stage to reduce size of final image
FROM base as build

# Install node modules
COPY --link package.json ./
RUN pnpm install

# Copy application code
COPY --link . .


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 1234
CMD [ "pnpm", "run", "start" ]
