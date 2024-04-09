import * as grammar from "./grammar";

const tokenTypes = [
  
    //Palabras reservadas
    { regex: /^read/, token: "READ" },
    { regex: /^write/, token: "WRITE" },
    { regex: /^fnc/, token: "FUNCTION" },
    { regex: /^while/, token: "WHILE" },
    { regex: /^switch/, token: "SWITCH" },
    { regex: /^case_/, token: "CASE" },
    { regex: /^exit/, token: "EXIT" },
  
    //Tipos de datos
    { regex: /^bool/, token: "BOOL" },
    { regex: /^float/, token: "FLOAT" },
    { regex: /^int/, token: "INT" },
    { regex: /^string/, token: "STRING" },
  
    // Valores
    { regex: /^true/, token: "BOOLEAN_TRUE" },
    { regex: /^false/, token: "BOOLEAN_FALSE"},
    { regex: /^[a-z][a-z0-9_]*/, token: "IDENTIFIER" },
    { regex: /^[0-9]+(\.[0-9]+)?/, token: "NUMERIC_LITERAL" },
    
    //simbolos
    { regex: /^=/, token: "EQUAL" },
    { regex: /^,/, token: "COMMA" },
    { regex: /^"/, token: "QUOTE" },
    { regex: /^[\(\)]/, token: "PARENTHESIS" }, 
    { regex: /^\{|\}/, token: "BRACKET" },
    { regex: /^\./, token: "DOT" },
    { regex: /^./, token: "UNKNOWN" }, // Token por defecto para caracteres no reconocidos
  ];


function lex(input) {             
    let tokens = [];
    let position = 0;
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }
  
    // ...

  while (input.length > 0) {
  const whitespace = input.match(/^\s+/);
  if (whitespace) {
    position += whitespace[0].length;
    input = input.slice(whitespace[0].length);
  }

  if (input.length === 0) {
    break;
  }

  let match = false;
  for (let tokenType of tokenTypes) {
    const result = input.match(tokenType.regex); // Use match directly
    if (result && result.index === 0) {
      match = true;
      tokens.push({ type: tokenType.token, value: result[0] });
      position += result[0].length;
      input = input.slice(result[0].length);
      break;
    }
  }

  if (!match) {
    const errorToken = input[0];
    tokens.push({ type: "UNKNOWN", value: `Carácter inesperado '${errorToken}' en la posición ${position}.` });
    break;
  }
}


    return tokens;
}


  
export function validateVariableDeclaration(input) {
  console.log("Input before lexing:", input); 
  const tokens = lex(input);
  try {
    console.log("Generated Tokens:", tokens); 
    const result = grammar.parse(input);

    return {
      success: true,
      tokens: tokens,
      result: result
    };
  } catch (error) {
    console.error("Parsing Error:", error); 

    return {
      success: false,
      tokens: tokens,
    };
  }
}

