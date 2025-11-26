import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';

import { FormImportsModule } from '../../forms/form-imports.module';
import { SharedModule } from '../../shared.module';

import { HttpService } from 'src/app/core/services/http/http.service';

import { Benefit } from '../../models';
import * as PATH from 'src/app/shared/utils/request-paths.util';


@Component({
  selector: 'app-add-benefit-modal',
  standalone: true,
  imports: [CommonModule, SharedModule, FormImportsModule, MatDialogModule, MatCheckboxModule, MatExpansionModule],
  templateUrl: './add-benefit-modal.component.html',
  styleUrls: ['./add-benefit-modal.component.sass']
})
export class AddBenefitModalComponent implements OnInit {

  benefitList: Benefit[] | null = [];

  private readonly _formBuilder = inject(FormBuilder);
  benefitsForm: FormGroup = this._formBuilder.group({})

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddBenefitModalComponent>,
    private httpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: { selectedBenefitIds?: number[] }
  ) { }

  ngOnInit(): void {
    this.fetchBenefitList();
  }

  fetchBenefitList(): void {
    this.httpService.get<Benefit[]>(PATH.benefitList).subscribe(res => {
      this.benefitList = res ?? [];
      this.buildFormControls();
      console.log(this.benefitList);
    });
  }

  private buildFormControls(): void {
    this.benefitList?.forEach(b => {
      const idKey = b.id.toString();
      const isSelected = this.data?.selectedBenefitIds?.includes(b.id) ?? false;
      this.benefitsForm.addControl(idKey, new FormControl(isSelected));
    });
  }

  onConfirm(): void {
    const formValue = this.benefitsForm.value;

    const selectedBenefits = this.benefitList?.filter(b => {
      const key = b.id.toString();
      return formValue[key] === true;
    });
    this.dialogRef.close(selectedBenefits);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
