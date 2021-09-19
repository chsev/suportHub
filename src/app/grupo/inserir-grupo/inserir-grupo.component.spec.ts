import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirGrupoComponent } from './inserir-grupo.component';

describe('InserirGrupoComponent', () => {
  let component: InserirGrupoComponent;
  let fixture: ComponentFixture<InserirGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InserirGrupoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
