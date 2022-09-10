const Localization = require('../index');

const loc = new Localization();

(async () => {

  await loc.loadFile('tests/test.csv');

  console.log(loc.languages);

  let res = { locals: {} }

  console.log("Default Language: " + loc.defaultLanguage)

  loc.middleware({query: {lang: 'english'}}, res, ()=>{});

  console.log(res.locals)

})()
