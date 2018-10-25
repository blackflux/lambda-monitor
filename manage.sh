#!/bin/sh

docker build -t lambda-environment-node ./docker &&
docker run \
  -u=$UID:$(id -g $USER) \
  -v $(pwd):/user/project \
  -v ~/.aws:/user/.aws \
  -v ~/.npmrc:/user/.npmrc \
  -it lambda-environment-node
