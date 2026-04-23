import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteArtiste } from './delete-artiste';

describe('DeleteArtiste', () => {
  let component: DeleteArtiste;
  let fixture: ComponentFixture<DeleteArtiste>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteArtiste],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteArtiste);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
