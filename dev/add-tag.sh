#!/bin/bash

eval $(ssh-agent)
ssh-add ~/.ssh/id_rsa

RED='\033[1;31m'
YELLOW='\033[1;33m'
GREEN='\033[1;32m'
NC='\033[0m' # No Color

update_push () 
{
	#adding tag
	if [[ "$1" != "" ]]; then
		git tag -a "$1" -m ""
	fi

	#pushing changes
	git push --tags
} 

get_next_version ()
{
	# DESCRIBE=$(git describe --tags $(git rev-list --tags --max-count=1) --abbrev=0);
	# DESCRIBE=$(git describe --tags --abbrev=0);
	TAG=$1

	VERSION=`echo $TAG | awk '{split($0,a,"."); print a[1]}'`
	BUILD=`echo $TAG | awk '{split($0,a,"."); print a[2]}'`
	PATCH=`echo $TAG | awk '{split($0,a,"."); print a[3]}'`
	
	if [[ "$(git describe --tags)" =~ -+ ]]; then
		if [[ "${TAG}" =~ ^[0-9]+$ ]]; then
			VERSION="0.0.0"
			BUILD=`git rev-list HEAD --count`
			PATCH=${TAG}
		fi

		if [ "${BUILD}" = "" ]; then
			BUILD='0'
		fi

		if [ "${PATCH}" = "" ]; then
			PATCH=$TAG
		fi
		
		PATCH=$((PATCH+1))
		
		echo ${VERSION}.${BUILD}.${PATCH}
	else
		echo ""
	fi
}

printf "${YELLOW}Pelase provide common tag to all modules:${NC} [empty]"
read -p "" DEFAULT_TAG
if [ "${DEFAULT_TAG}" = "" ]; then
	printf "${GREEN}Common tag is not provided${NC} \n\n"
else
	printf "${GREEN}Common tag is: ${RED}${DEFAULT_TAG}${NC} \n\n"
fi

printf "${YELLOW}Checking modules..${NC} \n\n"

cd ../modules

for dir in $(find . -name ".git" | sort)
do
   	cd ${dir%/*} > /dev/null

	printf "${GREEN}${dir%/*}${NC} \n"

	if [ "${DEFAULT_TAG}" = "" ]; then
		LATEST_TAG=$(git describe --tags --abbrev=0);
		NEXT_TAG=$(get_next_version $LATEST_TAG)
		NEW_TAG=$NEXT_TAG
	else
		NEW_TAG=$DEFAULT_TAG
	fi

	if [ "${NEXT_TAG}" = "" ]; then
		printf "No tag update is needed. The latest tag is ${GREEN}${LATEST_TAG}${NC} \n"
	else
		printf "${GREEN}${LATEST_TAG}${NC} > ${RED}${NEW_TAG}${NC} \n"
		LATEST_COMMITS=$(git log $LATEST_TAG..HEAD --oneline --no-decorate)
		printf "${YELLOW}Latest commits are the following:${NC}\n"
		printf "${LATEST_COMMITS//\\/\\\\} \n" # the //\\/\\\\ replaces \ with \\ in LATEST_COMMITS
		
		CONFIRM_TAG=false
		while true; do
			printf "${YELLOW}Do you want to add tag: ${RED}${NEW_TAG} ${YELLOW}?${NC} (y/n) \n"
			read -s -n 1 -p "" CONFIRM_TAG
			case $CONFIRM_TAG in
				y ) printf $CONFIRM_TAG && update_push "$NEW_TAG" && break;;
				n ) printf $CONFIRM_TAG && break;;
				* ) printf "${RED}Please answer y or n${NC}\n";;
			esac
		done
	fi
	echo "";

	cd - > /dev/null
done