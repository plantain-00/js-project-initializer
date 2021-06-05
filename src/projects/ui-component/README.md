
[![Dependency Status](https://david-dm.org/AUTHOR/REPOSITORY_NAME.svg)](https://david-dm.org/AUTHOR/REPOSITORY_NAME)
[![devDependency Status](https://david-dm.org/AUTHOR/REPOSITORY_NAME/dev-status.svg)](https://david-dm.org/AUTHOR/REPOSITORY_NAME#info=devDependencies)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/github/AUTHOR/REPOSITORY_NAME?branch=master&svg=true)](https://ci.appveyor.com/project/AUTHOR/REPOSITORY_NAME/branch/master)
![Github CI](https://github.com/AUTHOR/REPOSITORY_NAME/workflows/Github%20CI/badge.svg)
[![npm version](https://badge.fury.io/js/REPOSITORY_NAME.svg)](https://badge.fury.io/js/REPOSITORY_NAME)
[![Downloads](https://img.shields.io/npm/dm/REPOSITORY_NAME.svg)](https://www.npmjs.com/package/REPOSITORY_NAME)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2FAUTHOR%2FREPOSITORY_NAME%2Fmaster%2Fpackage.json)](https://github.com/AUTHOR/REPOSITORY_NAME)

## features

+ vuejs component
+ reactjs component
+ custom component

## link css

```html
<link rel="stylesheet" href="./node_modules/REPOSITORY_NAME/dist/COMPONENT_SHORT_NAME.min.css" />
```

## vuejs component

[![gzip size](https://img.badgesize.io/https://unpkg.com/COMPONENT_SHORT_NAME-vue-component?compression=gzip)](https://unpkg.com/COMPONENT_SHORT_NAME-vue-component)

`yarn add COMPONENT_SHORT_NAME-vue-component`

```ts
import { COMPONENT_TYPE_NAME } from "COMPONENT_SHORT_NAME-vue-component";
app.component('COMPONENT_SHORT_NAME', COMPONENT_TYPE_NAME)
```

or

```html
<script src="./node_modules/vue/dist/vue.min.js"></script>
<script src="./node_modules/COMPONENT_SHORT_NAME-vue-component/dist/COMPONENT_SHORT_NAME-vue-component.min.js"></script>
```

```html
<COMPONENT_SHORT_NAME :data="data">
</COMPONENT_SHORT_NAME>
```

the online demo: <https://AUTHOR.github.io/REPOSITORY_NAME/packages/vue/demo>

## reactjs component

[![gzip size](https://img.badgesize.io/https://unpkg.com/COMPONENT_SHORT_NAME-react-component?compression=gzip)](https://unpkg.com/COMPONENT_SHORT_NAME-react-component)

`yarn add COMPONENT_SHORT_NAME-react-component`

```ts
import { COMPONENT_TYPE_NAME } from "COMPONENT_SHORT_NAME-react-component";
```

or

```html
<script src="./node_modules/react/umd/react.production.min.js"></script>
<script src="./node_modules/react-dom/umd/react-dom.production.min.js"></script>
<script src="./node_modules/COMPONENT_SHORT_NAME-react-component/dist/COMPONENT_SHORT_NAME-react-component.min.js"></script>
```

```jsx
<COMPONENT_TYPE_NAME data={this.data}>
</COMPONENT_TYPE_NAME>
```

the online demo: <https://AUTHOR.github.io/REPOSITORY_NAME/packages/react/demo>

## properties and events of the component

name | type | description
--- | --- | ---
data | [COMPONENT_TYPE_NAMEData](#COMPONENT_SHORT_NAME-data-structure)[] | the data of the COMPONENT_SHORT_NAME

## COMPONENT_SHORT_NAME data structure

```ts
type COMPONENT_TYPE_NAMEData<T = any> = {
    component: string | Function; // the item component, for vuejs, it is the component name, for reactjs, it is the class object
    data: T; // the data will be passed to the component as `data` props
};
```
