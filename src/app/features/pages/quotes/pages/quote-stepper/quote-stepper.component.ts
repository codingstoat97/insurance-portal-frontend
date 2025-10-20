import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { Client, Vehicle } from 'src/app/shared/models';

@Component({
  selector: 'app-quote-stepper',
  templateUrl: './quote-stepper.component.html',
  styleUrls: ['./quote-stepper.component.sass']
})
export class QuoteStepperComponent {

  @ViewChild('stepper') stepper!: MatStepper;

  clientData: any;
  vehicleData: any;

  clientDone = false;
  vehicleDone = false;

  onClientSubmitted(client: Client) {
    console.log(client);
    this.clientData = client;
    this.clientDone = true;
    this.stepper.next();
  }

  onVehicleSubmitted(vehicle: Vehicle) {
    console.log(vehicle);
    this.vehicleData = vehicle;
    this.vehicleDone = true;
    this.buildParams();
    this.stepper.next();
  }

  sendForm(): void {
    const params = this.buildParams();
    //send to backend
  }

  buildParams() {
    const payload = {
      ...this.vehicleData,
      ...this.clientData,
    };
    console.log(JSON.stringify(payload));
    return payload;
  }

  onCancelled() {
    this.stepper.previous();
  }

}
