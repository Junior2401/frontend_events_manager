import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUtilisateur } from './delete-utilisateur';

describe('DeleteUtilisateur', () => {
  let component: DeleteUtilisateur;
  let fixture: ComponentFixture<DeleteUtilisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUtilisateur],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteUtilisateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
