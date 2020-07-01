import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'nb-price-prompt',
  template: `
    <nb-card>
      <nb-card-header>Change Price</nb-card-header>
      <nb-card-body>
        <input #price nbInput placeholder="Price">
      </nb-card-body>
      <nb-card-footer>
        <button nbButton status="danger" (click)="cancel()">Cancel</button>
        <button nbButton status="success" (click)="submit(price.value)">Change</button>
      </nb-card-footer>
    </nb-card>
  `,
})
export class PricePromptComponent {
  constructor(protected dialogRef: NbDialogRef<PricePromptComponent>) {
  }

  cancel() {
    this.dialogRef.close();
  }

  submit(price) {
    this.dialogRef.close(price);
  }
}