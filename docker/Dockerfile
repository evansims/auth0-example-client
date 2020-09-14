FROM node:10-alpine3.9

# 4200 = Ember server
# 7020 = Livereload server
# 7357 = Test server
EXPOSE 4200 7020 7357
WORKDIR /myapp

# Install watchman build dependencies
RUN apk add --no-cache \
    yarn \
    git \
    python-dev \
    libgcc \
    libstdc++

# Copy the watchman executable binary directly from our image:
COPY --from=icalialabs/watchman:alpine3.9 /usr/local/bin/watchman* /usr/local/bin/

# Create the watchman STATEDIR directory:
RUN mkdir -p /usr/local/var/run/watchman \
 && touch /usr/local/var/run/watchman/.not-empty

# set container bash prompt color to blue in order to
# differentiate container terminal sessions from host
# terminal sessions
RUN \
	echo 'PS1="\[\\e[0;94m\]${debian_chroot:+($debian_chroot)}\\u@\\h:\\w\\\\$\[\\e[m\] "' >> ~/.bashrc

RUN yarn config set cache-folder /yarn
RUN yarn config set ignore-engines true

# install ember-cli
RUN yarn global add \
    ember-cli@3.4.3 \
    browser-sync@2.26.7 \
    gulp-cli@2.2.0 \
    yarn-deduplicate@1.1.1

# run ember server on container start
CMD ["sh", "./tmp/entrypoint.sh"]
