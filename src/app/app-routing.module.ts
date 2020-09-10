import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AstComponent } from './ast/ast.component'


const routes: Routes = [{
  path: 'ast', component: AstComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
