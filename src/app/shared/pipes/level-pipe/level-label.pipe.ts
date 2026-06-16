import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'levelLabel',
  standalone: true
})
export class LevelLabelPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';

    const val = value.toLowerCase();

    switch (val) {
      case 'basic':
        return 'Básico';
      case 'gold':
        return 'Premium';
      default:
        return value;
    }
  }

}
