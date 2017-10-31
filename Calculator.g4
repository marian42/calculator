grammar Calculator;


// Parser rules
statement :
	expression									# statementExpression
	| ID ASSIGN expression						# assignment
;

expression :
	  expression POW expression					# exprPower
	| expression TINYNUMBER						# exprTinyPower
	| expression op=(MUL | DIV) expression		# exprMulDiv
	| SUB expression							# exprInvert
	| expression op=(ADD | SUB) expression		# exprAddSub
	| number									# exprNumber
	| '(' expression ')'						# exprParentheses
	| ID '(' (expression (',' expression)*)? ')'# exprFunctioncall
	| ID										# exprVariable
;

number : NUM;

// Lexer rules

fragment INT : [0-9]+ | '0b' ('0'|'1')+ | '0x' [0-9a-fA-F]+;
fragment FLOAT : [0-9]+ ('.' [0-9]+)? ('e' ('+' | '-')? [0-9]+)?;
NUM : INT | FLOAT;

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
