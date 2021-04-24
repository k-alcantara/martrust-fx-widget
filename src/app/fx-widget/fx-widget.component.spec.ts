import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { FxWidgetComponent } from './fx-widget.component';
import { CurrencyList, CurrencyRates } from '../models/fx.model';
import { Observable, Observer } from 'rxjs';
import { FxService } from '../core/fx.service';

describe('FxWidgetComponent', () => {
  let component: FxWidgetComponent;
  let fixture: ComponentFixture<FxWidgetComponent>;

  let mockCurrencyList: CurrencyList = {
    success: true,
    symbols: {
      'PHP': 'Philippine Peso',
      'USD': 'US Dollar'
    }
  };
  let mockCurrencies = ['PHP', 'USD'];
  let mockCurrencyRates: CurrencyRates = {
    success: true,
    timestamp: 123,
    base: 'EUR',
    date: '',
    rates: {
      'PHP': 58.12
    }
  }

  class MockFxService {
    getCurrencyList() {
      return Observable.create((observer: Observer<CurrencyList>) => {
        observer.next(mockCurrencyList);
      });
    }

    getRate() {
      return Observable.create((observer: Observer<CurrencyRates>) => {
        observer.next(mockCurrencyRates);
      });
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxWidgetComponent ],
      providers: [
        FormBuilder,
        { provide: FxService, useClass: MockFxService }
      ],
      imports: [
        HttpClientModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getExchangeRate', () => {
    it('should get random generated exchange rate when base currency is not EUR', () => {
      component.getExchangeRate('USD', 'PHP');
      expect(component.exchangeRate).toBeDefined();
    });

    it('should get currency list from service when base currency is EUR', () => {
      spyOn(component.fxService, 'getRate').and.callThrough();
      component.getExchangeRate('EUR', 'PHP');
      expect(component.fxService.getRate).toHaveBeenCalled();
      fixture.whenStable().then(() => {
        expect(component.exchangeRate).toBeDefined();
      });
    });
  });

  describe('getCurrencyList', () => {
    it('should get currency list from service', () => {
      spyOn(component.fxService, 'getCurrencyList').and.callThrough();
      component.getCurrencyList();
      expect(component.fxService.getCurrencyList).toHaveBeenCalled();
      fixture.whenStable().then(() => {
        expect(component.currencies).toEqual(mockCurrencies);
      });
    });
  });
});
