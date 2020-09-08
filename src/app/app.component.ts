import { Component } from '@angular/core';
// Imports para el parser
import { Instruction } from "./parser/Abstract/Instruction";
import { Environment } from "./parser/Symbol/Environment";
import { errores } from './parser/Errores';
import { Error_ } from "./parser/Error";
import { Function } from "./parser/Instruction/Function";
import { Plotter } from "./parser/Tools/plotter";
// Imports para los iconos
import { faCoffee, faPencilRuler, faGlobe } from '@fortawesome/free-solid-svg-icons';

declare var require: any
const parser = require('./parser/Grammar/Grammar');
// cd src/app/parser/Grammar

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Variables
  title = 'olc2web';
  entrada = 'print("Hello World");';
  salida = '[Xvimnt201700831]MatrioshTS Output: \n\n';
  ast: any;

  // Iconos
  faCoffee = faCoffee;
  faPencilRuler = faPencilRuler;
  faGlobe = faGlobe;

  // Metodos
  ejecutar() {
    this.salida = '[Xvimnt201700831]MatrioshTS Output: \n\n';
    try {
      this.ast = parser.parse(this.entrada.toString());
      const env = new Environment(null);

      for (const instr of this.ast) {
        try {
          if (instr instanceof Function)
            instr.execute(env);
        } catch (error) {
          errores.push(error);
        }
      }

      for (const instr of this.ast) {
        if (instr instanceof Function)
          continue;
        try {
          env.cleanResult();
          const actual = instr.execute(env);
          // TODO Arreglar el mensaje del Break en el default
          if (actual != null || actual != undefined) {
            errores.push(new Error_(actual.line, actual.column, 'Semantico', actual.type + ' fuera de un ciclo'));
          }
          // Muestra el resultado en la pagina
          this.salida += env.getResult();
        } catch (error) {
          errores.push(error);
        }
      }
    }
    catch (error) {
      this.salida += error + "\n";
    }
    if(errores.length != 0)
    {
      this.salida += "Errores de compilacion:\n";
      errores.forEach(error => {
        this.salida += "[Error Semantico] Linea: " + error["linea"] + " Columna: " + error["columna"];
        this.salida += " Descripcion: " + error['mensaje'] + "\n";
      });
    }
  }

  printAst() {
    const plotter = new Plotter();
    const dot = plotter.makeDot(this.ast);
    console.log(dot);
  }

}