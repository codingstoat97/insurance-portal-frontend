import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, finalize } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { SnackBarService } from 'src/app/core/services/snack-bar/snack-bar.service';
import { QuoteStepperService } from 'src/app/core/services/quote-stepper/quote-stepper.service';
import { ResponsiveService } from 'src/app/core/services/responsive/responsive.service';
import { SalesConfigService } from 'src/app/core/services/sales-config/sales-config.service';

import { ClientVehicle } from 'src/app/shared/models';
import * as PATH from 'src/app/shared/utils/request-paths.util';
import { CONTACT_PHONE_DISPLAY, WHATSAPP_ICON_PATH, WHATSAPP_URL } from 'src/app/shared/utils/contact.util';
import { getApiErrorMessage, isErrorHandledGlobally } from 'src/app/shared/utils/http-error.util';

@Component({
  selector: 'app-quote-stepper',
  templateUrl: './quote-stepper.component.html',
  styleUrls: ['./quote-stepper.component.sass']
})
export class QuoteStepperComponent implements OnInit {

  readonly contactPhone = CONTACT_PHONE_DISPLAY;
  readonly whatsappUrl = WHATSAPP_URL;
  readonly whatsappIconPath = WHATSAPP_ICON_PATH;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private snackbar: SnackBarService,
    private stepperService: QuoteStepperService,
    private responsiveService: ResponsiveService,
    private salesConfigService: SalesConfigService
  ) { }

  get isMobile(): boolean {
    return this.responsiveService.isPhonePortrait;
  }

  currentStep = 0;
  clientVehicleData: ClientVehicle | null = null;
  offerList: any[] = [];
  salesEnabled = true;
  searching = false;

  get totalSteps(): number {
    return this.salesEnabled ? 3 : 2;
  }

  get progressPercent(): number {
    return Math.round(((this.currentStep + 1) / this.totalSteps) * 100);
  }

  ngOnInit(): void {
    this.currentStep = this.stepperService.currentStep;
    this.clientVehicleData = this.stepperService.clientVehicleData;
    this.offerList = this.stepperService.offerList;

    this.salesConfigService.enabled$.subscribe(enabled => {
      this.salesEnabled = enabled;
      if (!enabled && this.currentStep > 1) {
        this.currentStep = 1;
        this.stepperService.currentStep = this.currentStep;
      }
    });
  }

  onClientVehicleSubmitted(clientVehicle: ClientVehicle): void {
    this.clientVehicleData = clientVehicle;
    this.stepperService.clientVehicleData = clientVehicle;
    this.sendForm();
  }

  sendForm(): void {
    const params = this.buildParams();
    this.searching = true;
    this.httpService.post<any>(PATH.planSearch, params)
      .pipe(
        finalize(() => (this.searching = false)),
        catchError(error => {
          if (!isErrorHandledGlobally(error)) {
            this.snackbar.error(getApiErrorMessage(error, 'Error al buscar planes disponibles.'));
          }
          return EMPTY;
        }))
      .subscribe(res => {
        this.offerList = res;
        this.stepperService.offerList = res;
        this.currentStep++;
        this.stepperService.currentStep = this.currentStep;
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
