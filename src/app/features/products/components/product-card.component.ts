import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductSummary } from '../models/product.models';
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
        @if (product().imageUrl) {
          <img
            [src]="product().imageUrl"
            [alt]="product().name"
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
        <div class="absolute top-2 left-2 flex gap-1">
          <app-badge tone="brand">{{ humanType() }}</app-badge>
        </div>
        @if (product().stock <= 0) {
          <div class="absolute top-2 right-2">
            <app-badge tone="warning">Agotado</app-badge>
          </div>
        }
      </div>

      <div class="flex-1 p-4">
        <h3 class="text-base font-semibold text-[var(--color-ink-900)] line-clamp-2">
          {{ product().name }}
        </h3>
        <p class="mt-1 text-sm text-[var(--color-ink-500)] line-clamp-2">
          {{ product().shortDescription }}
        </p>
      </div>

      <div
        class="px-4 py-3 border-t border-[var(--color-border)] flex items-center justify-between text-sm"
      >
        <div class="text-[var(--color-ink-500)] truncate flex items-center gap-1.5">
          <app-icon name="user" [size]="14" />
          <span class="truncate">{{ product().sellerFullName }}</span>
        </div>
        <span class="font-semibold text-[var(--color-ink-900)]">
          {{ product().price | currency: 'PEN' : 'symbol-narrow' : '1.2-2' : 'es-PE' }}
        </span>
      </div>
    </a>
  `,
})
export class ProductCardComponent {
  readonly product = input.required<ProductSummary>();

  protected readonly humanType = computed(() => {
    const t = this.product().type;
    return t ? t.charAt(0) + t.slice(1).toLowerCase() : '';
  });
}
