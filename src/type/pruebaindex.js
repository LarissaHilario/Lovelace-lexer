

import { analyzeSemantics } from "./semantic";

import {compile} from "./compiler"
import {lex} from "./lexer"
import * as parser from "./prueba"

export function validateSemantic(input){
    try {
        const tokens = lex(input);

        console.log("Tokens Generados:");
        tokens.forEach((token, index) => {
            console.log(`${index + 1}: ${token.type} (${token.value})`);
        });
        
        const ast = parser.parse(input);

        const { errors: semanticErrors, variablesStatus } = analyzeSemantics(ast);
        if (semanticErrors.length > 0) {
            let errorMessage = "Errores Semánticos encontrados: ";
            semanticErrors.forEach(error => errorMessage += `${error}\n`)
            return { success: false, message: errorMessage, tokens:tokens };
        } else {
            const compiledCode = compile(ast, variablesStatus);
            let output = captureOutput(() => eval(compiledCode));
            const resultMessage = "Resultado del código:\n" + output;
            return { success: true, message: compiledCode, result: resultMessage, tokens:tokens};
        }
    } catch (error) {
        return { success: false, message: "Error durante el análisis: " + error.message };
    }
}

function captureOutput(callback) {
    const oldLog = console.log;
    let output = [];
    console.log = (message) => {
        output.push(message);
    };

    callback();

    console.log = oldLog; 
    return output.join("\n");
}