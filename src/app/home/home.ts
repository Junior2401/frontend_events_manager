import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Welcome</h3>
      </div>
      <div class="card-body">
        AdminLTE 4 is successfully integrated into your Angular project!
      </div>
      <div class="card-footer">
        Footer content goes here
      </div>
    </div>
  `,
  styles: ``,
})
export class Home {}
