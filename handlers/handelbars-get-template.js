'use strict'


//sistema de archivos
let fs = require('fs');


//handlebars
let handlebars = require('handlebars');


module.exports = {
  getTemplate
}


function getTemplate(archivo) {
  let source = fs.readFileSync(archivo, 'utf-8');
  let template = handlebars.compile(source);
  return template;
}

