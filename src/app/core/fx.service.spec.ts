import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { FxService } from './fx.service';

describe('FxService', () => {
  let service: FxService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(FxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sellCurrency', () => {
    it('should return amount based on sell value and exchange rate', () => {
      expect(service.sellCurrency(312, 1.56)).toBe(200);
    });

    it('should return 0 when exchangeRate is 0', () => {
      expect(service.sellCurrency(12, 0)).toBe(0);
    });
  });

  describe('buyCurrency', () => {
    it('should return correct amount based on buy value and exchange rate', () => {
      expect(service.buyCurrency(1500, 50)).toBe(75000);
    });
  });
});
