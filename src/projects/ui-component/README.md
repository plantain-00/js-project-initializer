## features

+ vuejs component
+ reactjs component
+ angular component
+ custom component

## link css

```html
<link rel="stylesheet" href="./node_modules/REPOSITORY_NAME/dist/COMPONENT_SHORT_NAME.min.css" />
```

## vuejs component

`yarn add COMPONENT_SHORT_NAME-vue-component`

```ts
import "COMPONENT_SHORT_NAME-vue-component";
```

```html
<COMPONENT_SHORT_NAME :data="data">
</COMPONENT_SHORT_NAME>
```

the online demo: <https://AUTHOR.github.io/REPOSITORY_NAME/packages/vue/demo>

## reactjs component

`yarn add COMPONENT_SHORT_NAME-react-component`

```ts
import { COMPONENT_TYPE_NAME } from "COMPONENT_SHORT_NAME-react-component";
```

```jsx
<COMPONENT_TYPE_NAME data={this.data}>
</COMPONENT_TYPE_NAME>
```

the online demo: <https://AUTHOR.github.io/REPOSITORY_NAME/packages/react/demo>

## angular component

`yarn add COMPONENT_SHORT_NAME-angular-component`

```ts
import { COMPONENT_TYPE_NAMEModule } from "COMPONENT_SHORT_NAME-angular-component";

@NgModule({
    imports: [BrowserModule, FormsModule, COMPONENT_TYPE_NAMEModule],
    declarations: [MainComponent],
    bootstrap: [MainComponent],
})
class MainModule { }
```

```html
<COMPONENT_SHORT_NAME [data]="data">
</COMPONENT_SHORT_NAME>
```

the online demo: <https://AUTHOR.github.io/REPOSITORY_NAME/packages/angular/demo/jit>

the AOT online demo: <https://AUTHOR.github.io/REPOSITORY_NAME/packages/angular/demo/aot>

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
