import { Component } from '@angular/core';
// Imports para el parser
import { Instruction } from "./parser/Abstract/Instruction";
import { Environment } from "./parser/Symbol/Environment";
import { Error_ } from "./parser/Error";
import { Function } from "./parser/Instruction/Function";
// Imports para los reportes
import { Plotter } from "./parser/Report/plotter";
import { Table } from "./parser/Report/Table";
// Import para las alertas
import Swal from 'sweetalert2'
// Import para las graficas
import { graphviz } from 'd3-graphviz';
import { wasmFolder } from "@hpcc-js/wasm";
// Imports para los iconos
import { faCoffee, faPencilRuler, faGlobe, faFileAlt, faLanguage, faEraser } from '@fortawesome/free-solid-svg-icons';

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
  env: Environment;
  flag: boolean;
  errores: Array<Error_>;

  // Iconos
  faCoffee = faCoffee;
  faPencilRuler = faPencilRuler;
  faGlobe = faGlobe;
  faFileAlt = faFileAlt;
  faLanguage = faLanguage;
  faEraser = faEraser;

  ngOnInit() {
    this.clean();
  }
  // Metodos
  clean() {
    this.ast = null;
    this.env = null;
    this.errores = new Array();
    this.flag = true;
  }

  ejecutar() {
    this.clean();
    this.salida = '[Xvimnt201700831]MatrioshTS Output: \n\n';
    try {
      this.ast = parser.parse(this.entrada.toString());
      this.env = new Environment(null);

      for (const instr of this.ast) {
        try {
          if (instr instanceof Function)
            instr.execute(this.env);
        } catch (error) {
          this.errores.push(error);
        }
      }

      for (const instr of this.ast) {
        if (instr instanceof Function)
          continue;
        try {
          this.env.cleanResult();
          const actual = instr.execute(this.env);
          // TODO Arreglar el mensaje del Break en el default
          if (actual != null || actual != undefined) {
            this.errores.push(new Error_(actual.line, actual.column, 'Semantico', actual.type + ' fuera de un ciclo'));
          }
          // Muestra el resultado en la pagina
          this.salida += this.env.getResult();
        } catch (error) {
          this.errores.push(error);
        }
      }
    }
    catch (error) {
      this.errores.push(error);
    }
    if (this.errores.length != 0) {
      this.salida += "Errores de compilacion:\n";
      this.errores.forEach(error => {
        this.salida += error + "\n";
      });
    }
    this.flag = false;
  }

  printAst() {
    if (this.flag) {
      Swal.fire({
        title: 'Oops...',
        text: 'No se ha analizado el codigo aun',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(59, 59, 61)'
      })
    } else {
      const plotter = new Plotter();
      const dot = plotter.makeDot(this.ast);
      console.log(dot);
      wasmFolder('https://cdn.jsdelivr.net/npm/@hpcc-js/wasm@0.3.13/dist');
      graphviz('#graph').renderDot(dot);
    }
  }

  tokenTable() {
    if (this.flag) {
      Swal.fire({
        title: 'Oops...',
        text: 'No se ha analizado el codigo aun',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(59, 59, 61)'
      })
    }
    else if (this.env.variables.size == 0 && this.env.funciones.size == 0) {
      Swal.fire({
        title: 'Oops...',
        text: 'No se encontro ninguna variable o funcion guardada',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(59, 59, 61)'
      })
    }
    else {
      Swal.fire({
        title: 'Tabla de Simbolos',
        html: new Table().symbols(this.env),
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(59, 59, 61)'
      })
    }
  }

  errorTable() {
    if (this.flag) {
      Swal.fire({
        title: 'Oops...',
        text: 'No se ha analizado el codigo aun',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(59, 59, 61)'
      })
    }
    else if (this.errores.length == 0) {
      Swal.fire({
        title: 'Cool!',
        text: 'No se encontraron errores en su codigo',
        icon: 'success',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(59, 59, 61)'
      })
    }
    else {
      Swal.fire({
        title: 'Tabla de Errores',
        html: new Table().errors(this.errores),
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(59, 59, 61)',
        width: 600
      })
    }
  }
}