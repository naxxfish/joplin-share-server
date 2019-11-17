FROM node:13.1.0-alpine
ARG VCS_REF
ARG BUILD_DATE
ARG VERSION
LABEL org.label-schema.name="joplin-share-server" \
						org.label-schema.description="Note sharing server for Joplin note taking app" \
						org.label-schma.url="https://github.com/naxxfish/joplin-share-server" \
						org.label-schma.vcs-url="https://github.com/naxxfish/joplin-share-server" \
						org.label-schema.vcs-ref=$VCS_REF \
						org.label-schema.version=$VERSION \
						org.label-schema.schema-version="1.0" \
						org.label-schema.docker.cmd="docker run -p 3000:3000 joplin-share-server" \
						org.label-schema.docker.cmd.devel="docker run -e NODE_ENV=development -p 3000:3000 joplin-share-server"


WORKDIR /usr/src/app
ADD package*.json ./

RUN npm ci --production
COPY . .
EXPOSE 3000

CMD [ "npm", "start" ]