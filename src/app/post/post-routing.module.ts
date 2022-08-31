import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ViewPostComponent } from './view-post/view-post.component';
import { CreatePostComponent } from './create-post/create-post.component';


const routes: Routes = [
    { path: 'post', redirectTo: 'post/create' }, 
    { path: 'post/view', component: ViewPostComponent},
    { path: 'post/create', component: CreatePostComponent},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PostRoutingModule { }
