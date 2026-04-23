import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAdministrateur } from './update-administrateur';

describe('UpdateAdministrateur', () => {
  let component: UpdateAdministrateur;
  let fixture: ComponentFixture<UpdateAdministrateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAdministrateur],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateAdministrateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
