import { TestBed } from '@angular/core/testing';

import { UtilisateurApiService } from './utilisateur-api.service';

describe('UtilisateurApiService', () => {
  let service: UtilisateurApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilisateurApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
