const Localization = require('../index');

const loc = new Localization();

(async () => {

  await loc.loadFile('tests/eng-spa.csv');
  await loc.loadFile('tests/french.csv');

  console.log(loc.languages);
  console.log(JSON.stringify(loc.data));

  let res = { locals: {} }

  console.log("Default Language: " + loc.defaultLanguage)

  loc.middleware({query: {lang: 'english'}}, res, ()=>{});

  console.log(res.locals)

})()
