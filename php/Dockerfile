FROM wordpress:5.7.2-php7.4-apache

#SHELL to /bin/bash
#SHELL ["/bin/bash", "-c"]

WORKDIR /var/www/html
COPY ./wp-setup.sh /var/www/html/
COPY ./config/php.ini /usr/local/etc/php/conf.d/

#諸々インストール
RUN apt-get update -y && apt-get upgrade -y
RUN apt-get -y install --no-install-recommends \
    wget \
    unzip \
    sudo \
    less \
    vim \
    ibus-mozc \
    iputils-ping \
    git \
    locales \
    curl \
    gcc \
    g++ \
    # mercurial \
    # make \
    # binutils \
    # bison \
    # libc6-dev \
    # pkg-config \
    # build-essential \
    && \
    apt-get -y clean \
    && \
    rm -rf /var/lib/apt/lists/*

ENV PATH /usr/local/go/bin:$PATH


#webadmin作成
ARG UID=1000
ARG GID=1000
ARG GROUP=webadmin
ARG USERNAME=webadmin
#要変更
ARG PASSWD=webadmin


# echo "username:password" | chpasswd
# root password is "root"

RUN echo "root:root" | chpasswd && \
    groupadd --gid ${GID} ${GROUP} && \
    groupadd --gid ${GID} wheel -o && \
    adduser --uid ${UID} --ingroup wheel \
    --disabled-password --gecos "" "${USERNAME}" && \
    usermod -G sudo,wheel ${USERNAME} && \
    echo "${USERNAME}:${USERNAME}" | chpasswd && \
    echo "%wheel    ALL=(ALL)   NOPASSWD:    ALL" >> /etc/sudoers.d/wheel && \
    echo "%${GROUP}    ALL=(ALL)   NOPASSWD:    ALL" >> /etc/sudoers.d/${GROUP} && \
    chmod -R 0755 /etc/sudoers.d/


#lang ja_JP UTF-8
ENV DEBIAN_FRONTEND=noninteractive
RUN echo "ja_JP UTF-8" > /etc/locale.gen && \
    locale-gen ja_JP.UTF-8 && \
    dpkg-reconfigure locales && \
    update-locale LANG=ja_JP.UTF-8 && \
    echo export LANG=ja_JP.UTF-8 >> ~/.profile && \
    echo export LANG=ja_JP.UTF-8 >> /home/webadmin/.profile

ENV LANG=ja_JP.UTF-8

#wp-cliインストール
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp \
    && wp --info

ENV WPINSTALLDIR=/var/www/html

# Node.js 14.x install
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash - && \
    sudo apt-get install -y nodejs && \
    npm i -g yarn && \
    yarn global add vue-cli gatsby-cli

#RUN wp core download \
#    --locale=ja --version=5.6.1 --path=${WPINSTALLDIR} --allow-root

#prompt customize
RUN echo 'PS1="\[\033[01;31m\]\u\[\033[00m\]@\h\[\033[00m\]:\[\033[01;36m\]\w\[\033[00m\]\[\e[0m\]\$ "' >> $HOME/.bashrc
RUN echo 'PS1="\[\033[01;33m\]\u\[\033[00m\]@\h\[\033[00m\]:\[\033[01;36m\]\w\[\033[00m\]\[\e[0m\]\$ "' >> /home/${USERNAME}/.bashrc


RUN echo -e '\n\
    if [ -f ~/.bashrc ] ; then\n\
    . ~/.bashrc\n\
    fi\n\
    ' >> $HOME/.profile && \
    echo -e '\n\
    if [ -f ~/.bashrc ] ; then\n\
    . ~/.bashrc\n\
    fi\n\
    ' >> /home/${USERNAME}/.profile



ARG THEMENAME=${HOST}
COPY ./.htaccess ${WPINSTALLDIR}/
COPY ./wp-setup.sh ${WPINSTALLDIR}/
COPY ./docker-entrypoint.sh ${WPINSTALLDIR}/
RUN chown -R webadmin:webadmin /var/www/html

ENV WORDPRESS_DB_HOST=db:3306
ENV WORDPRESS_DB_NAME=wordpress
ENV WORDPRESS_DB_USER=wordpress
ENV WORDPRESS_DB_PASSWORD=wordpress
ENV WORDPRESS_DEBUG=0
ENV WORDPRESS_TABLE_PREFIX=wp_

USER webadmin

#RUN /var/www/html/wp-setup.sh
