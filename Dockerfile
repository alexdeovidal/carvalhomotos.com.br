FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY loja.html /usr/share/nginx/html/loja.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY shop.js /usr/share/nginx/html/shop.js
COPY public/ /usr/share/nginx/html/public/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
