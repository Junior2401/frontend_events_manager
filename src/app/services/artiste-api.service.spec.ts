import { TestBed } from '@angular/core/testing';

import { ArtisteApiService } from './artiste-api.service';

describe('ArtisteApiService', () => {
  let service: ArtisteApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtisteApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
