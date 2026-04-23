import { TestBed } from '@angular/core/testing';

import { OrganisateurApiService } from './organisateur-api.service';

describe('OrganisateurApiService', () => {
  let service: OrganisateurApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganisateurApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
