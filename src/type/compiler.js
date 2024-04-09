export function compile(ast, variablesStatus) {
    let compiledCode = "";

    const compileCondition = (condition) => {
        let value = condition.value.type === "BoolValue" ? condition.value.value : condition.value;
        let operator = "==="; 
    
        return `${condition.variable} ${operator} ${value}`;
    };

    ast.forEach(node => {
        if (node.type.startsWith("Declaration")) {
            node.variables.forEach(varDecl => {
                let varInit = `let ${varDecl.identifier}`;
                let type = node.type.replace("Declaration", "").toLowerCase(); 
                variablesStatus[varDecl.identifier] = { type: type, value: varDecl.initialized ? varDecl.value : undefined };

                if (varDecl.initialized) {
                    let value = varDecl.value;
                    if (typeof value === "object" && value.type === "BoolValue") {
                        value = value.value;
                    } else if (typeof value === "string") {
                        value = `"${value}"`;
                    }
                    varInit += ` = ${value}`;
                }
                compiledCode += `${varInit};\n`;
            }); 
        } else if (node.type === "WriteVariable") {
            const varStatus = variablesStatus[node.variable];
            if (varStatus && varStatus.initialized) {
                let valueToPrint = varStatus.value;
                if (typeof valueToPrint === "object" && valueToPrint.type === "BoolValue") {
                    valueToPrint = valueToPrint.value;
                } 
                else if (typeof valueToPrint === "string") {
                    valueToPrint = `"${valueToPrint}"`;
                }
                compiledCode += `console.log(${valueToPrint});\n`;
            } else {
                compiledCode += `console.log(${node.variable});\n`;
            }
        } else if (node.type === "WriteMessage") {
            let message = `"${node.message}"`;
            compiledCode += `console.log(${message});\n`;
        } else if (node.type === "While") {
            const conditionCode = compileCondition(node.condition);
            compiledCode += `while (${conditionCode}) {\n`;
            const bodyNodes = Array.isArray(node.body) ? node.body : [node.body];
            bodyNodes.forEach(innerNode => {
                compiledCode += `  ${compile([innerNode], variablesStatus)}`; 
            });
            if (node.condition.value.type === "BoolValue") {
                let newValue = node.condition.value.value ? "false" : "true";
                compiledCode += `  ${node.condition.variable} = ${newValue};\n`;
            } else {
                compiledCode += `  ${node.condition.variable} -= 1;\n`;
            }
            compiledCode += `}\n`;
        } else if (node.type === "Function") {
            compiledCode += `function ${node.identifier}() {\n`;
            if (Array.isArray(node.body)) {
                node.body.forEach(innerNode => {
                    compiledCode += `  ${compile([innerNode], variablesStatus)}\n`;
                });
            } else {
                compiledCode += `  ${compile([node.body], variablesStatus)}\n`; 
            }
            compiledCode += `}\n`;
            compiledCode += `${node.identifier}()\n`;
        }else if (node.type === "Switch") {
            const variableType = variablesStatus[node.variable].type;
            compiledCode += `switch (${node.variable}) {\n`;

            node.cases.forEach(caseBlock => {
                let caseValue = caseBlock.case.value;
                if (variableType === "int" || variableType === "float") {
                    compiledCode += `  case ${caseValue}:\n`;
                } else {
                    compiledCode += `  case "${caseValue}":\n`;
                }
                
                const bodyNodes = Array.isArray(caseBlock.body) ? caseBlock.body : [caseBlock.body];
                bodyNodes.forEach(innerNode => {
                    compiledCode += `    ${compile([innerNode], variablesStatus)};\n`;
                });
                compiledCode += "    break;\n";
            });

            compiledCode += `  default:\n     console.log("no entro en ningun caso"); \n     break;\n`;
            compiledCode += `}\n`;
        }
    });
    return compiledCode;
}


