import { Injectable } from '@angular/core';
import { ClientVehicle } from 'src/app/shared/models';

@Injectable({ providedIn: 'root' })
export class QuoteStepperService {
  currentStep = 0;
  clientVehicleData: ClientVehicle | null = null;
  offerList: any[] = [];

  reset(): void {
    this.currentStep = 0;
    this.clientVehicleData = null;
    this.offerList = [];
  }
}
