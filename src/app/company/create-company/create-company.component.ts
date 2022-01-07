import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css']
})
export class CreateCompanyComponent implements OnInit {
  companyForm!: FormGroup;

  constructor(
    private router: Router,
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.companyForm = new FormGroup({
      name: new FormControl('',  {validators: [Validators.required]}),
      administrator: new FormControl('',  {validators: [Validators.required]}),
      segment: new FormControl(''),
      description: new FormControl(''),
      isOpen: new FormControl(false)
    })
  }

  onSubmit(){
    this.companyService.insert(this.companyForm.value);
    this.router.navigate(["company/list"]);
  }

  onCancel(){
    this.router.navigate(["company/list"]);
  }

}
