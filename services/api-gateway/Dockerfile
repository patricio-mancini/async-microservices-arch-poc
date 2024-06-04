FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared ./shared
COPY services/api-gateway ./services/api-gateway
RUN npm install
WORKDIR /app/services/api-gateway
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
