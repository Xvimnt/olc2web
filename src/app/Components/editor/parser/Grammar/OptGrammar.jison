 
%{
    const {Arithmetic, ArithmeticOption} = require('../Expression/Arithmetic');
    const {Relational, RelationalOption} = require('../Expression/Relational');
    const {Logic, LogicOption} = require('../Expression/Logic');
    const {Unary, UnaryOption} = require('../Expression/Unary');
    const {Access} = require('../Expression/Access');
    const {Literal} = require('../Expression/Literal');
    // Instrucciones
    const {Operation, OperationOption} = require('../Instruction/Operation');
    const {Print} = require('../Instruction/Print');
    const {Statement} = require('../Instruction/Statement');
    const {Declaration} = require('../Instruction/Declaration');
    const {Assignation} = require('../Instruction/Assignation');
    const {Return} = require('../Instruction/Return');
    const {Call} = require('../Instruction/Call');
    const {Function} = require('../Instruction/Function');
    const {_Array} = require('../Object/Array');
    const { Error_ } = require('../Error');
    const { errores } = require('../Errores');

%}

%lex
%options case-sensitive
number  [0-9]+
decimal [0-9]+("."[0-9]+)?
string  ([\"][^"]*[\"])
string2  ([\'][^\']*[\'])
template [`]([^`])*[`]
%%
\s+                   /* skip whitespace */
"//".*                                /* IGNORE */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]   /* IGNORE */

{decimal}               return 'DECIMAL'
{number}                return 'NUMBER'
{string}                return 'STRING'

"/"                     return '/'
":"                     return ':'
";"                     return ';'
","                     return ','
"."                     return '.'
"-"                     return '-'
"+"                     return '+'
"%"                     return '%'
"?"                     return '?'
"#"                     return '#'

"<="                  return '<='
">="                  return '>='
"<"                   return '<'
">"                   return '>'
"=="                  return '=='
"!="                  return '!='
"||"                  return 'OR'
"&&"                  return '&&'
"!"                   return '!'
"="                   return '='
"null"                return 'NULL'

"("                     return '('
")"                     return ')' 
"{"                     return '{'
"}"                     return '}'
"["                     return '['
"]"                     return ']'
"if"                    return 'IF'
"else"                  return 'ELSE'
"return"                return 'RETURN'
"include"               return 'INCLUDE'
"float"                 return 'FLOAT'
"void"                  return 'VOID'
"goto"                  return 'GOTO'
"printf"                  return 'PRINT'

([a-zA-Z_])[a-zA-Z0-9_ñÑ.]*	return 'ID';
<<EOF>>		                return 'EOF'
.                           errores.push(new Error_(yylloc.first_line, yylloc.first_column, 'Lexico','Valor inesperado ' + yytext));  


/lex

%left '?'
%left 'OR'
%left '&&'
%left '==', '!='
%left '>=', '<=', '<', '>'
%left '+' '-'
%left '*' '/' '%'
%left '^'


%start Init

%%

Init    
    : Includes Declarations Instructions EOF 
    {
        return $3;
    } 
;

Includes
    : '#' 'INCLUDE' '<' ID '>' {}
    | Includes '#' 'INCLUDE' '<' ID '>' {}
;

Instructions
    : Instructions Instruction{
        $1.push($2);
        $$ = $1;
    }
    | Instruction{
        $$ = [$1];
    }
;

Instruction
    : Method {
        $$ = $1;
    }
;


Method 
    : 'VOID' ID '(' ')' '{' Statements '}'
;

Statements
    : Statements Statement
    | Statement
;

Statement 
    : Assignation ';'
    | 'GOTO' ID ';'
    | ID ':'
    | PRINT '(' STRING ',' Expr ')' ';'
    | RETURN ';'
;

Assignation
    :  ID '=' Expr
    | ID '[' F ']' '=' Expr
;

Declarations 
    : Declarations Declaration
    | Declaration
;

Declaration 
    : 'FLOAT' DecList ';'
    | 'FLOAT' ID '[' F ']' ';'
;

DecList
    : ID
    | DecList ',' ID
;

Expr
    : Expr '+' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.PLUS, @1.first_line,@1.first_column);
    }       
    | Expr '-' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.MINUS, @1.first_line,@1.first_column);
    }
    | Expr '*' Expr
    { 
        $$ = new Arithmetic($1, $3, ArithmeticOption.TIMES, @1.first_line,@1.first_column);
    }       
    | Expr '/' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.DIV, @1.first_line,@1.first_column);
    }
    | Expr '%' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.MOD, @1.first_line,@1.first_column);
    }
    | Expr '<=' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.LESSOREQUAL ,@1.first_line, @1.first_column);
    }
    | Expr '>=' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.GREATEROREQUAL ,@1.first_line, @1.first_column);
    }
    | Expr '==' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.EQUAL ,@1.first_line, @1.first_column);
    }
    | Expr '!=' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.NOTEQUAL ,@1.first_line, @1.first_column);
    }
    | Expr '>' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.GREATER ,@1.first_line, @1.first_column);
    }
    | Expr '<' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.LESS, @1.first_line, @1.first_column);
    }
    | F
    {
        $$ = $1;
    }
;

F   : DECIMAL
    { 
        $$ = new Literal($1, @1.first_line, @1.first_column, 0);
    }
    | NUMBER
    { 
        $$ = new Literal($1, @1.first_line, @1.first_column, 0);
    }
    | ID { 
        $$ = $1;
    }
;