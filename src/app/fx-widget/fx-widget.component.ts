import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FxService } from '../core/fx.service';

@Component({
  selector: 'app-fx-widget',
  templateUrl: './fx-widget.component.html',
  styleUrls: ['./fx-widget.component.scss']
})
export class FxWidgetComponent implements OnInit {

  fxForm: FormGroup;
  fromCurrency = '';
  fromAmount: number;
  toCurrency = '';
  toAmount: number;
  exchangeRate: number;
  showConversionRate: boolean;

  // fake data FOR NOW
  currencies: Array<string>;

  constructor(
    private formBuilder: FormBuilder,
    public fxService: FxService
  ) { }

  ngOnInit(): void {
    this.fxForm = this.formBuilder.group({
      fromCurrency: [''],
      fromAmount: [0],
      toCurrency: [''],
      toAmount: [0],
    })

    this.trackChanges();
    this.getCurrencyList();
  }

  trackChanges() {
    this.fxForm.valueChanges.subscribe(formValues => {
      console.log('formValues: ', formValues);

      this.fromAmount = formValues.fromAmount;
      this.toAmount = formValues.toAmount;
      this.fromCurrency = formValues.fromCurrency;
      this.toCurrency = formValues.toCurrency;
    });

    this.fxForm.get('fromCurrency').valueChanges.subscribe(val => {
      if (val !== '' && this.toCurrency !== '') {
        this.getExchangeRate(val, this.toCurrency);
        setTimeout( () => {
          const sellValue = this.fxService.buyCurrency(this.fromAmount, this.exchangeRate);
          this.fxForm.get('toAmount').patchValue(sellValue, { emitEvent: false });
        }, 1000);
        
      }
    });
    this.fxForm.get('fromAmount').valueChanges.subscribe(val => {
      if (this.fromCurrency !== '' && this.toCurrency !== '') {
        const sellValue = this.fxService.buyCurrency(val, this.exchangeRate);
        this.fxForm.get('toAmount').patchValue(sellValue, { emitEvent: false });
      }
    });
    this.fxForm.get('toCurrency').valueChanges.subscribe(val => {
      if (this.fromCurrency !== '' && val !== '')  {
        this.getExchangeRate(this.fromCurrency, val);
        setTimeout( () => {
          const buyValue = this.fxService.sellCurrency(this.toAmount, this.exchangeRate);
          this.fxForm.get('fromAmount').patchValue(buyValue, { emitEvent: false });
        }, 1000);
      }
    });
    this.fxForm.get('toAmount').valueChanges.subscribe(val => {
      if  (this.fromCurrency !== '' && this.toCurrency !== '')  {
        const buyValue = this.fxService.sellCurrency(val, this.exchangeRate);
        this.fxForm.get('fromAmount').patchValue(buyValue, { emitEvent: false });
      }
    });
  }

  getExchangeRate(fromCurrency: string, toCurrency: string) {
    if (fromCurrency === 'EUR') { // if currency is EUR, get rate from API
      this.fxService.getRate(fromCurrency, toCurrency).subscribe( (res) => {
        console.log('getRate api response: ', res);
        this.exchangeRate = res.rates[toCurrency];
      });
    } else { // else mock the rate as other base currencies are not available in the API
      this.exchangeRate = Math.random() * 100;
    }

    console.log(this.exchangeRate);
  }

  getCurrencyList() {
    this.fxService.getCurrencyList().subscribe( (res) => {
      const symbols = res.symbols;
      this.currencies = Object.keys(symbols);
    });
  }

}
