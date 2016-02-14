FROM nginx
COPY . /usr/share/nginx/html
COPY backend-proxy.template /etc/nginx/conf.d/backend-proxy.template
