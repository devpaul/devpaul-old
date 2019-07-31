FROM nginx:stable

COPY packages/static-site/_dist /usr/share/nginx/html
COPY packages/app/dist /usr/share/nginx/html/packages/app
COPY packages/service-worker/dist/service-worker.js /usr/share/nginx/html/service-worker.js
