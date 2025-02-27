FROM nginx:latest

# Встановлюємо робочу директорію
WORKDIR /usr/share/nginx/html

# Очищаємо стандартні файли Nginx
RUN rm -rf ./*

# Копіюємо зібрані файли сайту в контейнер
COPY dist/ .

# Відкриваємо порт 80
EXPOSE 80

# Запускаємо Nginx
CMD ["nginx", "-g", "daemon off;"]
