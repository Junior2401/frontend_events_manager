import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailOrganisateur } from './detail-organisateur';

describe('DetailOrganisateur', () => {
  let component: DetailOrganisateur;
  let fixture: ComponentFixture<DetailOrganisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailOrganisateur],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailOrganisateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
