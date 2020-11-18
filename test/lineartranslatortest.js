const LinearTranslator=require("../src/util/LinearTranslator");

let translator=new LinearTranslator();

translator.setFirstPoint(500,4);
translator.setSecondPoint(1000,6);

console.log(translator.translate(500));
console.log(translator.translate(1000));
console.log(translator.translate(750));
