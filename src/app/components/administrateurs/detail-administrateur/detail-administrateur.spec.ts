import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAdministrateur } from './detail-administrateur';

describe('DetailAdministrateur', () => {
  let component: DetailAdministrateur;
  let fixture: ComponentFixture<DetailAdministrateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailAdministrateur],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailAdministrateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
