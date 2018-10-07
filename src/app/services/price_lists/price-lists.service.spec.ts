import { TestBed, inject } from '@angular/core/testing';

import { PriceListsService } from './price-lists.service';

describe('PriceListsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriceListsService]
    });
  });

  it('should be created', inject([PriceListsService], (service: PriceListsService) => {
    expect(service).toBeTruthy();
  }));
});
