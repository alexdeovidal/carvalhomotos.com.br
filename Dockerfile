FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY loja.html /usr/share/nginx/html/loja.html
COPY politica-de-privacidade.html /usr/share/nginx/html/politica-de-privacidade.html
COPY politica-de-cookies.html /usr/share/nginx/html/politica-de-cookies.html
COPY termos-de-uso.html /usr/share/nginx/html/termos-de-uso.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY compliance.css /usr/share/nginx/html/compliance.css
COPY shop.js /usr/share/nginx/html/shop.js
COPY consent.js /usr/share/nginx/html/consent.js
COPY public/ /usr/share/nginx/html/public/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
