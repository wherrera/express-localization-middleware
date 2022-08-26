const Localization = require('express-localization-middleware');

const loc = new Localization();

(async () => {

  await loc.loadFile('tests/test.csv');

  let res = { locals: {} }

  console.log("test///" + loc.middleware({query: {lang: 'spa'}}, res, ()=>{}))

  console.log(res)

})()
