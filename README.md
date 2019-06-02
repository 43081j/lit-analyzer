<p align="center">
  <img src="https://raw.githubusercontent.com/runem/ts-lit-plugin/master/documentation/asset/lit-plugin@256w.png" alt="Logo" width="200" height="auto" />
</p>
<h1 align="center">lit-analyzer</h1>
<p align="center">
		<a href="https://npmcharts.com/compare/lit-analyzer?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/lit-analyzer.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/lit-analyzer"><img alt="NPM Version" src="https://img.shields.io/npm/v/lit-analyzer.svg" height="20"/></a>
<a href="https://david-dm.org/runem/lit-analyzer"><img alt="Dependencies" src="https://img.shields.io/david/runem/lit-analyzer.svg" height="20"/></a>
<a href="https://github.com/runem/lit-analyzer/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/runem/lit-analyzer.svg" height="20"/></a>
<a href="https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin"><img alt="Publish at vscode marketplace" src="https://vsmarketplacebadge.apphb.com/version/runem.lit-plugin.svg" height="20"/></a>
	</p>


<p align="center">
  <img src="https://raw.githubusercontent.com/runem/ts-lit-plugin/master/documentation/asset/lit-plugin.gif" alt="Lit plugin GIF"/>
</p>

`lit-analyzer` is a CLI that makes it possible to easily analyze all `lit-html` templates in your code. It performs type checking on your bindings and automatically picks up on web components. 


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#installation)

## ➤ Installation

<!-- prettier-ignore -->
```bash
$ npm install lit-analyer -g
```

* If you use Visual Studio Code you can also install the [lit-plugin](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin) extension. 
* If you use Typescript you can also install [ts-lit-plugin](link-coming-soon).

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#usage)

## ➤ Usage

`lit-analyzer` analyses an optional `input glob` and emits the output to the console as default. When the `input glob` is omitted it will find all components in `src`.

<!-- prettier-ignore -->
```bash
$ lit-analyzer src
$ lit-analyzer "src/**/*.{js,ts}"
$ lit-analyzer my-element.js
$ lit-analyzer --outFile result.txt
```

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#features)

## ➤ Features

