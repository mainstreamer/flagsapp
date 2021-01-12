#!/usr/bin/env sh
docker exec -it php-flags-api sh -c "bin/console d:d:i flags.sql && bin/console d:s:v"
