import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { IconComponent, IconName } from '../../icons/icon.component';
import { ToastService, ToastTone } from '../../services/toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div
      class="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4 md:items-end md:right-4 md:left-auto"
    >
      @for (toast of toasts(); track toast.id) {
        <div
          class="pointer-events-auto card w-full max-w-sm flex items-start gap-3 p-4 shadow-sm border-l-4"
          [style.borderLeftColor]="colorFor(toast.tone)"
          role="status"
        >
          <span class="mt-0.5" [style.color]="colorFor(toast.tone)">
            <app-icon [name]="toneIcon(toast.tone)" [size]="18" />
          </span>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-[var(--color-ink-900)]">{{ toast.title }}</div>
            @if (toast.description) {
              <div class="mt-0.5 text-sm text-[var(--color-ink-500)]">{{ toast.description }}</div>
            }
          </div>
          <button
            type="button"
            class="text-[var(--color-ink-300)] hover:text-[var(--color-ink-700)]"
            (click)="dismiss(toast.id)"
            aria-label="Cerrar"
          >
            <app-icon name="x" [size]="16" />
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastHostComponent {
  private readonly toastService = inject(ToastService);
  protected readonly toasts = this.toastService.all;

  protected toneIcon(tone: ToastTone): IconName {
    if (tone === 'success') return 'check-circle';
    if (tone === 'error') return 'alert-circle';
    return 'info';
  }

  protected dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  protected colorFor(tone: ToastTone): string {
    if (tone === 'success') return 'var(--color-success)';
    if (tone === 'error') return 'var(--color-danger)';
    return 'var(--color-brand-700)';
  }
}
