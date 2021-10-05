import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirSistemaComponent } from './inserir-sistema.component';

describe('InserirSistemaComponent', () => {
  let component: InserirSistemaComponent;
  let fixture: ComponentFixture<InserirSistemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InserirSistemaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
