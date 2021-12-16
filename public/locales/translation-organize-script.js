const fs = require('fs');
const path = require('path');

const lang = 'zh'
const file = 'stats'

let account = JSON.parse(fs.readFileSync(path.resolve(__dirname, './' + lang + '/' + file + '.json')))
let common = JSON.parse(fs.readFileSync(path.resolve(__dirname, './' + lang + '/common.json')))

Object.keys(account).forEach(key => {
  account[key] = common[key];
  delete common[key];
})

fs.writeFileSync(path.resolve(__dirname, './' + lang + '/new-' + file + '.json'), JSON.stringify(account))
fs.writeFileSync(path.resolve(__dirname, './' + lang + '/new-common.json'), JSON.stringify(common))