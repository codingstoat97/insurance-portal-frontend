import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';
import { QuoteStepperService } from 'src/app/core/services/quote-stepper/quote-stepper.service';
import { ResponsiveService } from 'src/app/core/services/responsive/responsive.service';

import { ClientVehicle } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util';

@Component({
  selector: 'app-quote-stepper',
  templateUrl: './quote-stepper.component.html',
  styleUrls: ['./quote-stepper.component.sass']
})
export class QuoteStepperComponent implements OnInit {

  constructor(
    private router: Router,
    private httpService: HttpService,
    private snackbar: SnackBarService,
    private stepperService: QuoteStepperService,
    private responsiveService: ResponsiveService
  ) { }

  get isMobile(): boolean {
    return this.responsiveService.isPhonePortrait;
  }

  currentStep = 0;
  clientVehicleData: ClientVehicle | null = null;
  offerList: any[] = [];

  get progressPercent(): number {
    return Math.round(((this.currentStep + 1) / 3) * 100);
  }

  ngOnInit(): void {
    this.currentStep = this.stepperService.currentStep;
    this.clientVehicleData = this.stepperService.clientVehicleData;
    this.offerList = this.stepperService.offerList;
  }

  onClientVehicleSubmitted(clientVehicle: ClientVehicle): void {
    this.clientVehicleData = clientVehicle;
    this.stepperService.clientVehicleData = clientVehicle;
    this.sendForm();
    this.currentStep++;
    this.stepperService.currentStep = this.currentStep;
  }

  sendForm(): void {
    const params = this.buildParams();
    this.httpService.post<any>(PATH.planSearch, params)
      .pipe(catchError(() => { this.snackbar.error('Error al buscar planes disponibles.'); return EMPTY; }))
      .subscribe(res => {
        this.offerList = res;
        this.stepperService.offerList = res;
      });
  }

  buildParams() {
    return { ...this.clientVehicleData };
  }

  onCancelled(): void {
    if (this.currentStep === 0) {
      this.stepperService.reset();
      this.router.navigate(['/home']);
    } else {
      this.currentStep--;
      this.stepperService.currentStep = this.currentStep;
    }
  }

}
