import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { FxService } from './fx.service';
import { CurrencyList, CurrencyRates } from '../models/fx.model';

describe('FxService', () => {
  let service: FxService;
  let httpTestingController: HttpTestingController;
  let currencyList: CurrencyList = {
    success: true,
    symbols: {
      'PHP': 'Philippine Peso',
      'USD': 'US Dollar'
    }
  };
  let currencyRates: CurrencyRates = {
    success: true,
    timestamp: 123,
    base: 'EUR',
    date: '',
    rates: {
      'PHP': 58.12
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FxService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  beforeEach(inject(
    [FxService],
    (service: FxService) => {
      service = service;
    }
  ));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sellCurrency', () => {
    it('should return amount based on sell value and exchange rate', () => {
      expect(service.sellCurrency(312, 1.56)).toEqual(200);
    });

    it('should return 0 when exchangeRate is 0', () => {
      expect(service.sellCurrency(12, 0)).toEqual(0);
    });
  });

  describe('buyCurrency', () => {
    it('should return correct amount based on buy value and exchange rate', () => {
      expect(service.buyCurrency(1500, 50)).toEqual(75000);
    });
  });

  describe('getCurrencyList', () => {
    it('should return currency list from API', () => {
      let result: CurrencyList;
      service.getCurrencyList().subscribe( (res) => {
        result = res;
      });
      const req = httpTestingController.expectOne({
        method: 'GET',
        url: `http://api.exchangeratesapi.io/v1/symbols?access_key=6526429c01da33749f21d46e4754e72f`
      });

      req.flush(currencyList);
 
      expect(result).toEqual(currencyList);
    });
  });

  describe('getRate', () => {
    it('should return exchange rate from API', () => {
      let result: CurrencyRates;
      service.getRate('EUR','PHP').subscribe( (res) => {
        result = res;
      });
      const req = httpTestingController.expectOne({
        method: 'GET',
        url: `http://api.exchangeratesapi.io/v1/latest?access_key=6526429c01da33749f21d46e4754e72f&base=EUR&symbols=PHP`
      });

      req.flush(currencyRates);
 
      expect(result).toEqual(currencyRates);
    });
  });
});
