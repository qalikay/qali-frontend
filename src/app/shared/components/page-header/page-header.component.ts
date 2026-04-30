import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="border-b border-[var(--color-border)] bg-white">
      <div class="mx-auto max-w-6xl px-4 py-8 md:py-10">
        @if (eyebrow()) {
          <div
            class="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-700)]"
          >
            {{ eyebrow() }}
          </div>
        }
        <div class="mt-2 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 class="text-2xl md:text-3xl">{{ title() }}</h1>
            @if (description()) {
              <p class="mt-1 text-sm md:text-base text-[var(--color-ink-500)] max-w-2xl">
                {{ description() }}
              </p>
            }
          </div>
          <div class="flex items-center gap-2">
            <ng-content select="[actions]" />
          </div>
        </div>
        <ng-content />
      </div>
    </header>
  `,
})
export class PageHeaderComponent {
  readonly eyebrow = input<string>('');
  readonly title = input.required<string>();
  readonly description = input<string>('');
}
