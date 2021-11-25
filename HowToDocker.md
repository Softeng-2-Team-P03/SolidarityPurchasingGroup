# How to Docker
## This guide is intended for my teammates to instruct them on how to docker-compose this project

**I'll work on getting this workflow easier but at the moment this is how you can dockerize your images**

### Setup

 - install docker on your pc
   - If you're working on **windows** install WSL2 ( Windows subsystem fo Linux 2 ) too.
   - Notice that with docker desktop for windows already comes also the **package for docker-composer** but if you're working on **linux** you'll have to install that too.
 - once you're done with that, i suggest to install also the **Visual Studio Code Docker extension**.
  
### How to run docker compose
 - The `"proxy": "http://localhost:3001"` line into **client/package.json** it's been substituted "localhost" with "proxy": `"http://backend:3001"` in the **client/package-docker.json file**. in fact this is the file the Dockerfile is instructed to use as the "package.json" of the containerized app. so, **if you change something on the package.json file you also have to change it into package-docker.json** in order for it to have effect into the docker image.
 - now delete your `node_modules` folder and the `package-lock.json` file and then run `npm install` to rebuild them
 - Open a terminal in the root of the project ( your_directory\SolidarityPurchasingGroup> ) and run the command `docker-compose up --build`, it's going to take a while
   - PS: Make sure to have docker running in your computer!

### See the results
 - click on the docker icon (the whale with the containers) on the side bar of your VSCode, there you'll be able to find a "CONTAINERS" section with a _solidaritypurchasinggroup_ composer project having 2 running containers: 
   - solidarity-purchasing-group-frontend  
   - solidarity-purchasing-group-backend
 - both containers should have a small green triangle on their side stating that they are running, you can now go to your browser at link  http://localhost:3000 and you'll be able to see our app running.
 - you can stop the docker-compose containers by right-clicking the _solidaritypurchasinggroup_ and then selecting _compose down_
  
### Warning
 - **if images of frontend or backend are present** ( you can see them in the "IMAGES" section of the docker VSC extension ) then the ports 3000 and 3001 of your pc will be occupied by them this means that **npm start and node server.js or nodemon server.js** as you are used to use them into the cient and server directories to start the app on your pc **WILL NOT WORK** until you remove both images ad you an remove them by right-clicking the label _latest_ under their entry in the IMAGES section and then clicking _remove_

### useful reference i guess
 - https://towardsdatascience.com/deploying-a-react-nodejs-application-with-docker-part-i-of-ii-910bc6edb46e