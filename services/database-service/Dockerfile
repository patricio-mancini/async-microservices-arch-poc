FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared ./shared
COPY services/database-service ./services/database-service
RUN npm install
WORKDIR /app/services/database-service
RUN npm run build
CMD ["npm", "start"]
