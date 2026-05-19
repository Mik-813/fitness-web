FROM node:22-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM base AS development
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM base AS build
COPY . .

ARG APP_URL
ARG APP_PORT
ARG RECAPTCHA_SITE_KEY
ENV APP_URL=$APP_URL
ENV APP_PORT=$APP_PORT
ENV RECAPTCHA_SITE_KEY=$RECAPTCHA_SITE_KEY

RUN npm run build

FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]