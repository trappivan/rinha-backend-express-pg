FROM node:20-alpine3.17
WORKDIR /

COPY package.json ./
RUN npm install

COPY . .

CMD ["npm","run", "dev"]