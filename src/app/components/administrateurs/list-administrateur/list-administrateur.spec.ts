import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAdministrateur } from './list-administrateur';

describe('ListAdministrateur', () => {
  let component: ListAdministrateur;
  let fixture: ComponentFixture<ListAdministrateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAdministrateur],
    }).compileComponents();

    fixture = TestBed.createComponent(ListAdministrateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
