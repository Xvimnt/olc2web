import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AstComponent } from './Components/ast/ast.component'
import { EditorComponent } from './Components/editor/editor.component'


const routes: Routes = [
  {path: 'ast', component: AstComponent},
  {path: 'editor', component: EditorComponent},
  {path:'',redirectTo:'/editor',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
