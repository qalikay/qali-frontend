import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { RecipeSummary } from '../models/recipe.models';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { IconComponent } from '../../../shared/icons/icon.component';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink, BadgeComponent, IconComponent],
  template: `
    <a
      [routerLink]="['/recipes', recipe().id]"
      class="card overflow-hidden flex flex-col transition-shadow hover:shadow-sm"
    >
      <div class="relative aspect-[4/3] bg-[var(--color-surface-muted)]">
        @if (recipe().imageUrl) {
          <img
            [src]="recipe().imageUrl"
            [alt]="recipe().title"
            loading="lazy"
            class="h-full w-full object-cover"
          />
        } @else {
          <div
            class="flex h-full w-full items-center justify-center text-[var(--color-brand-200)]"
          >
            <app-icon name="leaf" [size]="48" />
          </div>
        }
        <div class="absolute top-2 left-2">
          <app-badge tone="brand">{{ humanCategory() }}</app-badge>
        </div>
      </div>

      <div class="flex-1 p-4">
        <h3 class="text-base font-semibold text-[var(--color-ink-900)] line-clamp-2">
          {{ recipe().title }}
        </h3>
        <p class="mt-1 text-sm text-[var(--color-ink-500)] line-clamp-2">
          {{ recipe().shortDescription }}
        </p>
      </div>

      <div
        class="px-4 py-3 border-t border-[var(--color-border)] flex items-center justify-between text-sm"
      >
        <div class="text-[var(--color-ink-500)] truncate flex items-center gap-1.5">
          <app-icon name="user" [size]="14" />
          <span class="truncate">{{ recipe().authorFullName }}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center gap-1 text-[var(--color-ink-500)] text-xs">
            <app-icon name="eye" [size]="13" />
            {{ recipe().views }}
          </span>
          <span class="font-semibold text-[var(--color-ink-900)]">
            @if (recipe().price > 0) {
              {{ recipe().price | currency: 'PEN' : 'symbol-narrow' : '1.2-2' : 'es-PE' }}
            } @else {
              <span class="text-[var(--color-brand-700)]">Gratis</span>
            }
          </span>
        </div>
      </div>
    </a>
  `,
})
export class RecipeCardComponent {
  readonly recipe = input.required<RecipeSummary>();

  protected readonly humanCategory = computed(() => {
    const name = this.recipe().categoryName ?? '';
    return name ? name.charAt(0) + name.slice(1).toLowerCase() : '';
  });
}
