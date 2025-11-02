#!/bin/bash

# Build a Docker image for the Prolog part
docker build -t prolog:latest -f ./Prolog/Dockerfile ./Prolog
docker build -t drools:latest -f ./Java/challenge1/Dockerfile ./Java/challenge1
docker build -t interface:latest -f ./Interface/Dockerfile ./Interface

docker rmi $(docker images -f "dangling=true" -q)

docker-compose down
docker-compose up -d
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir="/tmp/chrome-dev-session" --disable-web-security "http://localhost:3000"