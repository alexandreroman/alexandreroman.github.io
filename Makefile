.PHONY: dev install build

install:
	npm install

build: install
	hugo --minify

dev: install
	hugo server --baseURL "http://127.0.0.1.nip.io:1313/" --bind "0.0.0.0"
