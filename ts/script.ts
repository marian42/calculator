import { App } from "./ui/App";
import { Unit } from "./calculator/units/Unit";
import { NamedUnit } from "./calculator/units/NamedUnit";

console.log(Unit.getPrefixLexerRule());
console.log(NamedUnit.getLexerRule());

let app = new App();
