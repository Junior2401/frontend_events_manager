import { TestBed } from '@angular/core/testing';

import { AdministrateurApiService } from './administrateur-api.service';

describe('AdministrateurApiService', () => {
  let service: AdministrateurApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministrateurApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
