const fs = require('fs');
const pdf = require('pdf-parse');

console.log("pdf is of type:", typeof pdf);
console.log("pdf keys:", Object.keys(pdf));

let dataBuffer = fs.readFileSync('../ELEMENTS SITES GAZ.pdf');

if (typeof pdf === 'function') {
    pdf(dataBuffer).then(function (data) {
        console.log(data.text);
    }).catch(err => {
        console.error("Error:", err);
    });
} else if (pdf.default && typeof pdf.default === 'function') {
    pdf.default(dataBuffer).then(function (data) {
        console.log(data.text);
    }).catch(err => {
        console.error("Error:", err);
    });
} else {
    console.error("pdf is not a function. Exported as:", pdf);
}
