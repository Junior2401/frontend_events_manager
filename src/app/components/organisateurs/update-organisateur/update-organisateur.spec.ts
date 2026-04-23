import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOrganisateur } from './update-organisateur';

describe('UpdateOrganisateur', () => {
  let component: UpdateOrganisateur;
  let fixture: ComponentFixture<UpdateOrganisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateOrganisateur],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateOrganisateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
