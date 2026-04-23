import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { of } from 'rxjs';

import { CreateTypeEvenement } from './create-type-evenement';
import { TypeEvenementApiService } from '../../../services/type-evenement-api.service';

describe('CreateTypeEvenement', () => {
  let component: CreateTypeEvenement;
  let fixture: ComponentFixture<CreateTypeEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTypeEvenement],
      providers: [
        provideRouter([]),
        {
          provide: TypeEvenementApiService,
          useValue: {
            getTypeEvenementById: () => of({ id: 1, libelle: 'Demo', description: 'Demo description' }),
            createTypeEvenement: () => of({ id: 1, libelle: 'Demo', description: 'Demo description' }),
            updateTypeEvenement: () => of({ id: 1, libelle: 'Demo', description: 'Demo description' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTypeEvenement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
