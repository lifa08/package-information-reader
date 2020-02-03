# ![PkgInfo - web app](doc/demo_page.png)

# PkgInfo - web app
<table>
<tr>
<td>
  This simple web application reads information about installed packages of 
  a Debian and Ubuntu system
  and displays key package information.
</td>
</tr>
</table>

## Technologies
* Node.js
* Typescript
* PostCSS
* HTML
* Docker
* Heroku
* Makefile
* Browserify

## Site
https://package-information-reader.herokuapp.com

## Usage

### Parse package information
1. `make build-parser`: compile the parser from TypeScript to JavaScript
2. `make parse`: parse package information

_Note: This is must be preceded the following build._ 

### Build

`make build`: compile TypeScript to JavaScript, transform PostCSS to CSS, run Browserify to bundle up JavaScript files. 

### Start the server

`make run`: start the server

`make watch`: recompile the server and restart on source file changes

### Dockerize
`make build-docker-image`: create a docker image for the project

`make run-docker-image` run the docker image in background

`make debug-docker-image`: run the docker image in a interactive debug mode

 The server will be listening by default in address http://localhost:3000. 







