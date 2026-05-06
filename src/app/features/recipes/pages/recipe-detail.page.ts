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
import { Receta } from '../models/recipe.models';
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
            <app-button variant="outline">Volver al catalogo</app-button>
          </a>
        </app-empty-state>
      </section>
    } @else if (recipe(); as r) {
      <section class="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div class="mx-auto max-w-5xl px-4 py-8">
          <a
            routerLink="/recipes"
            class="inline-flex items-center gap-1 text-sm text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]"
          >
            <app-icon name="arrow-left" [size]="14" /> Volver al catalogo
          </a>
          <div class="mt-4 flex flex-wrap items-center gap-2">
            @if (r.categoria?.nombre) {
              <app-badge tone="brand">{{ r.categoria!.nombre }}</app-badge>
            }
            @if (r.minutosPreparacion) {
              <app-badge tone="neutral">
                <app-icon name="clock" [size]="12" />
                {{ r.minutosPreparacion }} min
              </app-badge>
            }
          </div>
          <h1 class="mt-3 text-3xl md:text-4xl">{{ r.titulo }}</h1>
          <p class="mt-2 text-[var(--color-ink-500)] max-w-3xl">{{ r.descripcion }}</p>

          <div class="mt-5 flex items-center gap-3 text-sm">
            <span
              class="h-9 w-9 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-800)] flex items-center justify-center font-semibold"
              aria-hidden="true"
            >
              {{ authorInitials() }}
            </span>
            <div>
              <div class="font-medium text-[var(--color-ink-900)]">{{ authorName() }}</div>
              <div class="text-xs text-[var(--color-ink-500)]">
                {{ r.experto?.especialidad?.nombre ?? 'Experto QaliKay' }}
                @if (r.fechaCreacion) {
                  · Publicado {{ r.fechaCreacion | date: 'mediumDate' : '' : 'es-PE' }}
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-5xl px-4 py-10 grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <article class="space-y-8">
          @if (r.imagenUrl) {
            <div class="card overflow-hidden">
              <img
                [src]="r.imagenUrl"
                [alt]="r.titulo"
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

          @if (r.ingredientes) {
            <div>
              <h2 class="text-xl">Ingredientes</h2>
              <p class="mt-2 text-[var(--color-ink-700)] whitespace-pre-line">
                {{ r.ingredientes }}
              </p>
            </div>
          }

          @if (r.preparacion) {
            <div>
              <h2 class="text-xl">Preparacion</h2>
              <p class="mt-2 text-[var(--color-ink-700)] whitespace-pre-line">
                {{ r.preparacion }}
              </p>
            </div>
          }

          @if (r.advertencias) {
            <div class="card p-5 bg-amber-50/40 border-amber-200" [style.borderColor]="'#fde68a'">
              <div class="flex items-start gap-3">
                <span class="text-amber-700 mt-0.5">
                  <app-icon name="alert-circle" [size]="18" />
                </span>
                <div>
                  <h3 class="text-base font-semibold text-amber-900">Precauciones</h3>
                  <p class="mt-1 text-sm text-amber-900/90 whitespace-pre-line">
                    {{ r.advertencias }}
                  </p>
                </div>
              </div>
            </div>
          }
        </article>

        <aside class="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div class="card p-5">
            <div class="text-xs uppercase tracking-wider text-[var(--color-ink-500)]">Precio</div>
            <div class="mt-1 text-3xl font-semibold text-[var(--color-ink-900)]">
              @if ((r.precio ?? 0) > 0) {
                {{ r.precio | currency: 'PEN' : 'symbol-narrow' : '1.2-2' : 'es-PE' }}
              } @else {
                <span class="text-[var(--color-brand-700)]">Gratis</span>
              }
            </div>
            <div class="mt-4 space-y-2">
              <app-button [fullWidth]="true">
                <app-icon name="shopping-bag" [size]="16" />
                @if ((r.precio ?? 0) > 0) {
                  Comprar acceso
                } @else {
                  Guardar receta
                }
              </app-button>
            </div>
          </div>

          <div class="card p-5">
            <h3 class="text-sm font-semibold text-[var(--color-ink-900)]">Informacion</h3>
            <dl class="mt-3 space-y-2 text-sm">
              @if (r.categoria?.nombre) {
                <div class="flex items-center justify-between gap-3">
                  <dt class="text-[var(--color-ink-500)]">Categoria</dt>
                  <dd>{{ r.categoria!.nombre }}</dd>
                </div>
              }
              @if (r.minutosPreparacion) {
                <div class="flex items-center justify-between gap-3">
                  <dt class="text-[var(--color-ink-500)]">Tiempo</dt>
                  <dd>{{ r.minutosPreparacion }} minutos</dd>
                </div>
              }
              <div class="flex items-center justify-between gap-3">
                <dt class="text-[var(--color-ink-500)]">Estado</dt>
                <dd>{{ r.estado }}</dd>
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

  protected readonly recipe = signal<Receta | null>(null);
  protected readonly loading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly authorInitials = computed(() => {
    const a = this.recipe()?.experto;
    if (!a) return 'Q';
    return ((a.nombres?.[0] ?? '') + (a.apellidos?.[0] ?? '')).toUpperCase() || 'Q';
  });

  protected readonly authorName = computed(() => {
    const a = this.recipe()?.experto;
    if (!a) return 'Experto QaliKay';
    return `${a.nombres ?? ''} ${a.apellidos ?? ''}`.trim() || 'Experto QaliKay';
  });

  ngOnInit(): void {
    const recipeId = Number(this.id);
    if (!Number.isFinite(recipeId)) {
      this.errorMessage.set('Identificador de receta invalido.');
      this.loading.set(false);
      return;
    }
    this.recipeService
      .getById(recipeId)
      .pipe(
        catchError((err) => {
          const status = (err as { status?: number })?.status;
          if (status === 404) {
            this.errorMessage.set('Esta receta no existe o aun no ha sido publicada.');
          } else if (status === 0) {
            this.errorMessage.set(
              'No pudimos contactar al servidor. Verifica que el backend este corriendo.',
            );
          } else {
            this.errorMessage.set('Ocurrio un error inesperado al cargar la receta.');
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
}
