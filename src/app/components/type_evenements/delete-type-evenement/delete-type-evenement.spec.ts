import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypeEvenement } from './delete-type-evenement';

describe('DeleteTypeEvenement', () => {
  let component: DeleteTypeEvenement;
  let fixture: ComponentFixture<DeleteTypeEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTypeEvenement],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteTypeEvenement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
