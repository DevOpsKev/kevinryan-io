FROM nginx:1.28.2-alpine

LABEL org.opencontainers.image.source="https://github.com/DevOpsKev/kevin-ryan-platform"

ARG COMMIT_SHA=dev
ARG COMMIT_DATE=dev

COPY sites/ai-native-engineer-io/public/ /usr/share/nginx/html/
COPY sites/ai-native-engineer-io/nginx.conf /etc/nginx/nginx.conf

RUN sed -i "s/{{COMMIT_SHA}}/${COMMIT_SHA}/g; s/{{COMMIT_DATE}}/${COMMIT_DATE}/g" /usr/share/nginx/html/index.html

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /run/nginx.pid && \
    chown nginx:nginx /run/nginx.pid

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
