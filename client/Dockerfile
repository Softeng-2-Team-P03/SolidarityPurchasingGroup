FROM node:12.18.3

LABEL version="1.0"
LABEL description="This is the base docker image for the SolidarityPurchasingGroup frontend react app."

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install
# potrebbe essere meglio usare `RUN npm install --production` che non installa la roba in dev dependencies di package.json

COPY . .

EXPOSE 3000

CMD ["npm", "start"]