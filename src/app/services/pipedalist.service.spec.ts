import { TestBed } from '@angular/core/testing';

import { PIPEDAListService } from './pipedalist.service';

describe('PIPEDAListService', () => {
  let service: PIPEDAListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PIPEDAListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
