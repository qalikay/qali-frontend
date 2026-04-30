import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

import { RecipeService } from '../services/recipe.service';
import { RecipeResponse } from '../models/recipe.models';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../../shared/icons/icon.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    BadgeComponent,
    ButtonComponent,
    EmptyStateComponent,
    IconComponent,
    SkeletonComponent,
  ],
  template: `
    @if (loading()) {
      <section class="mx-auto max-w-5xl px-4 py-10 grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <div class="space-y-3">
          <app-skeleton width="40%" height="0.875rem" />
          <app-skeleton width="80%" height="2rem" />
          <app-skeleton width="100%" height="380px" />
        </div>
        <div class="space-y-3">
          <app-skeleton width="100%" height="200px" />
          <app-skeleton width="100%" height="120px" />
        </div>
      </section>
    } @else if (errorMessage()) {
      <section class="mx-auto max-w-3xl px-4 py-12">
        <app-empty-state
          icon="alert-circle"
          [title]="'No pudimos cargar la receta'"
          [description]="errorMessage()!"
        >
          <a routerLink="/recipes">
            <app-button variant="outline">Volver al catálogo</app-button>
          </a>
        </app-empty-state>
      </section>
    } @else if (recipe(); as r) {
      <section
        class="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]"
      >
        <div class="mx-auto max-w-5xl px-4 py-8">
          <a
            routerLink="/recipes"
            class="inline-flex items-center gap-1 text-sm text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]"
          >
            <app-icon name="arrow-left" [size]="14" /> Volver al catálogo
          </a>
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <app-badge tone="brand">{{ humanCategory(r.category.name) }}</app-badge>
            @if (r.preparationMinutes) {
              <app-badge tone="neutral">
                <app-icon name="clock" [size]="12" />
                {{ r.preparationMinutes }} min
              </app-badge>
            }
            <app-badge tone="info">
              <app-icon name="eye" [size]="12" />
              {{ r.views }} vistas
            </app-badge>
          </div>
          <h1 class="mt-3 text-3xl md:text-4xl">{{ r.title }}</h1>
          <p class="mt-2 text-[var(--color-ink-500)] max-w-3xl">{{ r.shortDescription }}</p>

          <div class="mt-5 flex items-center gap-3 text-sm">
            <span
              class="h-9 w-9 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-800)] flex items-center justify-center font-semibold"
              aria-hidden="true"
            >
              {{ authorInitials() }}
            </span>
            <div>
              <div class="font-medium text-[var(--color-ink-900)]">
                {{ r.author.firstName }} {{ r.author.lastName }}
              </div>
              <div class="text-xs text-[var(--color-ink-500)]">
                {{ r.author.specialty ?? 'Experto QaliKay' }} · Publicado
                {{ r.publishedAt ?? r.createdAt | date: 'mediumDate' : '' : 'es-PE' }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-5xl px-4 py-10 grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <article class="space-y-8">
          @if (r.imageUrl) {
            <div class="card overflow-hidden">
              <img
                [src]="r.imageUrl"
                [alt]="r.title"
                class="w-full aspect-[16/9] object-cover"
              />
            </div>
          } @else {
            <div
              class="card aspect-[16/9] flex items-center justify-center text-[var(--color-brand-200)]"
            >
              <app-icon name="leaf" [size]="64" />
            </div>
          }

          <div>
            <h2 class="text-xl">Ingredientes</h2>
            <p class="mt-2 text-[var(--color-ink-700)] whitespace-pre-line">
              {{ r.ingredients }}
            </p>
          </div>

          <div>
            <h2 class="text-xl">Preparación</h2>
            <p class="mt-2 text-[var(--color-ink-700)] whitespace-pre-line">
              {{ r.preparation }}
            </p>
          </div>

          @if (r.usage) {
            <div>
              <h2 class="text-xl">Uso recomendado</h2>
              <p class="mt-2 text-[var(--color-ink-700)] whitespace-pre-line">{{ r.usage }}</p>
            </div>
          }

          @if (r.warnings) {
            <div
              class="card p-5 bg-amber-50/40 border-amber-200"
              [style.borderColor]="'#fde68a'"
            >
              <div class="flex items-start gap-3">
                <span class="text-amber-700 mt-0.5">
                  <app-icon name="alert-circle" [size]="18" />
                </span>
                <div>
                  <h3 class="text-base font-semibold text-amber-900">Precauciones</h3>
                  <p class="mt-1 text-sm text-amber-900/90 whitespace-pre-line">
                    {{ r.warnings }}
                  </p>
                </div>
              </div>
            </div>
          }
        </article>

        <aside class="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div class="card p-5">
            <div class="text-xs uppercase tracking-wider text-[var(--color-ink-500)]">
              Precio
            </div>
            <div class="mt-1 text-3xl font-semibold text-[var(--color-ink-900)]">
              @if (r.price > 0) {
                {{ r.price | currency: 'PEN' : 'symbol-narrow' : '1.2-2' : 'es-PE' }}
              } @else {
                <span class="text-[var(--color-brand-700)]">Gratis</span>
              }
            </div>
            <div class="mt-4 space-y-2">
              <app-button [fullWidth]="true">
                <app-icon name="shopping-bag" [size]="16" />
                @if (r.price > 0) {
                  Comprar acceso
                } @else {
                  Guardar receta
                }
              </app-button>
              <a [routerLink]="['/experts', r.author.id]" class="block">
                <app-button variant="outline" [fullWidth]="true">
                  <app-icon name="message-circle" [size]="16" />
                  Consultar al experto
                </app-button>
              </a>
            </div>
          </div>

          <div class="card p-5">
            <h3 class="text-sm font-semibold text-[var(--color-ink-900)]">Información</h3>
            <dl class="mt-3 space-y-2 text-sm">
              <div class="flex items-center justify-between gap-3">
                <dt class="text-[var(--color-ink-500)]">Categoría</dt>
                <dd>{{ humanCategory(r.category.name) }}</dd>
              </div>
              @if (r.preparationMinutes) {
                <div class="flex items-center justify-between gap-3">
                  <dt class="text-[var(--color-ink-500)]">Tiempo</dt>
                  <dd>{{ r.preparationMinutes }} minutos</dd>
                </div>
              }
              <div class="flex items-center justify-between gap-3">
                <dt class="text-[var(--color-ink-500)]">Estado</dt>
                <dd>{{ humanCategory(r.status) }}</dd>
              </div>
              <div class="flex items-center justify-between gap-3">
                <dt class="text-[var(--color-ink-500)]">Vistas</dt>
                <dd>{{ r.views }}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    }
  `,
})
export class RecipeDetailPage implements OnInit {
  private readonly recipeService = inject(RecipeService);
  private readonly destroyRef = inject(DestroyRef);

