import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListArtiste } from './list-artiste';

describe('ListArtiste', () => {
  let component: ListArtiste;
  let fixture: ComponentFixture<ListArtiste>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListArtiste],
    }).compileComponents();

    fixture = TestBed.createComponent(ListArtiste);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
