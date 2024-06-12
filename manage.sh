#!/bin/sh

command=bash

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -c|--command) command="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; shift ;;
    esac
    shift
done

docker build \
  --build-arg COMMAND="$command" \
  -t lambda-environment-node \
  --network="host" \
  docker/. &&
docker run \
  --net host \
  -u`id -u`:`id -g` \
  -v $(pwd):/user/project \
  -v ~/.aws:/user/.aws \
  -v ~/.npmrc:/user/.npmrc \
  -it lambda-environment-node

status=$?

return $status
