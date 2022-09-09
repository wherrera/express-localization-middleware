const Localization = require('../index');

const loc = new Localization();

(async () => {

  await loc.loadFile('tests/test.csv');

  let res = { locals: {} }

  console.log("test///" + loc.middleware({query: {lang: 'spa'}}, res, ()=>{}))

  console.log(res)

})()
