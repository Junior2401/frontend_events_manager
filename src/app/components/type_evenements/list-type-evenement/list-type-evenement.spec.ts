import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { of } from 'rxjs';

import { ListTypeEvenement } from './list-type-evenement';
import { TypeEvenementApiService } from '../../../services/type-evenement-api.service';

describe('ListTypeEvenement', () => {
  let component: ListTypeEvenement;
  let fixture: ComponentFixture<ListTypeEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTypeEvenement],
      providers: [
        provideRouter([]),
        {
          provide: TypeEvenementApiService,
          useValue: {
            getTypeEvenements: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListTypeEvenement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
