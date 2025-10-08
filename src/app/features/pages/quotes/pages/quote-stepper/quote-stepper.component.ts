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

  clientDone = false;
  vehicleDone = false;

  onClientSubmitted(client: Client) {
    this.clientDone = true;
    this.stepper.next();
  }

  onVehicleSubmitted(vehicle: Vehicle) {
    console.log(vehicle);
    
    this.vehicleDone = true;
    this.stepper.next();
  }

  onCancelled() {
    this.stepper.previous();
  }

}
