import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
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

  @ViewChild('stepper') stepper!: MatStepper;

  clientVehicleData: ClientVehicle | undefined;
  clientVehicleDone = false;

  offerList: any[] = [];

  onClientVehicleSubmitted(clientVehicle: ClientVehicle) {
    this.clientVehicleData = clientVehicle;
    this.clientVehicleDone = true;
    this.sendForm();
    this.stepper.next();
  }

  sendForm(): void {
    const params = this.buildParams();
    this.httpService.post<any>(PATH.planSearch, params).subscribe(res => {
      this.offerList = res;
    });
  }

  buildParams() {
    const payload = {
      ...this.clientVehicleData,
    };
    return payload;
  }

  onCancelled() {
    this.stepper.previous();
  }

}
