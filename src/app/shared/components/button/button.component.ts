import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'subtle' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      [class]="classes()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading() ? 'true' : null"
    >
      @if (loading()) {
        <span
          class="inline-block h-3.5 w-3.5 rounded-full border-2 border-current border-r-transparent animate-spin"
          aria-hidden="true"
        ></span>
      }
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);

  protected readonly classes = computed(() => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2';
    const sizeMap: Record<ButtonSize, string> = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-5 text-base',
    };
    const variantMap: Record<ButtonVariant, string> = {
      primary:
        'bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)] focus-visible:outline-[var(--color-brand-600)]',
      outline:
        'border border-[var(--color-border)] bg-white text-[var(--color-ink-700)] hover:bg-[var(--color-surface-muted)] focus-visible:outline-[var(--color-brand-600)]',
      ghost:
        'bg-transparent text-[var(--color-ink-700)] hover:bg-[var(--color-surface-muted)] focus-visible:outline-[var(--color-brand-600)]',
      subtle:
        'bg-[var(--color-brand-50)] text-[var(--color-brand-800)] hover:bg-[var(--color-brand-100)] focus-visible:outline-[var(--color-brand-600)]',
      danger: 'bg-[var(--color-danger)] text-white hover:opacity-90',
    };
    return `${base} ${sizeMap[this.size()]} ${variantMap[this.variant()]} ${this.fullWidth() ? 'w-full' : ''}`;
  });
}
