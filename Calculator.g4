grammar Calculator;

 
// Parser rules

test : statement;

statement :
	expression
	| assignment;
	
assignment : ID '=' expression;

expression : 
	  expression '^' expression					# exprPower
	| expression op=('*'|'/') expression		# exprMulDiv
	| expression op=('+'|'-') expression		# exprAddSub
	| '-' expression							# exprInvert
	| number									# exprNumber
	| '(' expression ')'						# exprParentheses
	| ID '(' expression (',' expression)* ')'	# exprFunctioncall
	| ID										# exprVariable
;
number : INT | NUM;

// Lexer rules

ID : [_a-zA-Z][_a-zA-Z0-9]*;
INT : [0-9]+ | '0b' ('0'|'1')+ | '0x' [0-9a-fA-F]+;
NUM : ('+' | '-')? [0-9]+ ('.' [0-9]+)? ('e' ('+' | '-')? [0-9]+)?;

MUL : '*';
DIV : '/';
ADD : '+';
SUB : '-';
POW : '^';
COMMA : ',';
ASSIGN : '=';
PLEFT : '(';
PRIGHT : ')';

WS : (' ' | '\t') -> channel(HIDDEN);