/*
MIT License

Copyright (c) 2022 William Herrera

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const events = require('events');
const fs = require('fs');
const readline = require('readline');

class Localization {

  constructor(filename) {
    if(filename) {
      this.loadFile(filename)
    }
  }
  
  get middleware() {
    let _data = this.data || {};
    console.log(_data)
    return function (req, res, next) {
      let lang_code = req.query.lang || req.body.lang;
      if(!_data[lang_code]) {
        console.error('unknown language code: ' + lang_code);
      }
      let _dict = _data[lang_code] || _data['eng'];//default to english
      for (const [key, value] of Object.entries(_dict)) {
        res.locals[key] = value;
      }
      next();
    }
  }

  async loadFile(filename) {
    this.data = await this.parseLocalizationCSV(filename);
  }

  async parseLocalizationCSV (filename, separator = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/g) {
      function _filter(str) {
        if( str.startsWith("\"") && str.endsWith("\"") ) {
          return str.substring(1, str.length-1)
        }
        else {
          return str;
        }
      }
      let _dict = {}
      const rl = readline.createInterface({
        input: fs.createReadStream(filename),
        crlfDelay: Infinity
      });
      let lines = []
      rl.on('line', (line) => {
        console.log(line)
        lines.push(line);
      });  
      await events.once(rl, 'close');
      let language_codes = lines[0].split(separator); language_codes.shift();
      let lang_codes= [];
      language_codes.forEach(lang => {
        let lang_code = _filter(lang.trim());
        _dict[lang_code] = {}
        lang_codes.push(lang_code);
      });
      lines.shift();
      lines.forEach(line => {
        let columns = line.split(separator);
        let token = columns[0]; columns.shift();        
        for(let i=0; i < columns.length; i++) {
            let dict = _dict[lang_codes[i]];
            dict[token] = _filter( columns[i].trim() );
        }
      });
      return _dict;
  }
}

module.exports = Localization;