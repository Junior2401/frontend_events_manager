import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateArtiste } from './update-artiste';

describe('UpdateArtiste', () => {
  let component: UpdateArtiste;
  let fixture: ComponentFixture<UpdateArtiste>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateArtiste],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateArtiste);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
