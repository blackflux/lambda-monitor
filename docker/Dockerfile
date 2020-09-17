FROM lambci/lambda:build-nodejs12.x

WORKDIR /user

RUN yum install git vi -y

# set home folder
ENV HOME /user

RUN touch ~/.bashrc && \
  curl -o- -L https://yarnpkg.com/install.sh | bash && \
  source ~/.bashrc && \
  yarn global add serverless@2.1.0

RUN touch ~/.bashrc && \
  echo "alias u='yarn run u'" >> ~/.bashrc && \
  echo "alias i='yarn run i'" >> ~/.bashrc && \
  echo "alias it='yarn run it'" >> ~/.bashrc && \
  echo "alias t='yarn run t'" >> ~/.bashrc && \
  echo "alias ts='yarn run ts'" >> ~/.bashrc && \
  echo "alias tsv='yarn run tsv'" >> ~/.bashrc && \
  source ~/.bashrc

RUN chmod -R 757 /user

# set correct execution env
ENV LAMBDA_TASK_ROOT /user/project
# disable babel trying to access root file location
ENV BABEL_DISABLE_CACHE 1

ENTRYPOINT (cd project && bash)
