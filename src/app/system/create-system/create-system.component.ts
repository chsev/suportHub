import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SystemService } from '../services/system.service';

@Component({
  selector: 'app-create-system',
  templateUrl: './create-system.component.html',
  styleUrls: ['./create-system.component.css']
})
export class CreateSystemComponent implements OnInit {
  systemForm!: UntypedFormGroup;

  constructor(
    private router: Router,
    private systemService: SystemService
  ) { }

  ngOnInit(): void {
    this.systemForm = new UntypedFormGroup({
      name: new UntypedFormControl('',  {validators: [Validators.required]}),
      description: new UntypedFormControl(''),
    })
  }

  onSubmit(){
    this.systemService.insert(this.systemForm.value);
    this.router.navigate(["system/list"]);
  }

  onCancel(){
    this.router.navigate(["system/list"]);
  }

}
