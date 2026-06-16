import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coverageLabel',
  standalone: true
})
export class CoverageLabelPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';

    const val = value.toUpperCase();

    switch (val) {
      case 'PRINCIPALS':
        return 'Cobertura Principal';
      case 'ADDITIONALS':
        return 'Cobertura Adicional';
        case 'CLAUSES_AND_ANNEXES':
        return 'Clausulas y Anexos';
      default:
        return value;
    }
  }

}
