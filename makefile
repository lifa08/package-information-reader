prebuild:
	tsc src/precompile/* --outDir dist/precompile/
parse: prebuild
	node dist/precompile/parse.js
build: parse
	tsc
	postcss --dir public_html/ --ext css src/**/*css
	browserify --entry dist/client/app.js -o public_html/app-bundle.js
run: build
	node dist/server/server.js