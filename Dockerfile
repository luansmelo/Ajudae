FROM node:20.18.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

COPY scripts ./scripts

RUN chmod +x ./scripts/*.sh

RUN ./scripts/build.sh

EXPOSE 3000

CMD ["sh", "./scripts/start.sh"]