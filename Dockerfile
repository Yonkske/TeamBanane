FROM alpine:latest

EXPOSE 80
EXPOSE 443

RUN echo "Hello World"

ENTRYPOINT /bin/bash