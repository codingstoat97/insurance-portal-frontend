import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'engineTypeLabel',
  standalone: true
})
export class EngineTypeLabelPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';

    switch (value.toUpperCase()) {
      case 'COMBUSTION':
        return 'Combustión';
      case 'ELECTRICO':
        return 'Eléctrico';
      case 'HIBRIDO':
        return 'Híbrido';
      default:
        return value;
    }
  }

}
