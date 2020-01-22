build:
	tsc
	postcss --dir public_html/ --ext css src/*css
parse:
	node dist/server/parse.js
run:
	node dist/server/server.js