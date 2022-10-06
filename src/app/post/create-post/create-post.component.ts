import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent} from '@angular/material/chips';
import { Location } from '@angular/common';
import { PostService } from '../services/post.service';
import { Post } from 'src/app/shared/models/post.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  form: FormGroup;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addTagOnBlur = true;
  tags: string[] = [];

  companyId: string | undefined;
  teamId: string | undefined;
  usrId: string | undefined;
  type: 'companyPost' | 'teamPost' | undefined;

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
    this.companyId = state.companyId;
    this.teamId = state.teamId;
    this.usrId = state.usrId;
    this.type = state.type;
  }

  onSubmit(){
    let content = this.form.get('editor')?.value;
    let newPost: Post = {
      usrId: this.usrId!, 
      title: this.form.get('title')?.value,
      type: this.type!,
      teamId: this.teamId ?? '',
      tags: this.tags,
      liked: []
    };
    this.postService.insert(this.companyId!, newPost, content);
    this.goBackToTeam();
  }
  
  goBackToTeam(){
    if(this.type == 'teamPost'){
      this.router.navigate(['team/view'], {state: {teamId: this.teamId, companyId: this.companyId}});
    }
    this.router.navigate(['company']);
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
