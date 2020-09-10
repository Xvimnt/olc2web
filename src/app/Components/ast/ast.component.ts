import { Component, OnInit } from '@angular/core';
// Import para las graficas
import { graphviz } from 'd3-graphviz';
import { wasmFolder } from "@hpcc-js/wasm";

@Component({
  selector: 'app-ast',
  templateUrl: './ast.component.html',
  styleUrls: ['./ast.component.css']
})
export class AstComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    wasmFolder('https://cdn.jsdelivr.net/npm/@hpcc-js/wasm@0.3.13/dist');
    graphviz('#graph').renderDot('digraph {a -> b}');
  }

}
