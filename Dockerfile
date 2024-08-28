FROM node:20
RUN apt-get update \
  && apt-get install -y ca-certificates=20230311 --no-install-recommends \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ARG API_URL
ENV API_URL=${API_URL}
EXPOSE 3000
CMD [ "node", "dist/app.js" ]
