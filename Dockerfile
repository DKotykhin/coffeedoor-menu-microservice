#standalone container
FROM node:alpine as dev

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install

COPY . /app

RUN npm run build

CMD [ "npm", "start" ]


# common container
FROM node:alpine as prod

WORKDIR /coffeedoor-menu-microservice

COPY ./coffeedoor-menu-microservice/package.json /coffeedoor-menu-microservice
COPY ./coffeedoor-menu-microservice/package-lock.json /coffeedoor-menu-microservice
COPY ./coffeedoor-menu-microservice/tsconfig.json tsconfig.json
COPY ./coffeedoor-menu-microservice/nest-cli.json nest-cli.json

RUN npm install

COPY /coffeedoor-menu-microservice /coffeedoor-menu-microservice

RUN npm run build

CMD [ "npm", "start" ]

# kubernetes container
# FROM node:alpine

# WORKDIR /app

# COPY package*.json /app

# RUN npm install

# COPY . /app 

# RUN npm run build

# CMD ["node", "dist/main"]
