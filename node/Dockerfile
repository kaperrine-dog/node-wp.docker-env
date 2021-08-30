FROM node:lts-alpine3.14

WORKDIR /home/node

#make sudoers and make node sudoers
RUN apk add sudo
ARG DOCKER_USER=www
ARG DOCKER_UID=1001
RUN adduser -D -u ${DOCKER_UID} -s /bin/sh -G wheel ${DOCKER_USER} && \
    echo '%wheel ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers \
    && echo "node:node" | chpasswd \
    && addgroup node wheel \
    && echo "root:root" | chpasswd


#RUN addgroup -S node \
#  && adduser -S node -G node \
#  && echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers \
#  && echo 'node:node' | chpasswd
#USER node

RUN sudo apk --update-cache --no-cache add shadow \
    # general
    pkgconf \
    less \
    vim \
    curl \
    git \
    tzdata \
    gcc \
    g++ \
    bash \
    # dev
    # musl-dev \
    # autoconf \
    # automake \
    # make \
    # libtool \
    # nasm \
    # tiff \
    # jpeg \
    # zlib \
    # zlib-dev \
    # file \
    # udev \
    # for using puppeteer
    qpdf \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    fontconfig \
    font-noto-cjk && \
    # Set timezone
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime &&\
    apk del tzdata
# Install NotoFonts because of indicating ja_JP on node html


# 日本語対応(IPAフォントのインストール)
# https://moji.or.jp/ipafont/ipaex00401/
RUN sudo apk --no-cache add fontconfig \
    && cd \
    && wget  https://moji.or.jp/wp-content/ipafont/IPAexfont/IPAexfont00401.zip\
    && unzip IPAexfont00401.zip \
    && sudo mkdir -p /usr/share/fonts/ipa \
    && sudo cp IPAexfont00401/ipaexg.ttf /usr/share/fonts/ipa \
    && sudo cp IPAexfont00401/ipaexm.ttf /usr/share/fonts/ipa \
    && sudo chmod 755 -R /usr/share/fonts\
    && fc-cache -fv \
    && rm -rf ~/IPAexfont00401

# WORKDIR /noto
RUN mkdir -p /noto && cd /noto && \
    wget https://noto-website.storage.googleapis.com/pkgs/NotoSansCJKjp-hinted.zip -O /noto/NotoSansCJKjp-hinted.zip && \
    # unpack fonts in zip
    unzip -o /noto/NotoSansCJKjp-hinted.zip -d /noto && \
    wget https://noto-website-2.storage.googleapis.com/pkgs/NotoSerifCJKjp-hinted.zip -O /noto/NotoSerifCJKjp-hinted.zip && \
    unzip -o /noto/NotoSerifCJKjp-hinted.zip -d /noto && \
    mkdir -p /usr/share/fonts/noto && \
    cp *.otf /usr/share/fonts/noto && \
    chmod 755 -R /usr/share/fonts && \
    fc-cache -fv && \
    rm -rf /noto

WORKDIR /home/node




## use pupeteer
# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser


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
    touch /home/node/.bashrc && \
    echo 'PS1="\[\033[01;31m\]\u\[\033[00m\]@\h\[\033[00m\]:\[\033[01;36m\]\w\[\033[00m\]\[\e[0m\]\$ "' >> $HOME/.bashrc && \
    echo 'PS1="\[\033[01;33m\]\u\[\033[00m\]@\h\[\033[00m\]:\[\033[01;36m\]\w\[\033[00m\]\[\e[0m\]\$ "' >> $HOME/.bashrc


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


WORKDIR /home/node

RUN sudo npm i -g create-react-app && \
    fc-cache -fv
#RUN npm install --save-dev http-server \
#    && npm install -g gatsby-cli

ENV HOST=0.0.0.0
ENV NODE_ENV=development

EXPOSE 8000
EXPOSE 3000

USER root
RUN chown -R node:node /home/node
USER node