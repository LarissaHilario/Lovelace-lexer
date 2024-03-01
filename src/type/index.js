import * as grammar from "./grammar";
import { lex } from "./lexer";

export function validateVariableDeclaration(input) {
  const tokens = lex(input);

  try {
    const result = grammar.parse(input);

    return {
      success: true,
      message: 'Cadena válida',
      tokens: tokens,
      result: result
    };
  } catch (error) {

    return {
      success: false,
      message: `Error al analizar la cadena de texto: ${error.message}`,
      tokens: tokens,
    };
  }
}
