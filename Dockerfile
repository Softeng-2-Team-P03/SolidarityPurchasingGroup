# escape=`

FROM ubuntu
RUN apt-get update
#RUN apt install npm
WORKDIR /SolidarityPurchasingGroup
COPY . .

#docker run –p 80:3000 ex/webapp
RUN docker  run -w ./server -i -t  npm install
RUN docker  run -w ./server -i -t  nodemon server.js
RUN docker  run -w ./client -i -t  npm install
RUN docker  run -w ./client -i -t  npm start