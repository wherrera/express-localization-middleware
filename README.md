# express-localization-middleware

```javascript

const Express = require('express');
const Localization = require('express-localization-middleware');

const app = Express();
const loc = new Localization();

(async () => {
  await loc.loadFile('tests/test.csv');
})()

app.use(loc.middleware);

```