import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEvenement } from './update-evenement';

describe('UpdateEvenement', () => {
  let component: UpdateEvenement;
  let fixture: ComponentFixture<UpdateEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEvenement],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateEvenement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
