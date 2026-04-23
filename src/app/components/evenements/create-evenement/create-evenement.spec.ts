import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEvenement } from './create-evenement';

describe('CreateEvenement', () => {
  let component: CreateEvenement;
  let fixture: ComponentFixture<CreateEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEvenement],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEvenement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
