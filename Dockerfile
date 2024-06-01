FROM node:18.20.3-alpine3.19

RUN apk add g++ make py3-pip

RUN mkdir /app
WORKDIR /app

COPY package*.json .

RUN npm install

RUN apk update
RUN apk add
RUN apk add ffmpeg
 
COPY . .

EXPOSE $PORT

CMD [ "npm", "start" ]