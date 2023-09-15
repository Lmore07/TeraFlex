import { TestBed } from '@angular/core/testing';

import { ApiNotificationService } from './api-notification.service';

describe('ApiNotificationService', () => {
  let service: ApiNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
