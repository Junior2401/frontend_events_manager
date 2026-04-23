import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAdministrateur } from './delete-administrateur';

describe('DeleteAdministrateur', () => {
  let component: DeleteAdministrateur;
  let fixture: ComponentFixture<DeleteAdministrateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAdministrateur],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAdministrateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
