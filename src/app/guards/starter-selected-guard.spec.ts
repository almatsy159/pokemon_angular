import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { starterSelectedGuard } from './starter-selected-guard';

describe('starterSelectedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => starterSelectedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
