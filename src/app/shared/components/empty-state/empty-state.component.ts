import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IconComponent, IconName } from '../../icons/icon.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="flex flex-col items-center justify-center py-16 text-center">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
      >
        <app-icon [name]="icon()" [size]="22" />
      </div>
      <h3 class="mt-4 text-base font-semibold text-[var(--color-ink-900)]">{{ title() }}</h3>
      @if (description()) {
        <p class="mt-1 max-w-sm text-sm text-[var(--color-ink-500)]">{{ description() }}</p>
      }
      <div class="mt-4">
        <ng-content />
      </div>
    </div>
  `,
})
export class EmptyStateComponent {
  readonly icon = input<IconName>('info');
  readonly title = input.required<string>();
  readonly description = input<string>('');
}
