import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPostComponent } from './view-post/view-post.component';
import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PostService} from './services/post.service';
import { CreatePostComponent } from './create-post/create-post.component';
import { QuillModule } from 'ngx-quill';
import { ListPostComponent } from './list-post/list-post.component';


@NgModule({
  declarations: [
    ViewPostComponent,
    CreatePostComponent,
    ListPostComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    QuillModule.forRoot(),
  ],
  providers: [PostService]
})
export class PostModule { }
