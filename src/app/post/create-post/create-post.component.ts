import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  hide = false;
  form: FormGroup;

  @ViewChild('editor', {
    static: true
  }) editor!: QuillEditorComponent

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      editor: ['<ol><li>test</li><li>123</li></ol>'],
    })
   }

  ngOnInit(): void {
  }

}
