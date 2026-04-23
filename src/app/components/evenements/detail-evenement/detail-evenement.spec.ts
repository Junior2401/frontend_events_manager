import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEvenement } from './detail-evenement';

describe('DetailEvenement', () => {
  let component: DetailEvenement;
  let fixture: ComponentFixture<DetailEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailEvenement],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailEvenement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
