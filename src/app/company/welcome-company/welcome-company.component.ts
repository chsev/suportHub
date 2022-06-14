import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-company',
  templateUrl: './welcome-company.component.html',
  styleUrls: ['./welcome-company.component.css']
})
export class WelcomeCompanyComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onCreateCompany(){
    this.router.navigate(['company/new']);
  }

  onSearchCompany(){
    this.router.navigate(['company/list']);
  }

}
