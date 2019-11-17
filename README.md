# Joplin Share Server

![GitHub package.json version](https://img.shields.io/github/package-json/v/naxxfish/joplin-share-server) ![Travis (.org)](https://img.shields.io/travis/naxxfish/joplin-share-server) [![Coverage Status](https://coveralls.io/repos/github/naxxfish/joplin-share-server/badge.svg?branch=master)](https://coveralls.io/github/naxxfish/joplin-share-server?branch=master) ![GitHub](https://img.shields.io/github/license/naxxfish/joplin-share-server)

[Joplin](https://joplinapp.org/) is a free, open source note taking and to-do application, which can handle a large number of notes organised into notebooks. The notes are in [Markdown Format](https://github.com/laurent22/joplin#markdown)

One of the most searched for features in Joplin is the ability to [share a note](https://discourse.joplinapp.org/t/sharing-notes-or-notebooks/67). This is technically tricky, especially when End-to-End Encryption is enabled within Joplin. Unfortunately it is not as simple as sharing the backend files.  

This server aims to be a middle point which two Joplin users can exchange encrypted note data, to allow a note to be shared with another user, who keeps their own copy within their own notebook. It is designed to be able to be self hosted by users - although the server itself will never see the contents of the notes (which are all encrypted). 

## Installation

***ALPHA***: This will become simpler!

First clone the the repo

    git clone git@github.com:naxxfish/joplin-share-server.git

Then run docker-compose to bring up the service

    docker-compose up -d

The service will be running on port 3000. 

## API Reference

The service provides a HTTP API. It provides no authentication (if you want this, put a reverse proxy in front of the service, e.g. nginx)

### POST Note

Used to create a note to be shared.  The server will generate an ID for the note on submission, which is returned and can be used to build a URL to send to the recipent. 

It is not possible to overwrite an existing note. Version numbers increment as updates are applied to them. 

**URL**:  `/note/`
**Method**: `POST`
**Data constraints**
```json
{
    "encryption": "AES-128",
    "noteContents":"<base64 encoded encrypted note>",
    "originator": "your_unique_id"
}
```
**Data example**
***Request***:
```json
{
    "encryption": "AES-128",
    "originator":"chris[AT]naxxfish.net",
    "noteContents": "fmKGpKT5/Frx1OvLpjRaX86ymamSFozVqYGruRHtoG8/TwHUaTa0zFjeSd8M4MXoCz1Q4rBwcpIhodeFnaMKc+5QFTdh4+xQYG+cui37t3WP7qGHxlYBG5vMiuc0bpOyi3nsZdQgDgoFvPYQSzfFpJPGeYLF7i7E8IMi2aqOknOWKtAkYT3GUMhlj0qsYx0r142S1qv+kWQ9VsMLdQye4VhCbcoRlD55eoX5UmHm9cgCJaeEPGc1w1utQFbu5rcJv4GENw8w5u358hYaXFwuQtMvESVM+lbAK+y/0q5XtgJZMo6hwUtMyfecvxIklnwiPsPY83XjKkwRA9Z+n0dlqNmaePK2T60NzorFs1hVqwEsKa033fMrYt8iHUtDb7bVanQTF/oEXOVywrfpiSyBZ571InT88xjIfFndawclrv3Kni+PWU+PNQoaiH/je4n1703B7oLm+ul0LBkxlVIynG8o3obd22PvkfI9LK7qYBDzKVuBXOsAUFolNEICdfGAETefdJWjS0FawYGeviuZ0hut8404zJetQbSx2FVaejHzNiF1yBkFF70JjbpQa3npWPrb5CCbfQcKJmRgQ5BnETRUIsM8+SXvExRTsfsOVMzCeFuhDumvAb/pbKbnqO5L7fFrvHsdLVkkq1jaVoKp7g=="
}
```
***Response***:
```json
{
    "noteId": "2f01d661-d9f7-468d-b940-067552e12641",
    "version": "1" 
}
```

### GET Note

Retrieves an encrypted note from the server. 

**URL**:  `/note/:noteId`
**Method**: `GET`

**Data example**
***Request***: `GET /note/2f01d661-d9f7-468d-b940-067552e12641`
***Response***:
```json
{
    "encryption": "AES-128",
    "originator":"chris[AT]naxxfish.net",
    "version":"1",
    "noteContents": "fmKGpKT5/Frx1OvLpjRaX86ymamSFozVqYGruRHtoG8/TwHUaTa0zFjeSd8M4MXoCz1Q4rBwcpIhodeFnaMKc+5QFTdh4+xQYG+cui37t3WP7qGHxlYBG5vMiuc0bpOyi3nsZdQgDgoFvPYQSzfFpJPGeYLF7i7E8IMi2aqOknOWKtAkYT3GUMhlj0qsYx0r142S1qv+kWQ9VsMLdQye4VhCbcoRlD55eoX5UmHm9cgCJaeEPGc1w1utQFbu5rcJv4GENw8w5u358hYaXFwuQtMvESVM+lbAK+y/0q5XtgJZMo6hwUtMyfecvxIklnwiPsPY83XjKkwRA9Z+n0dlqNmaePK2T60NzorFs1hVqwEsKa033fMrYt8iHUtDb7bVanQTF/oEXOVywrfpiSyBZ571InT88xjIfFndawclrv3Kni+PWU+PNQoaiH/je4n1703B7oLm+ul0LBkxlVIynG8o3obd22PvkfI9LK7qYBDzKVuBXOsAUFolNEICdfGAETefdJWjS0FawYGeviuZ0hut8404zJetQbSx2FVaejHzNiF1yBkFF70JjbpQa3npWPrb5CCbfQcKJmRgQ5BnETRUIsM8+SXvExRTsfsOVMzCeFuhDumvAb/pbKbnqO5L7fFrvHsdLVkkq1jaVoKp7g=="
}
```

### GET Note Version

Retrieves just the current version number for a note.

**URL**:  `/note/:noteId/version`
**Method**: `GET`

**Data example**
***Request***: `GET /note/2f01d661-d9f7-468d-b940-067552e12641/version`
***Response***:
```json
{
    "originator":"chris[AT]naxxfish.net",
    "version":"1"
}
```

## Building
You can build this with npm as usual:

    npm install


## Contributing

This server was entirely made speculatively in response to the feature request in the Joplin forums. Feel free to raise a PR.  Please make sure 

## License

The MIT License (MIT)

Copyright (c) 2019 Chris Roberts

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.