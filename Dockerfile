FROM node:latest

EXPOSE 80
EXPOSE 443

WORKDIR /teambanane
COPY /html/ /teambanane/
COPY /img/ /teambanane/
COPY *.json /teambanane/
COPY index.html /teambanane/

RUN npm install
CMD [ "node", "server.js" ]
