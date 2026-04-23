import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailUtilisateur } from './detail-utilisateur';

describe('DetailUtilisateur', () => {
  let component: DetailUtilisateur;
  let fixture: ComponentFixture<DetailUtilisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailUtilisateur],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailUtilisateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
