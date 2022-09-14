import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent} from '@angular/material/chips';
import { Location } from '@angular/common';
import { PostService } from '../services/post.service';
import { Post } from 'src/app/shared/models/post.model';
import { Router } from '@angular/router';
import { Msg } from 'src/app/shared/models/msg.model';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  form: FormGroup;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addTagOnBlur = true;
  tags: string[] = [];

  post: Post | undefined;
  originalMsg: Msg | undefined;
  companyId: string | undefined;
  teamId: string | undefined;
  // usrId: string | undefined;

  @ViewChild('editor', { static: true }) editor!: QuillEditorComponent;

  constructor(
    private location: Location, 
    private postService: PostService,
    private router: Router,
    fb: FormBuilder,
    ) {
    this.form = fb.group({
      title: new UntypedFormControl('', {validators: [Validators.required]}),
      editor: new UntypedFormControl('', {validators: [Validators.required]}), 
    })
   }

   ngOnInit(): void {
    let state: any = this.location.getState();
    this.teamId = state.teamId;

    this.postService.getPostById(state.postId).subscribe(
      (data) => {
        this.post = data.post;
        this.companyId = data.companyId;
        this.originalMsg = data.msgs.filter(e => e.type == 'original')[0];
        
        this.tags = this.post.tags;
        this.form.get('editor')?.setValue(this.originalMsg.content);
        this.form.get('title')?.setValue(this.post.title);
      }
    )
  }

  onSubmit(){
    let content = this.form.get('editor')?.value;
    let title = this.form.get('title')?.value;
    console.log(content); //debug
    if(this.companyId && this.post && this.originalMsg){
      this.postService.update(this.companyId, this.post.id!, title, this.tags, this.originalMsg.id!, content)
    }
    this.goBack();
  }


  goBack(){
    this.router.navigate(['post/view', this.post?.id]);
    // this.router.navigate(['team/view'], {state: {teamId: this.teamId, companyId: this.companyId}});
  }


  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }


  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
}
