import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListallCompanyComponent } from './listall-company.component';

describe('ListallCompanyComponent', () => {
  let component: ListallCompanyComponent;
  let fixture: ComponentFixture<ListallCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListallCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListallCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
