FROM nginx:1.26.1-alpine3.19-slim

COPY nginx.conf /etc/nginx/nginx.conf
COPY certs /etc/nginx/certs

EXPOSE 80
EXPOSE 443
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 3003

CMD ["nginx", "-g", "daemon off;"]
