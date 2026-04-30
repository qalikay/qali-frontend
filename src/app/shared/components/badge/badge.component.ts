import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeTone = 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="classes()">
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('neutral');

  protected readonly classes = computed(() => {
    const base =
      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border';
    const toneMap: Record<BadgeTone, string> = {
      brand:
        'bg-[var(--color-brand-50)] text-[var(--color-brand-800)] border-[var(--color-brand-200)]',
      neutral: 'bg-[var(--color-surface-muted)] text-[var(--color-ink-700)] border-[var(--color-border)]',
      success: 'bg-[var(--color-brand-50)] text-[var(--color-success)] border-[var(--color-brand-200)]',
      warning: 'bg-amber-50 text-amber-800 border-amber-200',
      danger: 'bg-red-50 text-red-700 border-red-200',
      info: 'bg-slate-50 text-slate-700 border-slate-200',
    };
    return `${base} ${toneMap[this.tone()]}`;
  });
}
