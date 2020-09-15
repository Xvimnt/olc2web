 
%{
    const {Arithmetic, ArithmeticOption} = require('../Expression/Arithmetic');
    const {Relational, RelationalOption} = require('../Expression/Relational');
    const {Logic, LogicOption} = require('../Expression/Logic');
    const {Unary, UnaryOption} = require('../Expression/Unary');
    const {Access} = require('../Expression/Access');
    const {Literal} = require('../Expression/Literal');
    const {Operation, OperationOption} = require('../Instruction/Operation');
    const {If} = require('../Instruction/If');
    const {Switch} = require('../Instruction/Switch');
    const {Print} = require('../Instruction/Print');
    const {Statement} = require('../Instruction/Statement');
    const {For} = require('../Instruction/For');
    const {Foreach} = require('../Instruction/Foreach');
    const {While} = require('../Instruction/While');
    const {DoWhile} = require('../Instruction/DoWhile');
    const {Declaration} = require('../Instruction/Declaration');
    const {Assignation} = require('../Instruction/Assignation');
    const {Break} = require('../Instruction/Break');
    const {Continue} = require('../Instruction/Continue');
    const {Return} = require('../Instruction/Return');
    const {Call} = require('../Instruction/Call');
    const {Function} = require('../Instruction/Function');
    const { Error_ } = require('../Error');
%}

