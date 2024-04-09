export function analyzeSemantics(ast) {
    let errors = [];
    let variablesStatus = new Map(); 
    let functionsStatus = new Map();

    ast.forEach(statement => {
        if (statement.type.startsWith("Declaration")) {
            statement.variables.forEach(varDecl => {
                const variable = varDecl.identifier;
                if (variablesStatus.has(variable)) {
                    errors.push(`Error Semántico: Variable duplicada '${variable}'`);
                } else {
                    variablesStatus.set(variable, { 
                        initialized: varDecl.initialized, 
                        read: false, 
                        type: statement.type.replace("Declaration", "").toLowerCase() 
                    });
                }
            });
        } else if (statement.type === "Read") {
            const variable = statement.variable;
            if (!variablesStatus.has(variable)) {
                errors.push(`Error Semántico: Variable no declarada '${variable}' usada en .read`);
            } else {
                variablesStatus.get(variable).read = true;
            }
        } else if (statement.type === "WriteVariable") {
            const variable = statement.variable;
            const status = variablesStatus.get(variable);
            if (!status) {
                errors.push(`Error Semántico: Variable no declarada '${variable}' usada en .write`);
            } else if (!status.initialized && !status.read) {
                errors.push(`Error Semántico: Variable '${variable}' no inicializada usada en .write`);
            }
        } else if (statement.type === "While") {
            const condition = statement.condition;
            const variableStatus = variablesStatus.get(condition.variable);
            
            if (!variableStatus) {
                errors.push(`Error Semántico: Variable no declarada '${condition.variable}' usada en la condición while`);
            } else {
                if (variableStatus.type !== "bool") {
                    errors.push(`Error Semántico: Variable '${condition.variable}' usada en la condición while no es de tipo bool`);
                } else if (!variableStatus.initialized && !variableStatus.read) {
                    errors.push(`Error Semántico: Variable bool '${condition.variable}' no inicializada usada en la condición while`);
                }
            }
        } else if (statement.type === "Function") {
            const functionName = statement.identifier;
            if (functionsStatus.has(functionName)) {
                errors.push(`Error Semántico: Nombre de función duplicado '${functionName}'`);
            } else {
                functionsStatus.set(functionName, true); 
                
                let localVariables = new Set();
            }
        } else if (statement.type === "Switch") {
            const switchVariable = statement.variable;        
            if (!variablesStatus.has(switchVariable)) {
                errors.push(`Error Semántico: Variable no declarada '${switchVariable}' usada en switch`);
            }
        }
        
    });

    return { errors, variablesStatus };
}
