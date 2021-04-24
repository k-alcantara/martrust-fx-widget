import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CurrencyList, CurrencyRates } from '../models/fx.model';

@Injectable({
  providedIn: 'root'
})
export class FxService {

  API_KEY = '6526429c01da33749f21d46e4754e72f';

  constructor(
    private http: HttpClient
  ) { }

  sellCurrency(sellAmount: number, exchangeRate: number) {
    return exchangeRate === 0 ? 0 : sellAmount / exchangeRate;
  }

  buyCurrency(buyAmount: number, exchangeRate: number) {
    return buyAmount * exchangeRate;
  }

  getCurrencyList(): Observable<CurrencyList> {
    const url = `http://api.exchangeratesapi.io/v1/symbols`;
    console.log('url: ', url);
    let params = new HttpParams()
      .set('access_key', this.API_KEY);
    return this.http.get<CurrencyList>(url, {params});
  }

  getRate(base: string, convertTo: string): Observable<CurrencyRates> {
    const url = `http://api.exchangeratesapi.io/v1/latest`;
    let params = new HttpParams()
      .set('access_key', this.API_KEY)
      .set('base', base)
      .set('symbols', convertTo);
    console.log('url: ', url);
    return this.http.get<CurrencyRates>(url, {params});
  }
}
