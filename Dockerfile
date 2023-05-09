FROM node:16-alpine3.16
MAINTAINER dparnell@mamori.io

ADD src /app
RUN cd /app &&\
	yarn install

WORKDIR /app
