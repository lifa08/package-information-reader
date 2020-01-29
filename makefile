build-parser:
	tsc src/precompile/* --outDir dist/precompile/
parse: build-parser
	node dist/precompile/parse.js
build:
	tsc
	postcss --dir public_html/ --ext css src/**/*css
	browserify --entry dist/client/app.js -o public_html/app-bundle.js
run:
	node dist/server/server.js
watch:
	nodemon --ext "ts, pcss" --exec "make build run || exit 1"
build-docker-image:
	docker build -t reaktor-assignment .
debug-docker-image:
	docker run -it -p 127.0.0.1:3000:3000 reaktor-assignment /bin/bash
run-docker-image:
	docker run -p 127.0.0.1:3000:3000 -d reaktor-assignment
set-heroku-docker-stack:
	heroku stack:set container