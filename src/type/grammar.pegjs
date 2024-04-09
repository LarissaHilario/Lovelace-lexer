// grammar.pegjs
Start
  = Program

Program
  = Statement*

Statement
  = Declaration
  / Read
  / Write
  / Function
  / Switch
  / While

Declaration 
= "int" _ Identifier _ ("=" _ Integer)? _ ("," DeclarationInt)*
/ "float" _ Identifier _ ("=" _ Integer.Integer)? _ ("," DeclarationFloat)*
/ "string" _ Identifier _ ("=" _ Message )? _ ("," DeclarationString)*
/ "bool" _ Identifier _ ("=" _ Value)? _ ("," DeclarationBool)*

DeclarationInt = _ Identifier _ ("=" _ Integer)?
DeclarationFloat = _ Identifier _ ("=" _ Integer.Integer)?
DeclarationString = _ Identifier _ ("=" _ Message )?
DeclarationBool = _ Identifier _ ("=" _ Value )?

Read = Identifier."read"
Write = "(" Identifier ")" "." "write"
/ "(" _ Message _ ")" "." "write"

Function =  "fnc" _ Identifier _ "(" _ Parameters? _ ")" _ "{" _ Statement _ "}"
Switch = "switch" _ "(" _ Identifier _ ")" _ "{"_ Case+ _ "exit" _ "}"
While = "while" _ "(" _ Condition _ ")" _ "{" _ Statement _ "exit" _ "}"

Condition = Identifier _ "==" _ Value


Case = "case_" Identifier _ "(" _ Statement _ ")" _

Parameters = Identifier ( _ "," _ Identifier _ )*

Identifier = [a-z][a-z0-9_]*
Value = "true"
/ "false"

Message = '"' chars:([^"]*) '"' { return chars.join(""); }

Integer = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

_ "espacio" = [ \t\n\r]* { return null; }