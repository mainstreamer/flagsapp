#!/usr/bin/env sh

printf '\e[0;32m \r%s\e[0m\n' 'Starting...'
cd docker && docker-compose up
