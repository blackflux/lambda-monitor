FROM lambci/lambda:build-nodejs8.10

WORKDIR /user

# prevent npm update notifications
ENV NO_UPDATE_NOTIFIER 0

RUN yum install git vi -y \
  && npm install -g serverless npm-check-updates \
  && npm install -g npm@6.1.0

# set home folder
ENV HOME /user
RUN chmod 757 /user

# ensure npm spawn can write to folder
ENV SPAWN_WRAP_SHIM_ROOT /tmp
# disable babel trying to access root file location
ENV BABEL_DISABLE_CACHE 1
# allow npm cache access for user
RUN mkdir /user/.npm
RUN chmod -R 757 /user/.npm

ENTRYPOINT (cd project && bash)
