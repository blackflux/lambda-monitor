#!/bin/sh

docker build -t lambda-environment-node ./docker &&
docker run \
  --net host \
  -u`id -u`:`id -g` \
  -v $(pwd):/user/project \
  -v ~/.aws:/user/.aws \
  -v ~/.npmrc:/user/.npmrc \
  -it lambda-environment-node
