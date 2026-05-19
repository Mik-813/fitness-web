FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG APP_URL
ARG APP_PORT
ARG RECAPTCHA_SITE_KEY
ENV APP_URL=$APP_URL
ENV APP_PORT=$APP_PORT
ENV RECAPTCHA_SITE_KEY=$RECAPTCHA_SITE_KEY

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]