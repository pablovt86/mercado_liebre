const bcrypt = require('bcrypt');

let password = "elgatomiau";

let resultados = bcrypt.hashSync(password, 10);

console.log(password);
console.log(resultados);