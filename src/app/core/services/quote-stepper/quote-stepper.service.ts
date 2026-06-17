import { Injectable } from '@angular/core';
import { ClientVehicle } from 'src/app/shared/models';

const KEYS = {
  step: 'qs_step',
  vehicle: 'qs_vehicle',
  offers: 'qs_offers',
} as const;

@Injectable({ providedIn: 'root' })
export class QuoteStepperService {

  get currentStep(): number {
    return Number(sessionStorage.getItem(KEYS.step)) || 0;
  }
  set currentStep(v: number) {
    sessionStorage.setItem(KEYS.step, String(v));
  }

  get clientVehicleData(): ClientVehicle | null {
    const raw = sessionStorage.getItem(KEYS.vehicle);
    return raw ? JSON.parse(raw) : null;
  }
  set clientVehicleData(v: ClientVehicle | null) {
    if (v) sessionStorage.setItem(KEYS.vehicle, JSON.stringify(v));
    else sessionStorage.removeItem(KEYS.vehicle);
  }

  get offerList(): any[] {
    const raw = sessionStorage.getItem(KEYS.offers);
    return raw ? JSON.parse(raw) : [];
  }
  set offerList(v: any[]) {
    sessionStorage.setItem(KEYS.offers, JSON.stringify(v));
  }

  reset(): void {
    Object.values(KEYS).forEach(k => sessionStorage.removeItem(k));
  }
}
