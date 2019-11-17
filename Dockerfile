FROM node:13.1.0-alpine
ARG VCS_REF
ARG BUILD_DATE
ARG VERSION
LABEL org.opencontainers.image.title="joplin-share-server" \
						org.opencontainers.image..description="Note sharing server for Joplin note taking app" \
						org.opencontainers.image.url="https://github.com/naxxfish/joplin-share-server" \
						org.opencontainers.image.source="https://github.com/naxxfish/joplin-share-server" \
						org.opencontainers.image.authors="Chris Roberts <chris@naxxfish.net> (https://naxxfish.net/)" \
						org.opencontainers.image.revision=$VCS_REF \
						org.opencontainers.image.version=$VERSION \
						org.opencontainers.image.licenses="MIT" \
						org.opencontainers.image.created=$BUILD_DATE 

WORKDIR /usr/src/app
ADD package*.json ./

RUN npm ci --production
COPY . .
EXPOSE 3000

CMD [ "npm", "start" ]