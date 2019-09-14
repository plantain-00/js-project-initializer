
[![Dependency Status](https://david-dm.org/AUTHOR/REPOSITORY_NAME.svg)](https://david-dm.org/AUTHOR/REPOSITORY_NAME)
[![devDependency Status](https://david-dm.org/AUTHOR/REPOSITORY_NAME/dev-status.svg)](https://david-dm.org/AUTHOR/REPOSITORY_NAME#info=devDependencies)
[![Build Status: Linux](https://travis-ci.org/AUTHOR/REPOSITORY_NAME.svg?branch=master)](https://travis-ci.org/AUTHOR/REPOSITORY_NAME)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/github/AUTHOR/REPOSITORY_NAME?branch=master&svg=true)](https://ci.appveyor.com/project/AUTHOR/REPOSITORY_NAME/branch/master)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2FAUTHOR%2FREPOSITORY_NAME%2Fmaster%2Fpackage.json)](https://github.com/AUTHOR/REPOSITORY_NAME)

## install

```bash
git clone https://github.com/AUTHOR/REPOSITORY_NAME-release.git . --depth=1 && yarn add --production
node dist/index.js
```

## docker

```bash
docker run -d -p 9276:9276 AUTHOR/REPOSITORY_NAME
```
