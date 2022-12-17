.PHONY: compile run-app
.SILENT: compile run-app
default: help

DOCKER_PROJECT = deel-challenge
DOCKER_COMPOSE_DEV = docker-compose \
			 -p $(DOCKER_PROJECT) \
			 -f $(shell pwd)/docker-compose.yml

help: ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

start: ## Starts the local environments
	$(DOCKER_COMPOSE_DEV) up -d --build