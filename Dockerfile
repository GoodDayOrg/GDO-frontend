FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ARG API_URL
ENV API_URL=${API_URL}
EXPOSE 3000
CMD [ "node", "dist/app.js" ]
