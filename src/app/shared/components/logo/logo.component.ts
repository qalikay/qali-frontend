import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="inline-flex items-center gap-2 font-semibold tracking-tight">
      <svg
        [attr.width]="size()"
        [attr.height]="size()"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M16 3 C9 8 6 14 6 19 a10 10 0 0 0 20 0 c0-5-3-11-10-16Z"
          fill="var(--color-brand-600)"
        />
        <path
          d="M16 12 v14 M11 17 q5 -2 5 -5 M21 17 q-5 -2 -5 -5"
          stroke="white"
          stroke-width="1.4"
          stroke-linecap="round"
          fill="none"
        />
      </svg>
      <span class="text-[var(--color-ink-900)]">{{ label() }}</span>
    </span>
  `,
})
export class LogoComponent {
  readonly size = input(28);
  readonly label = input('QaliKay');
}
