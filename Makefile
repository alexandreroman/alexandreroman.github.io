.PHONY: dev install build

PORT ?= 1313

install:
	npm install

build: install
	hugo --minify

dev: install
	hugo server --baseURL "http://127.0.0.1.nip.io:$(PORT)/" --bind "0.0.0.0" --port $(PORT)
