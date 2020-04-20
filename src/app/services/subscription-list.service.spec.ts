import { TestBed } from '@angular/core/testing';

import { SubscriptionListService } from './subscription-list.service';

describe('SubscriptionListService', () => {
  let service: SubscriptionListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
