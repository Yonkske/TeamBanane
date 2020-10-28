FROM node:latest

EXPOSE 80
EXPOSE 443
EXPOSE 27017

WORKDIR teambanane
COPY . /teambanane/

RUN npm install
CMD ["node", "app.js"]