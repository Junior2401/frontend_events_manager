import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTypeEvenement } from './update-type-evenement';

describe('UpdateTypeEvenement', () => {
  let component: UpdateTypeEvenement;
  let fixture: ComponentFixture<UpdateTypeEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTypeEvenement],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTypeEvenement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
