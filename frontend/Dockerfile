FROM node:18-alpine
WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build

RUN npm install -g serve
EXPOSE 80

CMD ["serve", "-s", "build", "-l", "80"]
# FROM nginx:stable-alpine
# WORKDIR /usr/share/nginx/html

# COPY --from=build /app/build ./
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
