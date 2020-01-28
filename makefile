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