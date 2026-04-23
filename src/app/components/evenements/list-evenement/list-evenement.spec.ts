import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEvenement } from './list-evenement';

describe('ListEvenement', () => {
  let component: ListEvenement;
  let fixture: ComponentFixture<ListEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEvenement],
    }).compileComponents();

    fixture = TestBed.createComponent(ListEvenement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
