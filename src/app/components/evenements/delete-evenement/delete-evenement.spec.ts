import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEvenement } from './delete-evenement';

describe('DeleteEvenement', () => {
  let component: DeleteEvenement;
  let fixture: ComponentFixture<DeleteEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteEvenement],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteEvenement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
