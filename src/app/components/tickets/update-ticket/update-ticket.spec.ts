import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTicket } from './update-ticket';

describe('UpdateTicket', () => {
  let component: UpdateTicket;
  let fixture: ComponentFixture<UpdateTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
