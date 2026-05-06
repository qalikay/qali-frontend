import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Insumo } from '../models/product.models';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { IconComponent } from '../../../shared/icons/icon.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink, BadgeComponent, IconComponent],
  template: `
    <a
      [routerLink]="['/products', product().id]"
      class="card overflow-hidden flex flex-col transition-shadow hover:shadow-sm"
    >
      <div class="relative aspect-[4/3] bg-[var(--color-surface-muted)]">
        @if (product().imagenUrl) {
          <img
            [src]="product().imagenUrl"
            [alt]="product().nombre"
            loading="lazy"
            class="h-full w-full object-cover"
          />
        } @else {
          <div
            class="flex h-full w-full items-center justify-center text-[var(--color-brand-200)]"
          >
            <app-icon name="package" [size]="48" />
          </div>
        }
        @if (product().tipo) {
          <div class="absolute top-2 left-2 flex gap-1">
            <app-badge tone="brand">{{ humanType() }}</app-badge>
          </div>
        }
        @if (esAgotado()) {
          <div class="absolute top-2 right-2">
            <app-badge tone="warning">Agotado</app-badge>
          </div>
        }
      </div>

      <div class="flex-1 p-4">
        <h3 class="text-base font-semibold text-[var(--color-ink-900)] line-clamp-2">
          {{ product().nombre }}
        </h3>
        @if (product().descripcion) {
          <p class="mt-1 text-sm text-[var(--color-ink-500)] line-clamp-2">
            {{ product().descripcion }}
          </p>
        }
      </div>

      <div
        class="px-4 py-3 border-t border-[var(--color-border)] flex items-center justify-between text-sm"
      >
        <div class="text-[var(--color-ink-500)] truncate flex items-center gap-1.5">
          <app-icon name="user" [size]="14" />
          <span class="truncate">{{ sellerName() }}</span>
        </div>
        <span class="font-semibold text-[var(--color-ink-900)]">
          @if ((product().precio ?? 0) > 0) {
            {{ product().precio | currency: 'PEN' : 'symbol-narrow' : '1.2-2' : 'es-PE' }}
          } @else {
            <span class="text-[var(--color-brand-700)]">Consultar</span>
          }
        </span>
      </div>
    </a>
  `,
})
export class ProductCardComponent {
  readonly product = input.required<Insumo>();

  protected readonly humanType = computed(() => {
    const t = this.product().tipo;
    return t ? t.charAt(0) + t.slice(1).toLowerCase() : '';
  });

  protected readonly esAgotado = computed(() => {
    const p = this.product();
    return p.estado === 'AGOTADO' || (p.stock !== undefined && p.stock <= 0);
  });

  protected readonly sellerName = computed(() => {
    const e = this.product().experto;
    if (!e) return 'Experto QaliKay';
    return `${e.nombres ?? ''} ${e.apellidos ?? ''}`.trim() || 'Experto QaliKay';
  });
}
