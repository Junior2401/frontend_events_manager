import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrganisateur } from './list-organisateur';

describe('ListOrganisateur', () => {
  let component: ListOrganisateur;
  let fixture: ComponentFixture<ListOrganisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOrganisateur],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOrganisateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
