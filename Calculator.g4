grammar Calculator;


// Parser rules
statement :
	expression									# statementExpression
	| name ASSIGN expression					# assignment
;

expression :
	  expression POW expression					# exprPower
	| expression TINYNUMBER	unit?				# exprTinyPower
	| expression op=(MUL | DIV) expression		# exprMulDiv
	| SUB expression							# exprInvert
	| expression op=(ADD | SUB) expression		# exprAddSub
	| number unit?								# exprNumber
	| '(' expression ')' unit?					# exprParentheses
	| name '(' (expression (',' expression)*)? ')'# exprFunctioncall
	| name										# exprVariable
;

unit :
	  unit POW number							# unitPower
	| unit TINYNUMBER							# unitTinyPower
	| unit (DIV | 'per') unit					# unitDivision
	| unit MUL unit								# unitProduct
	| '(' unit ')'								# unitParentheses
	| SQUARE unit								# unitSquared
	| CUBIC unit								# unitCubed
	| NAMEDUNIT									# unitName
	| PREFIXEDUNIT								# unitWithPrefix
;

number : NUM;

name: ID | NAMEDUNIT | PREFIXEDUNIT;

// Lexer rules

fragment INT : [0-9]+ | '0b' ('0'|'1')+ | '0x' [0-9a-fA-F]+;
fragment FLOAT : [0-9]+ ('.' [0-9]+)? ('e' ('+' | '-')? [0-9]+)?;
NUM : INT | FLOAT;

fragment UNITPREFIX : 'Y' | 'yotta' | 'Z' | 'zetta' | 'E' | 'exa' | 'P' | 'peta' | 'T' | 'terra' | 'G' | 'giga' | 'M' | 'mega' | 'k' | 'kilo' | 'h' | 'hecto' | 'd' | 'deci' | 'c' | 'centi' | 'm' | 'milli' | 'µ' | 'micro' | 'n' | 'nano' | 'p' | 'pico' | 'f' | 'femto' | 'a' | 'atto' | 'z' | 'zepto' | 'y' | 'yocto';
NAMEDUNIT : 'm' | 'meter' | 'mtr' | 'meters' | 'g' | 'gram' | 'grams' | 's' | 'second' | 'seconds' | 'A' | 'ampere' | 'amperes' | 'ampère' | 'ampères' | 'K' | 'kelvin' | 'kelvins' | '°F' | 'fahrenheit' | 'degrees fahrenheit' | '°C' | 'celsius' | 'degrees celsius' | 'mol' | 'mole' | 'moles' | 'cd' | 'candela' | 'candelas' | '%' | 'percent' | 'rad' | 'radian' | 'radians' | 'bit' | 'b' | 'bits' | 'USD' | '$' | 'dollar' | 'dollars' | 'miles' | 'mile' | 'nautical mile' | 'nautical miles' | 'in' | 'inch' | 'inches' | '"' | 'ft' | 'foot' | 'feet' | '\'' | 'yard' | 'yards' | 'AU' | 'astronomical unit' | 'ly' | 'Ly' | 'light year' | 'pc' | 'parsec' | 'parsecs' | 'Å' | 'angstrom' | 'angstroms' | 'micron' | 'acre' | 'acres' | 'ha' | 'hectare' | 'hectares' | 'L' | 'liter' | 'liters' | 'litre' | 'litres' | 'gal' | 'gallon' | 'gallons' | 'fluid ounce' | 'fl oz' | 'g' | 'gram' | 'grams' | 't' | 'ton' | 'tonne' | 'tonnes' | 'tons' | 'lb' | 'lbs' | 'pound' | 'pounds' | 'u' | 'atomic units' | 'oz' | 'ounce' | 'ounces' | 'mph' | 'miles per hour' | 'mh' | 'knots' | 'knot' | 'mpg' | 'miles to the gallon' | 'B' | 'byte' | 'W' | 'watt' | 'watts' | 'Wh' | 'watt hour' | 'watt hours' | 'hp' | 'horse power' | 'J' | 'joule' | 'joules' | 'eV' | 'electron volts' | 'V' | 'volt' | 'volts' | 'C' | 'coulomb' | 'Hz' | 'hertz' | 'F' | 'farad' | 'farads' | 'H' | 'henry' | 'henries' | 'T' | 'tesla' | 'teslas' | 'N' | 'newton' | 'newtons' | 'Ω' | 'ohm' | 'ohms' | 'S' | 'siemens' | 'Pa' | 'pascal' | 'pascals' | 'bar' | 'psi' | '°' | 'deg' | 'degree' | 'degrees' | 'Sv' | 'sievert' | 'sieverts' | 'min' | 'minute' | 'minutes' | 'h' | 'hour' | 'hours' | 'd' | 'day' | 'days' | 'weeks' | 'week' | 'months' | 'month' | 'years' | 'y' | 'yr' | 'year' | '€' | 'EUR' | 'euros' | 'euro' | '£' | 'GBP' | 'british pounds' | '₽' | 'RUB' | 'ruble' | 'rubles';
SQUARE : 'square' | 'squared';
CUBIC : 'cubic';

PREFIXEDUNIT : UNITPREFIX WS* NAMEDUNIT;

TINYNUMBER : ('⁺' | '⁻')? ('⁰' | '¹' | '²' | '³' | '⁴' | '⁵' | '⁶' | '⁷' | '⁸' | '⁹')+;

MUL : '*' | '✕' | '✖' | '⨉' | '⨯' | '·' | '∙' | '⋅' | 'times';
DIV : '/' | '÷' | 'divided by';
ADD : '+' | 'plus';
SUB : '-' | 'minus';
POW : '^' | '**';
COMMA : ',';
ASSIGN : '=' | ':' | ':=';
PLEFT : '(';
PRIGHT : ')';

ID : [_a-zA-Z][_a-zA-Z0-9]*;
WS : (' ' | '\t' | '\r' | '\n') -> channel(HIDDEN);
