import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUtilisateur } from './list-utilisateur';

describe('ListUtilisateur', () => {
  let component: ListUtilisateur;
  let fixture: ComponentFixture<ListUtilisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUtilisateur],
    }).compileComponents();

    fixture = TestBed.createComponent(ListUtilisateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
