import React, { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import logo from "../assets/logo-love.png"
import {
  validateVariableDeclaration
} from "../type/index.js"; 

import { validateSemantic } from "../type/pruebaindex.js";

import { validateGrammar } from "../type/sintactico.js";

export default function CodeEditor() {
  const [validationResult, setValidationResult] = useState(null);
  const [validationGrammar, setValidationGrammar] = useState()
  const [validationSemantic, setValidationSemantic] = useState()

  const onChange = useCallback((value) => {
    const result = validateVariableDeclaration(value);
    const grammar = validateGrammar(value)
    const semantic = validateSemantic(value)
    setValidationResult(result);   
    setValidationGrammar(grammar); 
    setValidationSemantic(semantic)  
  }, []);            
  
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="lg:text-left max-w-max mb-[1000px] h-[600px] ">
          <CodeMirror
            value=""
            height="400px"
            width="600px"
            theme="dark"
            onChange={onChange}
            className="py-2"
          />
          {validationResult &&  validationGrammar && validationSemantic &&(
          <div>
            <div className="bg-red-100 text-purple-500 p-4 mt-4">
              {validationGrammar.message}
            </div>
            {validationResult.tokens && Array.isArray(validationGrammar.tokens) && (
              <div>
                <div className="bg-red-100 text-black p-4 mt-14">
                  <p>Tokens Generados:</p>
                  <ul>
                    {validationResult.tokens.map((token, index) => (
                      <li key={index}>{`${index + 1}: ${token.type} (${token.value})`}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <h2 className="text-xl font-semibold text-default p-2">Código Compilado</h2>
                <div className="mockup-code">
              
               <code><pre data-prefix=">" className="text-primary">{validationSemantic.message}</pre></code>
              </div>
            <div className="bg-red-100 text-purple-500 p-4 mt-4">
              {validationSemantic.result}
            </div>

          </div>
        )}

        </div>

        <div>
          
            <div className="w-24 rounded">
              <img src={logo}/>
              <h1 className="text-5xl font-bold text-primary">Lovelace</h1>
            </div>
        
          <p className="py-6">Lovelace es un nuevo lenguaje de programación. Guía de inicio</p>
          <h2 className="text-xl font-semibold text-default p-2">Declarar variables</h2>
          <p className="p-2">Los tipos de variables son los siguientes:
            <ul>
              <li>
                • int
              </li>
              <li>
                • float
              </li>
              <li>
                • string
              </li>
              <li>
                • bool
              </li>
            </ul>
            Escribe primero el tipo de dato y luego el nombre de la variable</p>
          <div className="mockup-code w-12">
            <pre data-prefix="1"><code>int numeros</code></pre>
            <pre data-prefix="2"><code>int numeros_numeros</code></pre>
            <pre data-prefix="3"><code>int numeros1</code></pre>
            <pre data-prefix="4"><code>int numeros_numeros12</code></pre>
            <pre data-prefix="5"><code>int numeros_1</code></pre>
          </div>


          <h2 className="text-xl font-semibold text-default p-2">Inicializar variables</h2>
          <p className="p-2">Para inicializar las variables se tienen dos formas, hacerlo cuando se declaran o bien, despues, para cada tipo de variable son distintos valores validos:
            </p>
          <div className="mockup-code">
            <pre data-prefix="1"><code>int numeros = 2</code></pre>
            <pre data-prefix="2"><code>int numeros_numeros = 20</code></pre>
            <pre data-prefix="3"><code>float datos = 2.1</code></pre>
            <pre data-prefix="4"><code>string data = "valor nuevo"</code></pre>
            <pre data-prefix="5"><code>bool sentencia = true</code></pre>
            <pre data-prefix="7"><code>variable = "valor"</code></pre>
            <pre data-prefix="8"><code>int a , q = 10</code></pre>
          </div>

    

          <h2 className="text-xl font-semibold text-default p-2">Escribir un mensaje</h2>
          <p className="p-2">Para escribir un mensaje tenemos dos opciones, que el mensaje sea propio, o bien, sea una variable, la manera de hacerlo es la siguiente:
          no se permite agregar símbolos</p>
          <div className="mockup-code w-12">
            <pre data-prefix="1"><code>(variable).write</code></pre>
            <pre data-prefix="2"><code>("mensaje").write</code></pre>
          </div>

          <h2 className="text-xl font-semibold text-default p-2">Declarar una función</h2>
          <div className="mockup-code">
            <pre data-prefix="1"><code>fnc variable (){ "{ (variable).write }"}</code></pre>
            <pre data-prefix="2"><code>fnc variable (){ '{ ("mensaje").write }' }</code></pre>
          
            <pre data-prefix="3"><code> fnc variable (variable){ "{ (variable).write }" }</code></pre>
            <pre data-prefix="4"><code>fnc variable (variable , variable){ '{ ("mensaje").write }' }</code></pre>
          
          </div>

          <h2 className="text-xl font-semibold text-default p-2">Uso del switch </h2>
          <div className="mockup-code">
            <pre data-prefix="1"><code>switch (as){ "{ case_a( (variable).write ) exit }"}</code></pre>
            <pre data-prefix="2"><code>switch (as){ "{ case_a( (variable).write ) case_a( (variable).write ) exit }" }</code></pre>
          </div>

          <h2 className="text-xl font-semibold text-default p-2">Uso del while </h2>
          <div className="mockup-code">
            <pre data-prefix="1"><code>while (a_2 == false){"{ (variable).write exit }" }</code></pre>
          </div>

        </div>
      </div>
    </div>
  );
}          