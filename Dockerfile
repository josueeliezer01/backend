FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm cache clean --force && npm install

COPY . .

EXPOSE 3333

CMD ["npm", "start"]
