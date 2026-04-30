import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="inline-flex items-center gap-0.5"
      [attr.role]="readonly() ? 'img' : 'radiogroup'"
      [attr.aria-label]="ariaLabel()"
    >
      @for (idx of stars; track idx) {
        @if (readonly()) {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            [attr.width]="size()"
            [attr.height]="size()"
            viewBox="0 0 24 24"
            [attr.fill]="idx <= rounded() ? 'var(--color-brand-500)' : 'transparent'"
            [attr.stroke]="
              idx <= rounded() ? 'var(--color-brand-500)' : 'var(--color-ink-300)'
            "
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
        } @else {
          <button
            type="button"
            class="rounded p-0.5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-brand-600)]"
            [attr.aria-label]="idx + ' de 5'"
            [attr.aria-checked]="idx === value()"
            (click)="onPick(idx)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              [attr.width]="size()"
              [attr.height]="size()"
              viewBox="0 0 24 24"
              [attr.fill]="idx <= value() ? 'var(--color-brand-500)' : 'transparent'"
              [attr.stroke]="
                idx <= value() ? 'var(--color-brand-500)' : 'var(--color-ink-300)'
              "
              stroke-width="1.5"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          </button>
        }
      }
      @if (showLabel()) {
        <span class="ml-1.5 text-sm text-[var(--color-ink-500)]">
          {{ value().toFixed(1) }}
          @if (totalReviews() !== null) {
            ({{ totalReviews() }})
          }
        </span>
      }
    </div>
  `,
})
export class StarRatingComponent {
  readonly value = input<number>(0);
  readonly size = input<number>(16);
  readonly readonly = input<boolean>(true);
  readonly showLabel = input<boolean>(false);
  readonly totalReviews = input<number | null>(null);

  readonly valueChange = output<number>();

  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly rounded = computed(() => Math.round(this.value()));

  protected readonly ariaLabel = computed(
    () =>
      this.readonly()
        ? `Calificación ${this.value().toFixed(1)} de 5`
        : 'Selecciona una calificación del 1 al 5',
  );

  onPick(value: number): void {
    if (this.readonly()) return;
    this.valueChange.emit(value);
  }
}
