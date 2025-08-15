# Stage 1: Build the React app with Node LTS
FROM node:24-alpine AS builder
WORKDIR /app

# Build-time envs for Vite (embedded into bundle)
ARG VITE_API_URI
ENV VITE_API_URI=$VITE_API_URI

# Copy frontend sources (build context is repo root: crypto-craft-ui)
COPY app-ui ./app-ui
WORKDIR /app/app-ui
RUN npm ci --no-audit --no-fund && npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/app-ui/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]