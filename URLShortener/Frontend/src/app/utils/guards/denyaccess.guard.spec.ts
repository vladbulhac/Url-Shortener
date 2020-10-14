import { TestBed } from '@angular/core/testing';

import { DenyaccessGuard } from './denyaccess.guard';

describe('DenyaccessGuard', () => {
  let guard: DenyaccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DenyaccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
