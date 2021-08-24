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


#日本語化
RUN echo "ja_JP UTF-8" > /etc/locale.gen \
    && \
    locale-gen \
    && \
    echo export LANG=ja_JP.UTF-8 >> ~/.profile

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
    usermod -G wheel,${GROUP} ${USERNAME} && \
    echo "${USERNAME}:${USERNAME}" | chpasswd && \
    echo "%wheel    ALL=(ALL)   NOPASSWD:    ALL" >> /etc/sudoers.d/wheel && \
    echo "%${GROUP}    ALL=(ALL)   NOPASSWD:    ALL" >> /etc/sudoers.d/${GROUP} && \
    chmod 0440 /etc/sudoers.d/


#wp-cliインストール
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
     && chmod +x wp-cli.phar \
     && mv wp-cli.phar /usr/local/bin/wp \
     && wp --info

ENV WPINSTALLDIR=/var/www/html

# nvm install
#RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# nvm .profile install node --lts
#RUN echo 'export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"' >> ~/.bashrc
#RUN echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm' >> ~/.bashrc
#SHELL ["/bin/bash", "-c"]
#RUN sudo chown root:root $HOME/.bashrc && chmod 777 $HOME/.bashrc
#RUN sudo $HOME/.bashrc
#RUN nvm install --lts


# Node.js 14.x install
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash - && \
    sudo apt-get install -y nodejs && \
    npm i -g yarn && \
    yarn global add vue-cli gatsby-cli

#RUN wp core download \
#    --locale=ja --version=5.6.1 --path=${WPINSTALLDIR} --allow-root


#golang
#SHELL ["/bin/bash", "-c"]

#RUN wget https://golang.org/dl/go1.16.5.linux-amd64.tar.gz && \
#    tar -C /usr/local -xzf go1.16.5.linux-amd64.tar.gz
#RUN export PATH=$PATH:/usr/local/go/bin && \
#echo -e 'export PATH=$PATH:/usr/local/go/bin' >> $HOME/.profile && \
#echo -e '\n\
#if [ -f ~/.bash_aliases ]; then\n\
#    . ~/.bash_aliases\n\
#fi\n\
#alias s="source ~/.profile && source ~/.bashrc"\n\
#' >> $HOME/.bashrc && \
#    rm -rf go1.16.5.linux-amd64.tar.gz



#prompt customize
RUN echo 'PS1="\[\033[01;31m\]\u\[\033[00m\]@\h\[\033[00m\]:\[\033[01;36m\]\w\[\033[00m\]\[\e[0m\]\$ "' >> $HOME/.bashrc
RUN echo 'PS1="\[\033[01;33m\]\u\[\033[00m\]@\h\[\033[00m\]:\[\033[01;36m\]\w\[\033[00m\]\[\e[0m\]\$ "' >> /home/${USERNAME}/.bashrc

#RUN powerline
# WORKDIR $HOME
# RUN git clone https://github.com/b-ryan/powerline-shell
# WORKDIR $HOME/powerline-shell
# RUN python setup.py install

# #Debian系
# RUN echo -e '\n\
# function _update_ps1() {\n\
#   PS1=$(powerline-shell $?)\n\
# }\n\
# \n\
# if [[ $TERM != linux && ! $PROMPT_COMMAND =~ _update_ps1 ]]; then\n\
#   PROMPT_COMMAND="_update_ps1; $PROMPT_COMMAND"\n\
# fi\n\
# ' >> $HOME/.bashrc

RUN echo -e '\n\
if [ -f ~/.bashrc ] ; then\n\
  . ~/.bashrc\n\
fi\n\
' >> $HOME/.profile



ARG THEMENAME=${HOST}
COPY ./.htaccess ${WPINSTALLDIR}/
COPY ./wp-setup.sh ${WPINSTALLDIR}/
COPY ./docker-entrypoint.sh ${WPINSTALLDIR}/
RUN chown -R webadmin:webadmin /var/www/html


# ENV
# ENV WORDPRESS_DB_HOST=db:3306
# ENV WORDPRESS_DB_NAME=wordpress
# ENV WORDPRESS_DB_USER=wordpress
# ENV WORDPRESS_DB_PASSWORD=wordpress
# ENV WORDPRESS_DEBUG=0
# ENV WORDPRESS_TABLE_PREFIX=wp_


USER webadmin

#RUN /var/www/html/wp-setup.sh
