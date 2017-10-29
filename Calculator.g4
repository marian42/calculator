grammar Calculator;


// Parser rules
statement :
	expression									# statementExpression
	| ID ('=' | ':') expression					# assignment
;

expression :
	  expression '^' expression					# exprPower
	| expression op=('*'|'/') expression		# exprMulDiv
	| '-' expression							# exprInvert
	| expression op=('+'|'-') expression		# exprAddSub
	| number									# exprNumber
	| '(' expression ')'						# exprParentheses
	| ID '(' (expression (',' expression)*)? ')'# exprFunctioncall
	| ID										# exprVariable
;

number : NUM;

// Lexer rules

ID : [_a-zA-Z][_a-zA-Z0-9]*;
fragment INT : [0-9]+ | '0b' ('0'|'1')+ | '0x' [0-9a-fA-F]+;
fragment FLOAT : [0-9]+ ('.' [0-9]+)? ('e' ('+' | '-')? [0-9]+)?;
NUM : INT | FLOAT;

MUL : '*';
DIV : '/';
ADD : '+';
SUB : '-';
POW : '^';
COMMA : ',';
ASSIGN : '=';
COLON : ':';
PLEFT : '(';
PRIGHT : ')';

WS : (' ' | '\t') -> channel(HIDDEN);
