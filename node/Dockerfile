FROM node:lts-alpine3.12

WORKDIR /home/node

#make sudoers and make node sudoers
RUN apk add sudo
ARG DOCKER_USER=www
ARG DOCKER_UID=1001

RUN adduser -D -u ${DOCKER_UID} -s /bin/sh -G wheel ${DOCKER_USER}
RUN echo '%wheel ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers \
    && echo "node:node" | chpasswd \
    && addgroup node wheel \
    && echo "root:root" | chpasswd


#RUN addgroup -S node \
#  && adduser -S node -G node \
#  && echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers \
#  && echo 'node:node' | chpasswd
#USER node

RUN sudo apk upgrade && apk update
RUN sudo apk add autoconf
RUN sudo apk --no-cache add shadow \
    gcc \
    g++ \
    bash \
    musl-dev \
    autoconf \
    automake \
    make \
    libtool \
    nasm \
    tiff \
    jpeg \
    zlib \
    zlib-dev \
    file \
    pkgconf \
    less \
    vim \
    curl \
    git \
    tzdata \
    go

RUN cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime &&\
    apk del tzdata

##---------------##
##   USER Node   ##
##---------------##
USER node

#Debian系では$削除

RUN touch /home/node/.profile && \
    echo -e $'\n\
    if [ -n "$BASH_VERSION" ]; then\n\
    # include .bashrc if it exists\n\
    if [ -f "$HOME/.bashrc" ]; then\n\
    . "$HOME/.bashrc"\n\
    fi\n\
    fi\n\
    ' >> /home/node/.profile && \
    #    go get -u github.com/justjanne/powerline-go && \
    touch /home/node/.bashrc && \
    echo 'PS1="\[\033[01;31m\]\u\[\033[00m\]@\h\[\033[00m\]:\[\033[01;36m\]\w\[\033[00m\]\[\e[0m\]\$ "' >> $HOME/.bashrc && \
    echo 'PS1="\[\033[01;33m\]\u\[\033[00m\]@\h\[\033[00m\]:\[\033[01;36m\]\w\[\033[00m\]\[\e[0m\]\$ "' >> $HOME/.bashrc

# powerline go (incase of using golang)
#&& \
#     go get -u github.com/justjanne/powerline-go && \
#     touch /home/node/.bashrc && \
#     echo -e $'\n\
# GOPATH=$HOME/go\n\
# function _update_ps1() {\n\
#     PS1="$($GOPATH/bin/powerline-go -error 0)"\n\
# }\n\
# if [ "$TERM" != "linux" ] && [ -f "$GOPATH/bin/powerline-go" ]; then\n\
#     PROMPT_COMMAND="_update_ps1; $PROMPT_COMMAND"\n\
# fi\n\
# ' >> /home/node/.bashrc

#RUN passwd node:node && passwd root:root

#make sudoers
#RUN apk --no-cache add sudo
#RUN adduser -D -u 1001 -s /bin/sh -G wheel alpine-sudoer
#RUN echo '%wheel ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

# create a user
#ARG DOCKER_UID=1000
#ARG DOCKER_USER=node
#ARG DOCKER_PASSWORD=node
#RUN useradd -m --uid ${DOCKER_UID} --groups sudo ${DOCKER_USER} \
#  && echo ${DOCKER_USER}:${DOCKER_PASSWORD} | chpasswd

# change user
#USER ${DOCKER_USER}



# in case of production env
# ENV NODE_ENV=development

WORKDIR /home/node


RUN sudo npm i -g gatsby-cli vue-cli create-react-app firebase-tools


#RUN npm install --save-dev http-server \
#    && npm install -g gatsby-cli

ENV HOST=0.0.0.0
ENV NODE_ENV=development

EXPOSE 8000
EXPOSE 3000

USER root
RUN chown -R node:node /home/node
USER node