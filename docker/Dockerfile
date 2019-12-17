FROM lambci/lambda:build-nodejs12.x

WORKDIR /user

RUN yum install git vi -y

# set home folder
ENV HOME /user

RUN touch ~/.bashrc && \
  curl -o- -L https://yarnpkg.com/install.sh | bash && \
  source ~/.bashrc && \
  yarn global add serverless@1.59.3

RUN touch ~/.bashrc && \
  echo '# yarn-upgrade' >> ~/.bashrc && \
  echo "alias u='yarn upgrade --latest --force'" >> ~/.bashrc && \
  echo '# yarn re-install' >> ~/.bashrc && \
  echo "alias i='yarn install --frozen-lockfile'" >> ~/.bashrc && \
  echo '# run tests' >> ~/.bashrc && \
  echo "alias t='yarn test'" >> ~/.bashrc && \
  echo "alias ts='yarn run test-simple'" >> ~/.bashrc && \
  echo "alias tsv='yarn run test-simple --verbose'" >> ~/.bashrc && \
  source ~/.bashrc

RUN chmod -R 757 /user

# set correct execution env
ENV LAMBDA_TASK_ROOT /user/project
# disable babel trying to access root file location
ENV BABEL_DISABLE_CACHE 1

ENTRYPOINT (cd project && bash)