  @Input() id!: string;

  protected readonly recipe = signal<RecipeResponse | null>(null);
  protected readonly loading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly authorInitials = computed(() => {
    const a = this.recipe()?.author;
    if (!a) return '';
    return ((a.firstName?.[0] ?? '') + (a.lastName?.[0] ?? '')).toUpperCase();
  });

  ngOnInit(): void {
    const recipeId = Number(this.id);
    if (!Number.isFinite(recipeId)) {
      this.errorMessage.set('Identificador de receta inválido.');
      this.loading.set(false);
      return;
    }
    this.recipeService
      .getById(recipeId)
      .pipe(
        catchError((err) => {
          const status = (err as { status?: number })?.status;
          if (status === 404) {
            this.errorMessage.set(
              'Esta receta no existe o aún no ha sido publicada por el experto.',
            );
          } else if (status === 0) {
            this.errorMessage.set(
              'No pudimos contactar al servidor. Verifica que el backend esté corriendo.',
            );
          } else {
            this.errorMessage.set('Ocurrió un error inesperado al cargar la receta.');
          }
          this.loading.set(false);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        if (data) this.recipe.set(data);
        this.loading.set(false);
      });
  }

  protected humanCategory(name: string): string {
    if (!name) return '';
    return name.charAt(0) + name.slice(1).toLowerCase();
  }
}
