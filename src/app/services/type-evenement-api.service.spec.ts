import { TestBed } from '@angular/core/testing';

import { TypeEvenementApiService } from './type-evenement-api.service';

describe('TypeEvenementApiService', () => {
  let service: TypeEvenementApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeEvenementApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
