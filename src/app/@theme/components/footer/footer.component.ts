import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Created with ♥ by <b><a href="https://carleton.ca" target="_blank">Textual Analysis Group @ Carleton 2019</a></b></span>
  `,
})
export class FooterComponent {
}
