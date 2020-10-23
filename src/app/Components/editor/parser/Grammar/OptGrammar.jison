 
%{
    const {Arithmetic, ArithmeticOption} = require('../Expression/Arithmetic');
    const {Relational, RelationalOption} = require('../Expression/Relational');
    const {Logic, LogicOption} = require('../Expression/Logic');
    const {Unary, UnaryOption} = require('../Expression/Unary');
    const {Access} = require('../Expression/Access');
    const {Property} = require('../Expression/Property');
    const {Literal} = require('../Expression/Literal');
    const {Ternary} = require('../Expression/Ternary');
    const {Param} = require('../Expression/Param');
    // Tipos de Objetos
    const {ArrayType} = require('../Types/Array');
    const {_Type} = require('../Types/Type');
    // Instrucciones
    const {Operation, OperationOption} = require('../Instruction/Operation');
    const {If} = require('../Instruction/If');
    const {Switch} = require('../Instruction/Switch');
    const {Case} = require('../Instruction/Case');
    const {Print} = require('../Instruction/Print');
    const {Statement} = require('../Instruction/Statement');
    const {For} = require('../Instruction/For');
    const {ForIn} = require('../Instruction/ForIn');
    const {ForOf} = require('../Instruction/ForOf');
    const {While} = require('../Instruction/While');
    const {DoWhile} = require('../Instruction/DoWhile');
    const {Declaration} = require('../Instruction/Declaration');
    const {Assignation} = require('../Instruction/Assignation');
    const {Break} = require('../Instruction/Break');
    const {Continue} = require('../Instruction/Continue');
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
{string2}               return 'STRING'
{template}              return 'TEMPLATE'
"true"                  return 'BOOL'
"false"                 return 'BOOL'
"**"                    return '^'
"*"                     return '*'
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
"include"              return 'INCLUDE'
"float"              return 'FLOAT'

"string"                return 'STYPE'
"number"                return 'NTYPE'
"boolean"               return 'BTYPE'
"void"                  return 'VTYPE'
"type"                 return 'TTYPE'
"let"                   return 'LET'
"const"                 return 'CONST'

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
    : 'VTYPE' ID '(' ')' '{' Statement '}'
;

Statement 

;

Declarations 
    : Declarations Declaration
    | Declaration
;

Declaration 
    : 'FLOAT' ID ';'
    | 'FLOAT' ID '[' F ']' ';'
;

ExprList
    : ExprList ',' Expr {$1.push($3); $$ = $1;}
    | Expr { $$ = [$1] }
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
    | Expr '&&' Expr
    {
        $$ = new Logic($1, $3,LogicOption.AND ,@1.first_line, @1.first_column);
    }
    | Expr 'OR' Expr
    {
        $$ = new Logic($1, $3,LogicOption.OR ,@1.first_line, @1.first_column);
    }
    | Expr '?' Expr ':' Expr
    {
        $$ = new Ternary($1, $3, $5, @1.first_line, @1.first_column);
    }
    | Unary
    {
        $$ = $1;
    }
    | 'NULL'
    {
        $$ = null;
    }
    | '[' ']'
    {
        $$ = [];
    }
    | '[' ExprList ']'
    {
        $$ = $2;
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
    : '!' Unary
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
    | TEMPLATE
    {
        $$ = new Literal($1, @1.first_line, @1.first_column, 6);
    }
    | BOOL
    {
        $$ = new Literal($1, @1.first_line, @1.first_column, 2);
    }
    | Call
    {
        $$ = $1;
    }
    | Access { 
        $$ = $1;
    }
;

ArrayAccess
    : ArrayAccess '[' Expr ']' { $1.push($3); $$ = $1; }
    | '[' Expr ']' { $$ = [$2] }
;

Access 
    : Access '.' ID {
        $$ = new Property($1, $3, @1.first_line, @1.first_column);
    }
    | Access '.' ID ArrayAccess {
        $$ = new Property($1, $3, @1.first_line, @1.first_column);
    }
    | ID
    {
        $$ = new Access($1, @1.first_line, @1.first_column);
    }
    | ID ArrayAccess
    {
        $$ = new Access([$1,$2], @1.first_line, @1.first_column);
    }
;