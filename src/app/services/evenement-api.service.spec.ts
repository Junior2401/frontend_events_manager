import { TestBed } from '@angular/core/testing';

import { EvenementApiService } from './evenement-api.service';

describe('EvenementApiService', () => {
  let service: EvenementApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvenementApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
