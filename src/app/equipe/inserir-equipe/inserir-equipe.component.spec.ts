import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirEquipeComponent } from './inserir-equipe.component';

describe('InserirEquipeComponent', () => {
  let component: InserirEquipeComponent;
  let fixture: ComponentFixture<InserirEquipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InserirEquipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirEquipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
