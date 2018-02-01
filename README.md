# root-directory


> get the root directory by find the package.json 

## Install

```
$ npm install --save root-directory
```


## Usage

```
└── workspace
    └── nodeWork
        ├── package.json
        └── index.js
        └── src
            ├── a.html
            └── b.js
```

```js
// b.js
const getRootDir = require('root-directory');

(async () => {
    const rootDir = await getRootDir();
    console.log(rootDir);
})();
```


## API

### getRootDir([cwd])

Type: `string`<br>
Default: `process.cwd()`

Returns a `Promise` for either the project root path or `null` if it couldn't be found.
