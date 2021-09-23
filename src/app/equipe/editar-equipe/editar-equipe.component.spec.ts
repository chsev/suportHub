import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEquipeComponent } from './editar-equipe.component';

describe('EditarEquipeComponent', () => {
  let component: EditarEquipeComponent;
  let fixture: ComponentFixture<EditarEquipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarEquipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarEquipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
