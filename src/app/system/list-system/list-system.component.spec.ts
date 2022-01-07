import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSystemComponent } from './list-system.component';

describe('ListSystemComponent', () => {
  let component: ListSystemComponent;
  let fixture: ComponentFixture<ListSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
