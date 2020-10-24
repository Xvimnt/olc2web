import { Component, ViewEncapsulation } from '@angular/core';
// Imports para el parser
import { Environment } from "./parser/Symbol/Environment";
import { Function } from "./parser/Instruction/Function";
import { _Console } from "./parser/Util/Salida";

// Imports para los reportes
import { Plotter } from "./parser/Report/plotter";
import { Table } from "./parser/Report/Table";
// Import para el servicio
import { DotService } from "../../services/dot.service"
// Import para las alertas
import Swal from 'sweetalert2'
// Imports para los iconos
import { faCoffee, faPencilRuler, faGlobe, faFileAlt, faLanguage, faEraser, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { errores } from './parser/Errores';
import { isString } from 'util';

declare var require: any
const parser = require('./parser/Grammar/Grammar');
const optimizer = require('./parser/Grammar/OptGrammar');
// cd src/app/parser/Grammar

@Component({
  selector: 'editor-root',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent {
  // Variables
  title = 'olc2web';
  entrada = 'console.log("Hello World");';
  salida = '[Xvimnt201700831]MatrioshTS Output: \n\n';
  ast: any;
  env: Environment;
  flag: boolean;

  // Iconos
  faSpinner = faSpinner;
  faCoffee = faCoffee;
  faPencilRuler = faPencilRuler;
  faGlobe = faGlobe;
  faFileAlt = faFileAlt;
  faLanguage = faLanguage;
  faEraser = faEraser;

  constructor(private dotService: DotService) { }
  ngOnInit() {
    this.clean();
  }
  // Metodos
  clean() {
    this.ast = null;
    this.env = null;
    this.salida = '[Xvimnt201700831]MatrioshTS Output: \n\n';
    _Console.salida = "";
    _Console.count = 0;
    _Console.labels = 0;
    _Console.stackPointer = 0;
    _Console.heapPointer = 0;
    errores.length = 0;
    this.flag = true;
  }

  optimizar() {
    Swal.fire({
      title: 'En donde se encuentra el codigo a optimizar?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Entrada`,
      denyButtonText: `Salida`,
      confirmButtonColor: 'rgb(8, 101, 104)',
      background: 'black',
      icon: 'info'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          this.ast = optimizer.parse(this.entrada.toString());
          Swal.fire({
            title: 'Cool!',
            text: 'Su codigo intermedio se ha optimizado correctamente...',
            icon: 'success',
            confirmButtonText: 'Entendido',
            confirmButtonColor: 'rgb(8, 101, 104)',
            background: 'black'
          });
        } catch (e) {
          console.log(e);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrieron errores en la optimizacion...',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: 'rgb(8, 101, 104)',
            background: 'black'
          });
        }
      } else if (result.isDenied) {
        try {
          this.ast = optimizer.parse(this.salida.toString());
          Swal.fire({
            title: 'Cool!',
            text: 'Su codigo intermedio se ha optimizado correctamente...',
            icon: 'success',
            confirmButtonText: 'Entendido',
            confirmButtonColor: 'rgb(8, 101, 104)',
            background: 'black'
          });
        } catch (e) {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrieron errores en la optimizacion...',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: 'rgb(8, 101, 104)',
            background: 'black'
          });
        }
      }
    });
  }

  ejecutar() {
    this.clean();
    try {
      this.ast = parser.parse(this.entrada.toString());
      this.env = new Environment(null);

      for (const instr of this.ast) {
        try {
          if (instr instanceof Function)
            instr.execute(this.env);
        } catch (error) {
          console.log(error);
        }
      }
      for (const instr of this.ast) {
        if (instr instanceof Function || isString(instr))
          continue;
        try {
          instr.execute(this.env);
          // TODO validar return break continue fuera de ciclos
        } catch (error) {
          console.log(error);
        }
      }
      if (errores.length == 0) {
        // Muestra el resultado en la pagina
        this.salida += _Console.salida;
      } else {
        if (errores.length != 0) {
          errores.forEach(error => {
            this.salida += "Error " + error.getTipo() + " (linea: " + error.getLinea() + ", columna: " + error.getColumna() + "): " + error.getDescripcion() + ".  \n";
          });
        }
      }
    }
    catch (error) {
      console.log(error);
    }
    this.flag = false;
  }

  translate() {
    this.clean();
    try {
      this.ast = parser.parse(this.entrada.toString());
      this.env = new Environment(null);
      this.salida = '';
      try {
        for (const instr of this.ast) {
          this.salida += instr.translate(this.env);
        }
      }
      catch (e) {

      }
      if (errores.length == 0) {
        // Muestra el encabezado
        let body = this.salida;
        this.salida = '#include <stdio.h> \n\n';
        this.salida += 'float Heap[16384];\n';
        this.salida += 'float Stack[16384]; \n';
        this.salida += 'float p; \n';
        this.salida += 'float h; \n';
        this.salida += 'float ';
        for (let index = 0; index < _Console.count; index++) {
          if (index > 0 && index % 8 == 0) {
            this.salida = this.salida.substring(0, this.salida.length - 2);
            this.salida += ";\nfloat "
          }
          this.salida += "t" + index + ", ";
        }
        this.salida = this.salida.substring(0, this.salida.length - 2);
        this.salida += ";\n\n";
        this.salida += "void main() {\n"
        this.salida += body;
        this.salida += "\nreturn;\n"
        this.salida += "}\n\n";
        this.salida += _Console.salida;
      } else {
        if (errores.length != 0) {
          errores.forEach(error => {
            this.salida += "Error " + error.getTipo() + " (linea: " + error.getLinea() + ", columna: " + error.getColumna() + "): " + error.getDescripcion() + ".  \n";
          });
        }
      }
    }
    catch (error) {
      console.log(error);
    }
    this.flag = false;
    _Console.showSystem();
  }


  printAst() {
    if (this.flag) {
      Swal.fire({
        title: 'Oops...',
        text: 'No se ha analizado el codigo aun',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(8, 101, 104)',
        background: 'black'
      })
    } else if (errores.length != 0) {
      Swal.fire({
        title: 'Oops...!',
        text: 'Se encontraron errores en su codigo, no puede graficar',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(8, 101, 104)',
        background: 'black'
      })
    } else {
      //alert(new Plotter().makeDot(this.ast));
      //return;
      this.dotService.setDot(new Plotter().makeDot(this.ast));
      window.open('/olc2web/ast');
      return;
    }
  }

  tokenTable() {
    if (this.flag) {
      Swal.fire({
        title: 'Oops...',
        text: 'No se ha analizado el codigo aun',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(8, 101, 104)',
        background: 'black'
      })
    }
    else if (_Console.symbols.size == 0) {
      Swal.fire({
        title: 'Oops...',
        text: 'No se encontro ninguna variable o funcion guardada',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(8, 101, 104)',
        background: 'black'
      })
    } else if (errores.length != 0) {
      Swal.fire({
        title: 'Oops...!',
        text: 'Se encontraron errores en su codigo, no puede mostrar tabla de variables',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(8, 101, 104)',
        background: 'black'
      })
    }
    else {
      Swal.fire({
        title: 'Tabla de Simbolos',
        html: new Table().symbols(_Console.symbols),
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(8, 101, 104)',
        background: 'black',
        width: 800
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
        confirmButtonColor: 'rgb(8, 101, 104)',
        background: 'black'
      })
    }
    else if (errores.length == 0) {
      Swal.fire({
        title: 'Cool!',
        text: 'No se encontraron errores en su codigo',
        icon: 'success',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(8, 101, 104)',
        background: 'black'
      })
    }
    else {
      Swal.fire({
        title: 'Tabla de Errores',
        html: new Table().errors(errores),
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'rgb(8, 101, 104)',
        background: 'black',
        width: 800
      })
    }
  }
}