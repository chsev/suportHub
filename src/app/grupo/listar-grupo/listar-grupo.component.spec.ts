import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarGrupoComponent } from './listar-grupo.component';

describe('ListarGrupoComponent', () => {
  let component: ListarGrupoComponent;
  let fixture: ComponentFixture<ListarGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarGrupoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
