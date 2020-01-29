FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install -g typescript@^3.7.5
RUN npm install -g postcss@^7.0.26
RUN npm install -g postcss-cli@^7.1.0
RUN npm install -g nodemon@^2.0.2
RUN npm install -g browserify@^16.5.0
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "make", "parse", "build", "run" ]