| Feature | Description |
|------------------------------------------------------------|--------|
| **Validating custom elements**                               | |
| [🤷‍ Unknown tag name](#-unknown-tag-name)                  | Unknown tag names are checked. Be aware that not all custom elements from libraries will be found out of the box. |
| [📣 Missing imports](#-missing-imports)                    | When using custom elements in HTML it is checked if the element has been imported and is available in the current context. |
| [☯ Unclosed tag](#-unclosed-tag)                           | Unclosed tags, and invalid self closing tags like custom elements tags, are checked. |
| **Validating binding names**                               | |
| [✅ Unknown attribute or property](#-unknown-attribute-or-property) | You will get a warning whenever you use an unknown attribute or property within your `lit-html` template. |
| [⚡️ Unknown event](#-unknown-event)                        | You can opt in to check for unknown event names. |
| [📬 Unknown slot name](#-unknown-slot-name)                | Using the "@slot" jsdoc tag on your custom element class, you can tell which slots are accepted for a particular element. |
| [✏️ Documenting slots, events, attributes and properties](#-documenting-slots-events-attributes-and-properties) | |
| [Custom vscode html data format](#-custom-vscode-html-data-format) | |
| **Validating binding types**                               | |
| [❓ Boolean attribute binding on a non-boolean type](#-boolean-attribute-binding-on-a-non-boolean-type)   | It never makes sense to use the boolean attribute binding on a non-boolean type. |
| [⚫️ Property binding without an expression](#-property-binding-without-an-expression)                     | Because of how `lit-html` [parses bindings internally](https://github.com/Polymer/lit-html/issues/843) you cannot use the property binding without an expression. |
| [🌀 Event handler binding with a non-callable type](#-event-handler-binding-with-a-non-callable-type)     | It's a common mistake to incorrectly call the function when setting up an event handler binding. This makes the function call whenever the code evaluates. |
| [😈 Binding to a boolean in an attribute binding](#-binding-to-a-boolean-in-an-attribute-binding)         | You should not be binding to a boolean type using an attribute binding because it could result in binding the string "true" or "false". Instead you should be using a *boolean* attribute binding. |
| [☢️ Attribute binding with complex type](#-attribute-binding-with-complex-type)                           | Binding an object using an attribute binding would result in binding the string "[object Object]" to the attribute. In this cases it's probably better to use a property binding instead |
| [⭕️ Attribute binding with value that can be undefined \| null ](#-attribute-binding-with-value-that-can-be-undefined--null-) | Binding `undefined` or `null` in an attribute binding will result in binding the string "undefined" or "null". Here you should probably wrap your expression in the "ifDefined" directive. |
| [💔 Binding an incompatible type](#-binding-an-incompatible-type) | Assignments in your HTML are typed checked just like it would be in Typescript. |
| [💥 Invalid usage of directives](#-invalid-usage-of-directives)   | Built in directives can only be used in certain binding types. |
| **Validating LitElement**                                  | |
| [💞 Incompatible LitElement property type](#-incompatible-litelement-property-type) | When using the @property decorator in Typescript, the property option `type` is checked against the declared property Typescript type |
| [👎 Unknown LitElement property type](#-unknown-litelement-property-type)           | LitElement provides default converters. For example 'Function' is not a valid default converter type for a LitElement-managed property. |
| [⁉️ Invalid attribute name](#-invalid-attribute-name)     | When using the property option `attribute`, the value is checked to make sure it's a valid attribute name. |
| [⁉️ Invalid custom element tag name](#-invalid-custom-element-tag-name)             | When defining a custom element the tag name is checked to make sure it's valid. |
| [💅 Validating CSS](#-validating-css)                     | CSS within the tagged template literal `css` will be validated. |

### Validating custom elements
All web components in your code are analyzed using [web-component-analyzer](https://github.com/runem/web-component-analyzer) which supports native custom elements and web components built with LitElement.

#### 🤷‍ Unknown tag name

Web components defined in libraries needs to either extend the global `HTMLElementTagNameMap` (typescript definition file) or include the "@customElement tag-name" jsdoc on the custom element class.

Below you will see an example of what to add to your library typescript definition files if you want type checking support for a given html tag name.

```typescript
declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}
```

#### 📣 Missing imports

When using custom elements in HTML it is checked if the element has been imported and is available in the current context. It's considered imported if any imported module (or their imports) defines the custom element. You can disable this check by setting `skipMissingImports` to true in the configuration (see [Configuring the plugin](#configuring-the-plugin)).

The following examples are considered warnings:
```js
html`<my-element></my-element>`
```

The following examples are not considered warnings:
```js
import "my-element.js";
html`<my-element></my-element>`
```


#### ☯ Unclosed tag

Unclosed tags, and invalid self closing tags like custom elements tags, are checked.

The following examples are considered warnings:
```js
html`<div>`
html`<video />`
html`<custom-element />`
```

The following examples are not considered warnings:
```js
html`<div></div>`
html`<custom-element></custom-element>`
html`<video></video>`
html`<input />`
```

### Validating binding names

Attributes, properties and events are picked up on custom elements using [web-component-analyzer](https://github.com/runem/web-component-analyzer) which supports native custom elements and web components built with LitElement.

#### ✅ Unknown attribute or property

You will get a warning whenever you use an unknown attribute or property. This check is made on both custom elements and built in elements. 

The following examples are considered warnings:
```js
html`<input .valuuue="${value}" tyype="button" />`
```

The following examples are not considered warnings:
```js
html`<input .value="${value}" type="button" />`
```

#### ⚡️ Unknown event

You can opt in to check for unknown event names. Using the `@event` jsdoc or the statement `this.dispatch(new CustomElement("my-event))` will make the event name available. Event names defined on an element are accepted globally because events bubbles. 

The following examples are considered warnings:
```js
html`<input @iinput="${console.log}" />`
```

The following examples are not considered warnings:
```js
html`<input @input="${console.log}" />`
```

#### 📬 Unknown slot name

Using the "@slot" jsdoc tag on your custom element class, you can tell which slots are accepted for a particular element. Then you will get warnings for invalid slot names and if you forget to add the slot attribute on elements without an unnamed slot.

```js
/**
 * @slot - This is a comment for the unnamed slot
 * @slot right - Right content
 * @slot left
 */
class MyElement extends HTMLElement {
}
customElements.define("my-element", MyElement);
```

The following examples are considered warnings:
```js
html`
<my-element>
  <div slot="not a slot name"></div>
</my-element>
`
```

The following examples are not considered warnings:
```js
html`
<my-element>
  <div></div>
  <div slot="right"></div>
  <div slot="left"></div>
</my-element>
`
```

#### ✏️ Documenting slots, events, attributes and properties

You can document attributes, properties, events and slots on your custom elements using the following jsdoc tags.

```js
/**
 * This is my element
 * @attr size
 * @attr {red|blue} color - The color of my element
 * @prop {String} value
 * @prop {Boolean} myProp - This is my property
 * @event change
 * @slot - This is a comment for the unnamed slot
 * @slot right - Right content
 * @slot left
 */
@customElement("my-element")
class MyElement extends LitElement { 
}
```

####  Custom vscode html data format

<!--This plugin already supports [custom vscode html data format](https://code.visualstudio.com/updates/v1_31#_html-and-css-custom-data-support) (see the configuration section) and I will of course work on supporting more methods of shipping metadata alongside custom elements.-->


### Validating binding types

Many checks involving analyzing bindings will work better in Typescript files because we have more information about the values being bound.

#### ❓ Boolean attribute binding on a non-boolean type

It never makes sense to use the boolean attribute binding on a non-boolean type.

The following examples are considered warnings:
```js
html`<input ?type="${"button"}" />`
```

The following examples are not considered warnings:
```js
html`<input ?disabled="${isDisabled}" />`
```

#### ⚫️ Property binding without an expression

Because of how `lit-html` [parses bindings internally](https://github.com/Polymer/lit-html/issues/843) you cannot use the property binding without an expression.

The following examples are considered warnings:
```js
html`<input .value="text" />`
```

The following examples are not considered warnings:
```js
html`<input .value="${text}" />`
```

#### 🌀 Event handler binding with a non-callable type

It's a common mistake to incorrectly call the function when setting up an event handler binding. This makes the function call whenever the code evaluates. 

The following examples are considered warnings:
```js
html`<button @click="${myEventHandler()}">Click</button>`
html`<button @click="${{hannndleEvent: console.log()}}">Click</button>`
```

The following examples are not considered warnings:
```js
html`<button @click="${myEventHandler}">Click</button>`
html`<button @click="${{handleEvent: console.log}}">Click</button>`
```

#### 😈 Binding to a boolean in an attribute binding

You should not be binding to a boolean type using an attribute binding because it could result in binding the string "true" or "false". Instead you should be using a *boolean* attribute binding.

This error is particular tricky, because the string "false" is truthy when evaluated in a conditional.

The following examples are considered warnings:
```js
html`<input disabled="${isDisabled}" />`
```

The following examples are not considered warnings:
```js
html`<input ?disabled="${isDisabled}" />`
```

#### ☢️ Attribute binding with complex type

Binding an object using an attribute binding would result in binding the string "[object Object]" to the attribute. In this cases it's probably better to use a property binding instead.

The following examples are considered warnings:
```js
html`<my-list listitems="${listItems}"></my-list>`
```

The following examples are not considered warnings:
```js
html`<my-list .listItems="${listItems}"></my-list>`
```


#### ⭕️ Attribute binding with value that can be undefined | null 

Binding `undefined` or `null` in an attribute binding will result in binding the string "undefined" or "null". Here you should probably wrap your expression in the "ifDefined" directive.

The following examples are considered warnings:
```js
html`<input value="${maybeUndefined}" />`
html`<input value="${maybeNull}" />`
```

The following examples are not considered warnings:
```js
html`<input value="${ifDefined(maybeUndefined)}" />`
html`<input value="${ifDefined(maybeNull === null ? undefined : maybeNull)}" />`
```

#### 💔 Binding an incompatible type

Assignments in your HTML are typed checked just like it would be in Typescript.

The following examples are considered warnings:
```js
html`<input type="wrongvalue" />`
html`<input placeholder />`
html`<input max="${"hello"}" />`
html`<my-list .listItems="${123}"></my-list>`
```

The following examples are not considered warnings:
```js
html`<input type="button" />`
html`<input placeholder="a placeholder" />`
html`<input max="${123}" />`
html`<my-list .listItems="${listItems}"></my-list>`
```

#### 💥 Invalid usage of directives

Directives are checked to make sure that the following rules are met. The directives already make these checks on runtime, so this will help you catch errors before runtime.
* `ifDefined` is only used in an attribute binding.
* `class` is only used in an attribute binding on the 'class' attribute.
* `style` is only used in an attribute binding on the 'style' attribute.
* `unsafeHTML`, `cache`, `repeat`, `asyncReplace` and `asyncAppend` are only used within a text binding.

The following examples are considered warnings:
```js
html`<button value="${unsafeHTML(html)}"></button>`
html`<input .value="${ifDefined(myValue)}" />`
html`<div role="${class(classMap)}"></div>`
```

The following examples are not considered warnings:
```js
html`<button>${unsafeHTML(html)}</button>`
html`<input .value="${myValue}" />`
html`<input value="${myValue}" />`
html`<div class="${class(classMap)}"></div>`
```



### Validating LitElement

#### 💞 Incompatible LitElement property type

When using the @property decorator in Typescript, the property option `type` is checked against the declared property Typescript type.

The following examples are considered warnings:
```js
class MyElement extends LitElement {
  @property({type: Number}) text: string;
  @property({type: Boolean}) count: number;
  @property({type: String}) disabled: boolean;
  @property({type: Object}) list: ListItem[];
}
```

The following examples are not considered warnings:
```js
class MyElement extends LitElement {
  @property({type: String}) text: string;
  @property({type: Number}) count: number;
  @property({type: Boolean}) disabled: boolean;
  @property({type: Array}) list: ListItem[];
}
```

#### 👎 Unknown LitElement property type

The default converter in LitElement only accepts `String`, `Boolean`, `Number`, `Array` and `Object`, so all other values for `type` are considered warnings. This check doesn't run if a custom converter is used.

The following examples are considered warnings:
```js
class MyElement extends LitElement {
  static get properties () {
    return {
      callback: {
        type: Function
      },
      text: {
        type: MyElement
      }
    }
  }
}
```

The following examples are not considered warnings:
```js
class MyElement extends LitElement {
  static get properties () {
    return {
      callback: {
        type: Function,
        converter: myCustomConverter
      },
      text: {
        type: String
      }
    }
  }
}
```


#### ⁉️ Invalid attribute name

When using the property option `attribute`, the value is checked to make sure it's a valid attribute name.

The following examples are considered warnings:
```js
class MyElement extends LitElement {
  static get properties () {
    return {
      text: {
        attribute: "invald=name"
      }
    }
  }
}
```

#### ⁉️ Invalid custom element tag name

When defining a custom element, the tag name is checked to make sure it's a valid custom element name.

The following examples are considered warnings:
```js
@customElement("wrongElementName")
class MyElement extends LitElement {
}

customElements.define("alsoWrongName", MyElement);
```

The following examples are not considered warnings:
```js
@customElement("my-element")
class MyElement extends LitElement {
}

customElements.define("correct-element-name", MyElement);
```

#### 💅 Validating CSS

`lit-analyzer` uses [vscode-html-languageservice](https://github.com/Microsoft/vscode-html-languageservice) to validate CSS.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#configuring-the-plugin)

## ➤ Configuring the plugin

If you are using the vscode plugin you can configure these options directly from extension settings. If not you can add the options directly to the `compilerOptions.plugins` section of your `ts-config.json` file.

### General settings
#### disable
 
-   **Type**: boolean
-   **Default**: false
-   **Description**: Completely disable this plugin.
 
#### htmlTemplateTags
 
-   **Type**: string[]
-   **Default**: ["html", "raw"]
-   **Description**: List of template tags to enable html support in.
 
#### cssTemplateTags
 
-   **Type**: string[]
-   **Default**: ["css"]
-   **Description**: List of template tags to enable css support in.

#### format.disable
 
-   **Type**: boolean
-   **Default**: false
-   **Description**: Disable formatting the HTML on code reformat.

### Add checks
#### checkUnknownEvents
 
-   **Type**: boolean
-   **Default**: false
-   **Description**: Activating this setting will make the plugin emit errors on unknown events.

### Skip checks
#### skipMissingImports
 
-   **Type**: boolean
-   **Default**: false
-   **Description**: Skip reporting missing imports of custom elements.

#### skipSuggestions
 
-   **Type**: boolean
-   **Default**: false
-   **Description**: Don't attach suggestions alongside warnings and errors.

#### skipUnknownTags
 
-   **Type**: boolean
-   **Default**: false
-   **Description**: Skip reporting unknown html tags.

#### skipUnknownAttributes
 
-   **Type**: boolean
-   **Default**: false
-   **Description**: Skip reporting unknown html attributes.

#### skipUnknownProperties
 
-   **Type**: boolean
-   **Default**: false
-   **Description**: Skip reporting unknown properties on elements.

#### skipUnknownSlots
 
-   **Type**: boolean
-   **Default**: false
-   **Description**: Skip reporting unknown slot names.

#### skipTypeChecking
 
-   **Type**: boolean
-   **Default**: false
-   **Description**: Skip type checking of attributes and properties.
  
### Extra data
#### globalTags
 
-   **Type**: string[]
-   **Description**: List of html tag names that you expect to be present at all times.
 
#### globalAttributes
 
-   **Type**: string[]
-   **Description**: List of html attributes names that you expect to be present at all times.

#### globalEvents
 
-   **Type**: string[]
-   **Description**: List of event names that you expect to be present at all times.

#### customHtmlData
 
-   **Type**: [Vscode custom HTML data format](https://github.com/Microsoft/vscode-html-languageservice/blob/master/docs/customData.md) you can both specify a relative file paths or an entire objects with the data here. This value can both be an array and an object.
-   **Description**: This plugin support the [custom vscode html data format](https://code.visualstudio.com/updates/v1_31#_html-and-css-custom-data-support) through this setting.
 

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#contributors)

## ➤ Contributors
	

| [<img alt="Rune Mehlsen" src="https://avatars2.githubusercontent.com/u/5372940?s=460&v=4" width="100">](https://twitter.com/runemehlsen) | [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="You?" src="https://joeschmoe.io/api/v1/random" width="100">](https://github.com/runem/ts-lit-plugin/blob/master/CONTRIBUTING.md) |
|:--------------------------------------------------:|:--------------------------------------------------:|:--------------------------------------------------:|
| [Rune Mehlsen](https://twitter.com/runemehlsen)  | [Andreas Mehlsen](https://twitter.com/andreasmehlsen) | [You?](https://github.com/runem/ts-lit-plugin/blob/master/CONTRIBUTING.md) |


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#license)

## ➤ License
	
Licensed under [MIT](https://opensource.org/licenses/MIT).
