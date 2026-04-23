import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTicket } from './detail-ticket';

describe('DetailTicket', () => {
  let component: DetailTicket;
  let fixture: ComponentFixture<DetailTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
