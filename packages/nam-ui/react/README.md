# @nam-ui/react

nam-ui's React components. They are styled with the tokens from `@nam-ui/core`, so the app loads
those once:

```ts
import '@nam-ui/core/css';
import '@nam-ui/core/fonts'; // optional: the Quicksand typeface
```

TypeScript apps need `"moduleResolution": "bundler"` (the usual setting for apps built with Vite,
webpack or Next.js). The type files are not written for `node16` or `nodenext` resolution.

## Importing components

Every component can be imported from the package root or from its own entry point. Both give the
same component.

```ts
import { Button } from '@nam-ui/react';
import { Button } from '@nam-ui/react/Button';
```

The same holds for the unstyled entry: `@nam-ui/react/unstyled` and `@nam-ui/react/unstyled/Button`.

## Loading the components' CSS

Pick one of the three ways for the whole app.

### 1. Automatic (recommended)

```ts
import { Button } from '@nam-ui/react';
```

Every component imports its own stylesheet, so the app gets the CSS of exactly the components it
uses and writes no stylesheet import. The app's bundler has to handle CSS imports from
`node_modules` (Vite, webpack and Next.js do). Code that loads the package in plain Node, such as
some test runners and server-rendering setups, needs to be told to process or ignore `.css` files.

### 2. One stylesheet

```ts
import '@nam-ui/react/styles.css';
import { Button } from '@nam-ui/react/unstyled';
```

`styles.css` holds every component's CSS, whether the app uses the component or not. The order of the
components inside the file is not defined, and nothing depends on it.

### 3. One stylesheet per component

```ts
import '@nam-ui/react/styles/Button.css';
import { Button } from '@nam-ui/react/unstyled';
```

The app imports the stylesheet of each component it uses, and of every nam-ui component that
component is built from, in any order.

### Do not mix the two entries

`@nam-ui/react` and `@nam-ui/react/unstyled` are two separate copies of the components. An app that
imports from both loads each component twice, and components that share state with each other (for
example through React context) stop working across the two copies. Importing a stylesheet together
with `@nam-ui/react` loads that CSS twice.

## Writing component styles

A component's stylesheet never relies on being loaded before or after another component's. When a
component adjusts the styles of a component it is built from, it uses a more specific selector
(for example `.nam-alert .nam-button`), so the result is the same whatever order the stylesheets
load in.

The same goes inside one stylesheet. Rules for states that can be true together exclude each
other (`:hover:not(:active)`) instead of relying on which one is written last.

## Class names

Components are styled with plain classes (`.nam-button`, `.nam-button--primary`, `.nam-button--md`).
The class names are part of the public API.
