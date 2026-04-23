import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTicket } from './list-ticket';

describe('ListTicket', () => {
  let component: ListTicket;
  let fixture: ComponentFixture<ListTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(ListTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
