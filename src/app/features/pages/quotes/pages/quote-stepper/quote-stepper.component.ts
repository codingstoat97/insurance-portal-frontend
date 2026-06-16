import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';

import { ClientVehicle } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util';

@Component({
  selector: 'app-quote-stepper',
  templateUrl: './quote-stepper.component.html',
  styleUrls: ['./quote-stepper.component.sass']
})
export class QuoteStepperComponent {

  constructor(private httpService: HttpService) { }

  currentStep = 0;

  clientVehicleData: ClientVehicle | undefined;
  offerList: any[] = [];

  get progressPercent(): number {
    return Math.round(((this.currentStep + 1) / 3) * 100);
  }

  onClientVehicleSubmitted(clientVehicle: ClientVehicle) {
    this.clientVehicleData = clientVehicle;
    this.sendForm();
    this.currentStep++;
  }

  sendForm(): void {
    const params = this.buildParams();
    this.httpService.post<any>(PATH.planSearch, params).subscribe(res => {
      this.offerList = res;
    });
  }

  buildParams() {
    return { ...this.clientVehicleData };
  }

  onCancelled() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

}
