import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrganisateur } from './create-organisateur';

describe('CreateOrganisateur', () => {
  let component: CreateOrganisateur;
  let fixture: ComponentFixture<CreateOrganisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrganisateur],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOrganisateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
