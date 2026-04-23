import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTicket } from './delete-ticket';

describe('DeleteTicket', () => {
  let component: DeleteTicket;
  let fixture: ComponentFixture<DeleteTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
