import { Injectable, signal } from '@angular/core';

export type ToastTone = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly toasts = signal<Toast[]>([]);

  readonly all = this.toasts.asReadonly();

  show(tone: ToastTone, title: string, description?: string, durationMs = 3500): number {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, tone, title, description }]);
    if (typeof window !== 'undefined' && durationMs > 0) {
      window.setTimeout(() => this.dismiss(id), durationMs);
    }
    return id;
  }

  success(title: string, description?: string): number {
    return this.show('success', title, description);
  }

  error(title: string, description?: string): number {
    return this.show('error', title, description, 5000);
  }

  info(title: string, description?: string): number {
    return this.show('info', title, description);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
