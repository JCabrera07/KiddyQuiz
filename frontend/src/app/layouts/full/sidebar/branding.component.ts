import { Component } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  imports: [RouterModule],
  template: `
    <a [routerLink]="['/']">
<img
  src="./assets/images/logos/horizontal.png"
  alt="logo"
  style="width: 200px; height: auto;"
  class="align-middle m-2"
/>
    </a>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();
  constructor(private settings: CoreService) {} 
}
