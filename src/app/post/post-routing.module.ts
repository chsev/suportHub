import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ViewPostComponent } from './view-post/view-post.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { AuthGuard } from '../auth/auth.guard';
import { EditPostComponent } from './edit-post/edit-post.component';


const routes: Routes = [
    { path: 'post', redirectTo: '' }, 
    { path: 'post/view/:id', component: ViewPostComponent},
    { path: 'post/new', component: CreatePostComponent},
    { path: 'post/edit', component: EditPostComponent, canActivate: [AuthGuard]},
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
