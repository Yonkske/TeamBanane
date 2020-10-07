FROM node:latest

EXPOSE 80
EXPOSE 443

WORKDIR /teambanane
COPY /html/ /teambanane/
COPY /img/ /teambanane/
COPY *.json /teambanane/
COPY index.html /teambanane/

ENV docker=$HELLO
RUN echo ${docker}
RUN npm install
CMD [ "node", "server.js" ]
