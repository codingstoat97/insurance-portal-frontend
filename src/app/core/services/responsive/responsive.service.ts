import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

const TABLET_QUERY = '(min-width: 600px) and (max-width: 1024px)';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {

  isPhonePortrait: boolean = false;
  isTablet: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
      .subscribe(result => {
        this.isPhonePortrait = result.matches;
      });

    this.breakpointObserver.observe(TABLET_QUERY)
      .subscribe(result => {
        this.isTablet = result.matches;
      });
  }

}
