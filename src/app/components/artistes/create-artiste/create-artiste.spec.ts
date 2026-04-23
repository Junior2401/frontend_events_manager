import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateArtiste } from './create-artiste';

describe('CreateArtiste', () => {
  let component: CreateArtiste;
  let fixture: ComponentFixture<CreateArtiste>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateArtiste],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateArtiste);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
