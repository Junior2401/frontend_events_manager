import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailArtiste } from './detail-artiste';

describe('DetailArtiste', () => {
  let component: DetailArtiste;
  let fixture: ComponentFixture<DetailArtiste>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailArtiste],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailArtiste);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
