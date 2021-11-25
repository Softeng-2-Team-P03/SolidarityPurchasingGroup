FROM node:12.18.3

LABEL version="1.0"
LABEL description="This is the base docker image for the SolidarityPurchasingGroup frontend react app."

WORKDIR /app

# needed to let the docker image find the react-scripts into the node_modules folder
ENV PATH /app/node_modules/.bin:$PATH

# COPY ["package.json", "package-lock.json", "./"]
COPY package-docker.json ./package.json
COPY package-lock.json ./

RUN npm install --production
# potrebbe essere meglio usare `RUN npm install --production` che non installa la roba in dev dependencies di package.json

COPY . .

EXPOSE 3000

CMD ["npm", "start"]