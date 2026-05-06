import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Receta } from '../models/recipe.models';
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
        @if (recipe().imagenUrl) {
          <img
            [src]="recipe().imagenUrl"
            [alt]="recipe().titulo"
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
        @if (categoria()) {
          <div class="absolute top-2 left-2">
            <app-badge tone="brand">{{ categoria() }}</app-badge>
          </div>
        }
        @if (esBorrador()) {
          <div class="absolute top-2 right-2">
            <app-badge tone="warning">Borrador</app-badge>
          </div>
        }
      </div>

      <div class="flex-1 p-4">
        <h3 class="text-base font-semibold text-[var(--color-ink-900)] line-clamp-2">
          {{ recipe().titulo }}
        </h3>
        <p class="mt-1 text-sm text-[var(--color-ink-500)] line-clamp-2">
          {{ recipe().descripcion }}
        </p>
      </div>

      <div
        class="px-4 py-3 border-t border-[var(--color-border)] flex items-center justify-between text-sm"
      >
        <div class="text-[var(--color-ink-500)] truncate flex items-center gap-1.5">
          <app-icon name="user" [size]="14" />
          <span class="truncate">{{ autorNombre() }}</span>
        </div>
        <div>
          <span class="font-semibold text-[var(--color-ink-900)]">
            @if ((recipe().precio ?? 0) > 0) {
              {{ recipe().precio | currency: 'PEN' : 'symbol-narrow' : '1.2-2' : 'es-PE' }}
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
  readonly recipe = input.required<Receta>();

  protected readonly categoria = computed(() => this.recipe().categoria?.nombre ?? '');
  protected readonly autorNombre = computed(() => {
    const e = this.recipe().experto;
    if (!e) return 'Experto QaliKay';
    return `${e.nombres ?? ''} ${e.apellidos ?? ''}`.trim() || 'Experto QaliKay';
  });
  protected readonly esBorrador = computed(() => this.recipe().estado === 'BORRADOR');
}
