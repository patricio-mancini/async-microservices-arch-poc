FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared ./shared
COPY services/league-importer ./services/league-importer
RUN npm install
WORKDIR /app/services/league-importer
RUN npm run build
CMD ["npm", "start"]
