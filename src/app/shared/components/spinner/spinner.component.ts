import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="inline-block rounded-full border-current border-r-transparent animate-spin"
      [style.width.px]="size()"
      [style.height.px]="size()"
      [style.borderWidth.px]="thickness()"
      role="status"
      [attr.aria-label]="label()"
    ></div>
  `,
})
export class SpinnerComponent {
  readonly size = input<number>(20);
  readonly thickness = input<number>(2);
  readonly label = input<string>('Cargando');
}
