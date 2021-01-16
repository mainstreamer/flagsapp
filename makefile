include .env
reset:
#Delete the relevant section from the .gitmodules file.
	/bin/rm -rf .gitmodules
	> .gitmodules 
#Stage the .gitmodules changes git add .gitmodules 
	git add .gitmodules
#Delete the relevant section from .git/config.# ^(\[submodule)(.+(\n))+(?=\[) # sed -e "s/^(\[submodule)(.+(\\n))+(?=\[)/gm"
	@echo "Delete the relevant section from .git/config"
	@/bin/rm .git/config
	git init
#Run git rm --cached path_to_submodule
	git rm -r --cached ${CODE_PATH} || true
#Run rm -rf .git/modules/path_to_submodule
	/bin/rm -rf .git/modules/${CODE_PATH}
#Commit git commit -m "Removed submodule"
	git commit -am "Removed submodule"
#rm -rf path_to_submodule
	/bin/rm  -rf ${CODE_PATH}
	git remote add origin ${GIT_REMOTE_URL}
init: init-submodule update build start db
init-submodule:
	git submodule add -b ${BRANCH} -- ${GIT_URL} ${CODE_PATH}
	git submodule update --init
update:
	git submodule update --remote	
build:
	docker-compose build
start:
	docker-compose up -d
db:
	@docker cp ./.docker/presets/db/db.sql php-${PROJECT_NAME}:/var/www/webapp
	docker exec -it php-${PROJECT_NAME} sh -c "bin/console d:d:i db.sql && bin/console d:s:v"
	docker exec -it php-${PROJECT_NAME} sh -c "cd /var/www/webapp && rm -f db.sql"
run: start message
message:
	@echo Hello! I\'m up and running...