%lex
%options case-sensitive
number  [0-9]+
decimal [0-9]+("."[0-9]+)?
string  ([\"][^"]*[\"])
string2  ([\'][^\']*[\'])
%%
\s+                   /* skip whitespace */
"//".*                                /* IGNORE */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]   /* IGNORE */

{decimal}               return 'DECIMAL'
{number}                return 'NUMBER'
{string}                return 'STRING'
{string2}               return 'STRING'
"true"                  return 'BOOL'
"false"                 return 'BOOL'
"*"                     return '*'
"/"                     return '/'
":"                     return ':'
";"                     return ';'
","                     return ','
"-"                     return '-'
"+"                     return '+'
"^"                     return '^'
"%"                     return '%'

"<"                   return '<'
">"                   return '>'
"<="                  return '<='
">="                  return '>='
"=="                  return '=='
"!="                  return '!='
"OR"                  return 'OR'
"AND"                 return 'AND'
"!"                   return '!'
"="                   return '='

"("                     return '('
")"                     return ')' 
"{"                     return '{'
"}"                     return '}'
"if"                    return 'IF'
"else"                  return 'ELSE'
"switch"                return 'SWITCH'
"case"                  return 'CASE'
"default"               return 'DEFAULT'
"while"                 return 'WHILE'
"do"                    return 'DO'
"for"                   return 'FOR'
"console.log"           return 'PRINT'
"break"                 return 'BREAK'
"return"                return 'RETURN'
"continue"              return 'CONTINUE'
"function"              return 'FUNCTION'

"string"                return 'STYPE'
"number"                return 'NTYPE'
"boolean"               return 'BTYPE'
"void"                  return 'VTYPE'
"type"                 return 'TTYPE'
"let"                   return 'LET'
"const"                 return 'CONST'

"push"                   return 'PUSH'
"pop"                    return 'POP'
"length"                 return 'LENGTH'

([a-zA-Z_])[a-zA-Z0-9_ñÑ]*	return 'ID';
<<EOF>>		                return 'EOF'
.                           throw new Error_(yylloc.first_line, yylloc.first_column, 'Lexico','Valor inesperado ' + yytext);  


/lex

%left 'OR'
%left 'AND'
%left '==', '!='
%left '>=', '<=', '<', '>'
%left '+' '-'
%left '*' '/' '%'
%left '^'


%start Init

%%

Init    
    : Instructions EOF 
    {
        return $1;
    } 
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
    : IfSt {
        $$ = $1;
    }
    | WhileSt {
        $$ = $1;
    }
    | DoWhileSt {
        $$ = $1;
    }
    | ForSt {
        $$ = $1;
    }
    | SwitchSt {
        $$ = $1;
    }
    | Statement {
        $$ = $1;
    }
    | PrintSt {
        $$ = $1;
    }
    | Declaration ';' {
        $$ = $1;
    } 
    | Assignation ';' {
        $$ = $1;
    } 
    | Operation ';' {
        $$ = $1;
    }
    | 'BREAK' ';'{
        $$ = new Break(@1.first_line, @1.first_column);
    }
    | 'CONTINUE' ';'{
        $$ = new Continue(@1.first_line, @1.first_column);
    }
    | 'RETURN' ';'{
        $$ = new Return(@1.first_line, @1.first_column);
    }
    | FunctionSt {
        $$ = $1;
    }
    | Call ';' {
        $$ = $1;
    }
;

Call
    : ID '(' ')' {
        $$ = new Call($1, [], @1.first_line, @1.first_column);
    }
    | ID '(' ListaExpr ')' {
        $$ = new Call($1, $3, @1.first_line, @1.first_column);
    }
;

ListaExpr 
    : ListaExpr ',' Expr{
        $1.push($3);
        $$ = $1;
    }
    | Expr{
        $$ = [$1];
    }
;    

FunctionSt 
    : 'FUNCTION' ID '(' ')' Statement {
        $$ = new Function($2, $5, [], @1.first_line, @1.first_column);
    }
    | 'FUNCTION' ID '(' Parametros ')' Statement {
        $$ = new Function($2, $6, $4, @1.first_line, @1.first_column);
    }
;

Parametros
    : Parametros ',' ID ':' Type {
        $1.push($3);
        $$ = $1;
    }
    | ID ':' Type{
        $$ = [$1];
    }
;

Declaration 
    : Reserved Type ID '=' Expr {
        $$ = new Declaration($1, $2, $3, $5, @1.first_line, @1.first_column);
    }
    | Reserved Type ID {
        $$ = new Declaration($1, $2, $3, null, @1.first_line, @1.first_column);
    }
    | Reserved ID '=' Expr {
        $$ = new Declaration($1, null, $2, $4, @1.first_line, @1.first_column);
    }
;


Assignation 
    : ID '=' Expr {
        $$ = new Assignation($1, $3, @1.first_line, @1.first_column);
    }
;

Reserved
    : LET { $$ = new Literal($1, @1.first_line, @1.first_column, 5); }
    | CONST { $$ = new Literal($1, @1.first_line, @1.first_column, 5); }
;

Type 
    : STYPE { $$ = new Literal($1, @1.first_line, @1.first_column, 5); }
    | NTYPE { $$ = new Literal($1, @1.first_line, @1.first_column, 5); }
    | BTYPE { $$ = new Literal($1, @1.first_line, @1.first_column, 5); }
    | VTYPE { $$ = new Literal($1, @1.first_line, @1.first_column, 5); }
    | TTYPE { $$ = new Literal($1, @1.first_line, @1.first_column, 5); }
    | ID { $$ = new Literal($1, @1.first_line, @1.first_column, 5); }
;

IfSt
    : 'IF' '(' Expr ')' Statement ElseSt{
        $$ = new If($3, $5, $6, @1.first_line, @1.first_column);
    }
;

ElseSt
    : 'ELSE' Statement {
        $$ = $2;
    }
    | 'ELSE' IfSt {
        $$ = $2;
    }
    | /* epsilon */
    {
        $$ = null;
    }
;


SwitchSt
    : 'SWITCH' '(' Expr ')' '{' Cases DefaultSt '}' {
        $$ = new Switch($3, $6, $7, @1.first_line, @1.first_column);
    }
    | 'SWITCH' '(' Expr ')' '{' DefaultSt '}' {
        $$ = new Switch($3, null, $6, @1.first_line, @1.first_column);
    }
;

Cases
    : Cases CaseSt
    {
        $1.push($2);
        $$ = $1;
    }
    | CaseSt
    {
        $$ = [$1];
    }
;

CaseSt 
    : 'CASE' Expr ':' Instructions
    {
        $$ = {condicion: $2, instruccion: $4};
    }
    | 'CASE' Expr ':'
    {
        $$ = {condicion: $2, instruccion: null};
    }
;

DefaultSt
    : 'DEFAULT' ':' Instructions {
        $$ = new Statement($3, @1.first_line, @1.first_column);
    }
    | 'DEFAULT' ':' {
        $$ = null;
    }
    | /* epsilon */
    {
        $$ = null;
    }
;

ForSt
    : 'FOR' '(' Declaration ';' Expr ';' Operation ')' Statement {
        $$ = new For($3, $5, $7, $9, @1.first_line, @1.first_column);
    }
    | 'FOR' '(' ID ';' Expr ';' Operation ')' Statement {
        $$ = new For($3, $5, $7, $9, @1.first_line, @1.first_column);
    }
    | 'FOR' '(' ID 'IN' ID ')' Statement {
        $$ = new Foreach($3, $5, $7, @1.first_line, @1.first_column);
    }
;

WhileSt
    : 'WHILE' '(' Expr ')' Statement{
        $$ = new While($3, $5, @1.first_line, @1.first_column);
    }
;

DoWhileSt
    : 'DO' Statement 'WHILE' '(' Expr ')' ';' {
        $$ = new DoWhile($2, $5, @1.first_line, @1.first_column);
    }
;

Statement
    : '{' Instructions '}' {
        $$ = new Statement($2, @1.first_line, @1.first_column);
    }
    | '{' '}' {
        $$ = new Statement(new Array(), @1.first_line, @1.first_column);
    }
;

PrintSt 
    : 'PRINT' '(' Expr ')' ';' {
        $$ = new Print($3, @1.first_line, @1.first_column);
    }
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
    | Expr '^' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.POWER, @1.first_line,@1.first_column);
    }
    | Expr '%' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.MOD, @1.first_line,@1.first_column);
    }
    | Expr '<' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.LESS, @1.first_line, @1.first_column);
    }
    | Expr '<=' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.LESSOREQUAL ,@1.first_line, @1.first_column);
    }
    | Expr '>' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.GREATER ,@1.first_line, @1.first_column);
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
    | Expr 'AND' Expr
    {
        $$ = new Logic($1, $3,LogicOption.AND ,@1.first_line, @1.first_column);
    }
    | Expr 'OR' Expr
    {
        $$ = new Logic($1, $3,LogicOption.OR ,@1.first_line, @1.first_column);
    }
    | Unary
    {
        $$ = $1;
    }
;

Operation 
        : ID '+' '+' 
        {
            $$ = new Operation($1, OperationOption.INCREMENT, @1.first_line,@1.first_column);
        }
        | ID '-' '-' 
        {
            $$ = new Operation($1, OperationOption.DECREMENT, @1.first_line,@1.first_column);
        }
;

Unary
    : '!' F
    {
        $$ = new Unary($2, UnaryOption.NEGATION, @1.first_line, @1.first_column,0);
    }
    | '-' F
    {
        $$ = new Unary($2, UnaryOption.MINUS, @1.first_line, @1.first_column,0);
    }
    | F
    {
        $$ = $1;
    }
;

F   : '(' Expr ')'
    { 
        $$ = $2;
    }
    | DECIMAL
    { 
        $$ = new Literal($1, @1.first_line, @1.first_column, 0);
    }
    | NUMBER
    { 
        $$ = new Literal($1, @1.first_line, @1.first_column, 0);
    }
    | STRING
    {
        $$ = new Literal($1, @1.first_line, @1.first_column, 1);
    }
    | BOOL
    {
        $$ = new Literal($1, @1.first_line, @1.first_column, 2);
    }
    | ID
    {
        $$ = new Access($1, @1.first_line, @1.first_column);
    }
;