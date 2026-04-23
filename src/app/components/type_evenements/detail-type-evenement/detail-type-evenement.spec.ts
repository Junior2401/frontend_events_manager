import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTypeEvenement } from './detail-type-evenement';

describe('DetailTypeEvenement', () => {
  let component: DetailTypeEvenement;
  let fixture: ComponentFixture<DetailTypeEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTypeEvenement],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailTypeEvenement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
