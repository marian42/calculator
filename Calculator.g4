grammar Calculator;


// Parser rules
statement :
	  name ASSIGN expression									# assignment
	| name '(' name (',' name )* ')' ASSIGN expression 			# functionDefinition
	| expression												# statementExpression
	| 'convert'? expression (CONVERT | 'in' | 'to') unit		# conversion
;

expression :
	  expression POW expression					# exprPower
	| expression TINYNUMBER	unit?				# exprTinyPower
	| expression (DIV | 'divided by') expression # exprDiv
	| expression ('mod' | 'modulo') expression	# exprMod
	| expression (MUL | 'times' | 'of') expression # exprMul
	| (SUB | 'minus') expression				# exprInvert
	| expression (SUB | 'minus') expression		# exprSub
	| expression (ADD | 'plus') expression		# exprAdd
	| number unit?								# exprNumber
	| CURRENCY number							# exprCurrency
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
	| ('square' | 'squared') unit				# unitSquared
	| 'cubic' unit								# unitCubed
	| (PREFIX | UNIT_OR_PREFIX)?
	  (UNIT | UNIT_OR_PREFIX | CURRENCY | 'in')	# unitName
;

number : INT | FLOAT;

name: name_first (name_first | INT)*;

name_first: CHAR | UNIT | PREFIX | UNIT_OR_PREFIX | CHAR | keyword;

keyword: 'in' | 'to' | 'convert' | 'times' | 'of' | 'mod' | 'modulo' | 'divided by' | 'minus' | 'plus' | 'square' | 'squared' | 'cubic';

// Lexer rules

INT : [0-9]+ | '0b' ('0'|'1')+ | '0x' [0-9a-fA-F]+;
FLOAT : [0-9]+ ('.' [0-9]+)? ('e' ('+' | '-')? [0-9]+)?;

PREFIX : 'Y' | 'yotta' | 'Z' | 'zetta' | 'E' | 'exa' | 'P' | 'peta' | 'terra' | 'G' | 'giga' | 'M' | 'mega' | 'k' | 'kilo' | 'h' | 'hecto' | 'd' | 'deci' | 'c' | 'centi' | 'milli' | 'µ' | 'micro' | 'n' | 'nano' | 'p' | 'pico' | 'f' | 'femto' | 'atto' | 'z' | 'zepto' | 'yocto';
UNIT_OR_PREFIX : 'T' | 'm' | 'a' | 'y';
CURRENCY : '$' | 'USD' | '€' | 'EUR' | '£' | 'GBP' | '₽' | 'RUB';
UNIT : 'meter' | 'mtr' | 'meters' | 'g' | 'gram' | 'grams' | 's' | 'second' | 'seconds' | 'A' | 'ampere' | 'amperes' | 'ampère' | 'ampères' | 'K' | 'kelvin' | 'kelvins' | '°F' | 'fahrenheit' | 'degrees fahrenheit' | '°C' | 'celsius' | 'degrees celsius' | 'mol' | 'mole' | 'moles' | 'cd' | 'candela' | 'candelas' | '%' | 'percent' | 'rad' | 'radian' | 'radians' | 'bit' | 'b' | 'bits' | 'dollar' | 'dollars' | 'miles' | 'mile' | 'nautical mile' | 'nautical miles' | 'inch' | 'inches' | '"' | 'ft' | 'foot' | 'feet' | '\'' | 'yard' | 'yards' | 'AU' | 'astronomical unit' | 'ly' | 'Ly' | 'light year' | 'pc' | 'parsec' | 'parsecs' | 'Å' | 'angstrom' | 'angstroms' | 'micron' | 'acre' | 'acres' | 'ha' | 'hectare' | 'hectares' | 'L' | 'liter' | 'liters' | 'litre' | 'litres' | 'gal' | 'gallon' | 'gallons' | 'fluid ounce' | 'fl oz' | 'g' | 'gram' | 'grams' | 't' | 'ton' | 'tonne' | 'tonnes' | 'tons' | 'lb' | 'lbs' | 'pound' | 'pounds' | 'u' | 'atomic units' | 'oz' | 'ounce' | 'ounces' | 'mph' | 'miles per hour' | 'mh' | 'knots' | 'knot' | 'mpg' | 'miles to the gallon' | 'B' | 'byte' | 'W' | 'watt' | 'watts' | 'Wh' | 'watt hour' | 'watt hours' | 'hp' | 'horse power' | 'J' | 'joule' | 'joules' | 'eV' | 'electron volts' | 'V' | 'volt' | 'volts' | 'C' | 'coulomb' | 'Hz' | 'hertz' | 'F' | 'farad' | 'farads' | 'H' | 'henry' | 'henries' | 'T' | 'tesla' | 'teslas' | 'N' | 'newton' | 'newtons' | 'Ω' | 'ohm' | 'ohms' | 'S' | 'siemens' | 'Pa' | 'pascal' | 'pascals' | 'bar' | 'psi' | '°' | 'deg' | 'degree' | 'degrees' | 'Sv' | 'sievert' | 'sieverts' | 'min' | 'minute' | 'minutes' | 'h' | 'hour' | 'hours' | 'd' | 'day' | 'days' | 'weeks' | 'week' | 'months' | 'month' | 'years' | 'y' | 'yr' | 'year' | 'euros' | 'euro' | 'british pounds' | 'ruble' | 'rubles';

TINYNUMBER : ('⁺' | '⁻')? ('⁰' | '¹' | '²' | '³' | '⁴' | '⁵' | '⁶' | '⁷' | '⁸' | '⁹')+;

MUL : '*' | '✕' | '✖' | '⨉' | '⨯' | '·' | '∙' | '⋅';
DIV : '/' | '÷';
ADD : '+';
SUB : '-';
POW : '^' | '**';
COMMA : ',';
ASSIGN : '=' | ':' | ':=';
PLEFT : '(';
PRIGHT : ')';
CONVERT : '->' | '→' | '➞';

CHAR : [_a-zA-Z];
WS : (' ' | '\t' | '\r' | '\n')+ -> channel(HIDDEN);
