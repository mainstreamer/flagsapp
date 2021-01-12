#!/usr/bin/env sh

printf '\e[0;32m \r%s\e[0m\n' 'Building...'
yarn build
printf '\e[0;32m \r%s\e[0m\n' 'Zipping...'
zip -r build.zip build
printf '\e[0;32m \r%s\e[0m\n' 'Uploading build...'
scp build.zip root@api.izeebot.top:/var/www
printf '\e[0;32m \r%s\e[0m\n' 'Unzipping...'
ssh root@api.izeebot.top  'cd /var/www && unzip -o build.zip && rm -rf flags-app && mv build flags-app'
