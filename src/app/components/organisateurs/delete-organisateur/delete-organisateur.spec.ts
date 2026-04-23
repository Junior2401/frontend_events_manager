import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOrganisateur } from './delete-organisateur';

describe('DeleteOrganisateur', () => {
  let component: DeleteOrganisateur;
  let fixture: ComponentFixture<DeleteOrganisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteOrganisateur],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteOrganisateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
