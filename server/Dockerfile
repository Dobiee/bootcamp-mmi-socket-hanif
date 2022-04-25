FROM node:16
WORKDIR /server
COPY package.json /
RUN npm i
ADD . /
CMD [ "npm", "start"]