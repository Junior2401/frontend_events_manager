import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdministrateur } from './create-administrateur';

describe('CreateAdministrateur', () => {
  let component: CreateAdministrateur;
  let fixture: ComponentFixture<CreateAdministrateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAdministrateur],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAdministrateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
