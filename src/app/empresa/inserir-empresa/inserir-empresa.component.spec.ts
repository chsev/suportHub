import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirEmpresaComponent } from './inserir-empresa.component';

describe('InserirEmpresaComponent', () => {
  let component: InserirEmpresaComponent;
  let fixture: ComponentFixture<InserirEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InserirEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
