import { Component } from '@angular/core';
// Imports para el parser
import { Instruction } from "./parser/Abstract/Instruction";
import { Environment } from "./parser/Symbol/Environment";
import { errores } from './parser/Errores';
import { Error_ } from "./parser/Error";
import { Function } from "./parser/Instruction/Function";
// Imports para los reportes
import { Plotter } from "./parser/Report/plotter";
import { Table } from "./parser/Report/Table";
// Import para las alertas
import Swal from 'sweetalert2'
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
  env: any;

  // Iconos
  faCoffee = faCoffee;
  faPencilRuler = faPencilRuler;
  faGlobe = faGlobe;
  faFileAlt = faFileAlt;
  faLanguage = faLanguage;
  faEraser = faEraser;

  // Metodos
  ejecutar() {
    this.salida = '[Xvimnt201700831]MatrioshTS Output: \n\n';
    try {
      this.ast = parser.parse(this.entrada.toString());
      this.env = new Environment(null);

      for (const instr of this.ast) {
        try {
          if (instr instanceof Function)
            instr.execute(this.env);
        } catch (error) {
          errores.push(error);
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
            errores.push(new Error_(actual.line, actual.column, 'Semantico', actual.type + ' fuera de un ciclo'));
          }
          // Muestra el resultado en la pagina
          this.salida += this.env.getResult();
        } catch (error) {
          errores.push(error);
        }
      }
    }
    catch (error) {
      this.salida += error + "\n";
    }
    if (errores.length != 0) {
      this.salida += "Errores de compilacion:\n";
      errores.forEach(error => {
        this.salida += "[Error Semantico] Linea: " + error["linea"] + " Columna: " + error["columna"];
        this.salida += " Descripcion: " + error['mensaje'] + "\n";
      });
    }
  }

  printAst() {
    if (this.ast == null) {
      Swal.fire({
        title: 'Oops...',
        text: 'No se ha analizado el codigo aun',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(59, 59, 61)'
      })
      return;
    }
    const plotter = new Plotter();
    const dot = plotter.makeDot(this.ast);

    console.log(dot);
  }

  tokenTable() {
    if (this.ast == null) {
      Swal.fire({
        title: 'Oops...',
        text: 'No se ha analizado el codigo aun',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(59, 59, 61)'
      })
      return;
    }

    Swal.fire({
      title: 'Tabla de Simbolos',
      html: new Table().symbols(this.env),
      confirmButtonText: 'Entendido',
      confirmButtonColor: 'rgb(59, 59, 61)'
    })
  }

  errorTable() {
    if (this.ast == null) {
      Swal.fire({
        title: 'Oops...',
        text: 'No se ha analizado el codigo aun',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(59, 59, 61)'
      })
    }
    else if (errores.length == 0) {
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
        html: new Table().errors(errores),
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(59, 59, 61)'
      })
    }
  }
}