Start
  = Program

Program
  = Statement*

Statement
  = Declaration
  /Read
  /Write
  /While
  /Function
  /Switch

Declaration
  = IntDeclaration
  / StringDeclaration
  / BoolDeclaration
  / FloatDeclaration


IntDeclaration
  = "int" _ decl:DeclarationInt _  {
      return decl;
    }

StringDeclaration
  = "string" _ decl:DeclarationString _  {
      return decl;
    }

BoolDeclaration
  = "bool" _ decl:DeclarationBool _ {
      return decl;
    }

FloatDeclaration
  = "float" _ decl:DeclarationFloat _ {
      return decl;
    }

DeclarationInt
  = head:IntVarDecl tail:(_ "," _ IntVarDecl)* {
      return {
        type: "DeclarationInt",
        variables: [head, ...tail.map(item => item[3])]
      };
    }

DeclarationString
  = head:StringVarDecl tail:(_ "," _ StringVarDecl)* {
      return {
        type: "DeclarationString",
        variables: [head, ...tail.map(item => item[3])]
      };
    }

DeclarationBool
  = head:BoolVarDecl tail:(_ "," _ BoolVarDecl)* {
      return {
        type: "DeclarationBool",
        variables: [head, ...tail.map(item => item[3])]
      };
    }

DeclarationFloat
  = head:FloatVarDecl tail:(_ "," _ FloatVarDecl)* {
      return {
        type: "DeclarationFloat",
        variables: [head, ...tail.map(item => item[3])]
      };
    }

IntVarDecl
  = id:Identifier _ "=" _ val:Integer {
      return { identifier: id, value: val, initialized: true };
    }
  / id:Identifier {
      return { identifier: id, initialized: false };
    }

StringVarDecl
  = id:Identifier _ "=" _ val:Message {
      return { identifier: id, value: val, initialized: true };
    }
  / id:Identifier {
      return { identifier: id, initialized: false };
    }

BoolVarDecl
  = id:Identifier _ "=" _ val:Value {
      return { identifier: id, value: val, initialized: true };
    }
  / id:Identifier {
      return { identifier: id, initialized: false };
    }

FloatVarDecl
  = id:Identifier _ "=" _ val:Float {
      return { identifier: id, value: val, initialized: true };
    }
  / id:Identifier {
      return { identifier: id, initialized: false };
    }

Read
  = variable:Identifier ".read" _ {
      return {
        type: "Read",
        variable: variable
      };
    }

Write
  = "(" variable:Identifier ")" "." "write" _ {
      return {
        type: "WriteVariable",
        variable: variable
      };
    }
  / "(" _ message:Message _ ")" "." "write" _ {
      return {
        type: "WriteMessage",
        message: message
      };
    }

While
  = "while" _ "(" _ condition:Condition _ ")" _ "{" _ body:Statement+ _ "exit" _ "}" _ {
      return {
        type: "While",
        condition: condition,
        body: body
      };
    }

Condition
  = variable:Identifier _ "==" _ value:Value {
      return {
        type: "Condition",
        variable: variable,
        value: value
      };
    }

Function
  = "fnc" _ id:Identifier _ "(" _ ")" _ "{" _ body:Statement+ _ "}" _ {
      return {
        type: "Function",
        identifier: id,
        body: body
      };
    }

Switch 
  = "switch" _ "(" _ variable:Identifier _ ")" _ "{" _ cases:CaseBlock+ _ "exit" _ "}" {
      return {
        type: "Switch",
        variable: variable,
        cases: cases
      };
  }

CaseBlock
  = case_:Cases _ "(" _ body:Statement+ _ ")" _ {
      return {
        case: case_,
        body: body
      };
  }

Cases
  = "case_" _ value:Val {
      return {
        type: "Cases",
        value: value
      };
  }

Val
  = [a-z0-9]* { return text(); }

Parameters
  = head:Identifier tail:(_ "," _ Identifier)* {
      return [head, ...tail.map(item => item[3])];
    }

Identifier
  = [a-z][a-z0-9_]* { return text(); }

Integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

Float
  = digits:[0-9]+ "." [0-9]+ { return parseFloat(text()); }

Message
  = '"' chars:([^"]*) '"' { return chars.join(""); }

Value
  = "true" { return { type: "BoolValue", value: true }; }
  / "false" { return { type: "BoolValue", value: false }; }

_ "whitespace"
  = [ \t\n\r]*
