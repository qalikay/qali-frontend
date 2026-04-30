import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

import { CatalogService } from '../../core/services/catalog.service';
import { CategoryResponse } from '../../core/models/catalog.models';
import { RecipeService } from '../recipes/services/recipe.service';
import { RecipeSummary } from '../recipes/models/recipe.models';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/icons/icon.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { RecipeCardComponent } from '../recipes/components/recipe-card.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    SkeletonComponent,
    RecipeCardComponent,
  ],
  template: `
    <section class="relative overflow-hidden border-b border-[var(--color-border)]">
      <div
        class="absolute inset-0 bg-gradient-to-b from-[var(--color-brand-50)] to-white pointer-events-none"
        aria-hidden="true"
      ></div>
      <div class="relative mx-auto max-w-6xl px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <app-badge tone="brand">
            <app-icon name="leaf" [size]="13" />
            Plataforma certificada
          </app-badge>
          <h1 class="mt-4 text-4xl md:text-5xl leading-[1.1] tracking-tight">
            Sabiduría andina,
            <span class="text-[var(--color-brand-700)]">bienestar moderno.</span>
          </h1>
          <p class="mt-5 text-base md:text-lg text-[var(--color-ink-500)] max-w-xl">
            Recetas, insumos y consultas con expertos en medicina natural del Perú. Conocimiento
            ancestral, validado y al alcance de un click.
          </p>
          <div class="mt-7 flex flex-wrap items-center gap-3">
            <a routerLink="/recipes">
              <app-button size="lg">
                Explorar recetas
                <app-icon name="arrow-right" [size]="16" />
              </app-button>
            </a>
            <a routerLink="/register/experto">
              <app-button variant="outline" size="lg">Soy experto</app-button>
            </a>
          </div>

          <dl class="mt-10 grid grid-cols-3 gap-4 max-w-md">
            @for (kpi of kpis; track kpi.label) {
              <div>
                <dt class="text-xs uppercase tracking-wider text-[var(--color-ink-500)]">
                  {{ kpi.label }}
                </dt>
                <dd class="mt-1 text-xl font-semibold text-[var(--color-ink-900)]">
                  {{ kpi.value }}
                </dd>
              </div>
            }
          </dl>
        </div>

        <div class="grid grid-cols-2 gap-3">
          @if (loadingCategories()) {
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="card p-5 space-y-2">
                <app-skeleton width="40%" height="0.75rem" />
                <app-skeleton width="70%" height="1.25rem" />
                <app-skeleton width="100%" height="0.875rem" />
              </div>
            }
          } @else {
            @for (cat of featuredCategories(); track cat.id) {
              <a
                [routerLink]="['/recipes']"
                [queryParams]="{ categoryId: cat.id }"
                class="card p-5 hover:border-[var(--color-brand-300)] transition-colors group"
              >
                <div
                  class="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-700)]"
                >
                  {{ cat.name }}
                </div>
                <div class="mt-1 font-semibold text-[var(--color-ink-900)]">
                  {{ humanLabel(cat.name) }}
                </div>
                <p class="mt-1 text-sm text-[var(--color-ink-500)] line-clamp-2">
                  {{ cat.description ?? 'Categoría disponible en QaliKay.' }}
                </p>
                <div
                  class="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-brand-700)] opacity-0 group-hover:opacity-100 transition"
                >
                  Ver recetas <app-icon name="arrow-right" [size]="12" />
                </div>
              </a>
            }
          }
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-16">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl md:text-3xl">Recetas destacadas</h2>
          <p class="mt-1 text-[var(--color-ink-500)]">
            Selección de recetas publicadas por expertos verificados.
          </p>
        </div>
        <a
          routerLink="/recipes"
          class="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)]"
        >
          Ver todas <app-icon name="arrow-right" [size]="14" />
        </a>
      </div>

      <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @if (loadingRecipes()) {
          @for (i of [1, 2, 3]; track i) {
            <div class="card p-4 space-y-3">
              <app-skeleton width="100%" height="180px" />
              <app-skeleton width="60%" height="0.75rem" />
              <app-skeleton width="90%" height="1rem" />
              <app-skeleton width="80%" height="0.875rem" />
            </div>
          }
        } @else if (errorRecipes()) {
          <div class="col-span-full">
            <div class="card p-6 flex items-start gap-3">
              <span class="text-[var(--color-warning)]">
                <app-icon name="alert-circle" [size]="18" />
              </span>
              <div>
                <div class="font-medium text-[var(--color-ink-900)]">
                  No pudimos cargar las recetas
                </div>
                <p class="text-sm text-[var(--color-ink-500)]">
                  Verifica que el backend esté disponible en
                  <code class="rounded bg-[var(--color-surface-muted)] px-1.5 py-0.5 text-xs">
                    localhost:8080
                  </code>
                  y vuelve a intentar.
                </p>
              </div>
            </div>
          </div>
        } @else if (recipes().length === 0) {
          <div class="col-span-full">
            <div class="card p-8 text-center">
              <p class="text-[var(--color-ink-500)]">
                Aún no hay recetas publicadas. ¡Vuelve pronto!
              </p>
            </div>
          </div>
        } @else {
          @for (recipe of recipes(); track recipe.id) {
            <app-recipe-card [recipe]="recipe" />
          }
        }
      </div>
    </section>

    <section
      class="border-y border-[var(--color-border)] bg-[var(--color-surface-muted)]"
    >
      <div class="mx-auto max-w-6xl px-4 py-16">
        <h2 class="text-2xl md:text-3xl">Por qué QaliKay</h2>
        <p class="mt-2 text-[var(--color-ink-500)] max-w-2xl">
          Tres pilares que definen una experiencia profesional, segura y cercana.
        </p>
        <div class="mt-8 grid md:grid-cols-3 gap-4">
          @for (item of values; track item.title) {
            <div class="card p-6">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
              >
                <app-icon [name]="item.icon" [size]="20" />
              </div>
              <h3 class="mt-4 text-lg">{{ item.title }}</h3>
              <p class="mt-2 text-sm text-[var(--color-ink-500)]">{{ item.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-16 text-center">
      <h2 class="text-2xl md:text-3xl">¿Listo para comenzar tu camino?</h2>
      <p class="mt-2 text-[var(--color-ink-500)]">
        Crea tu cuenta gratis y descubre recetas con respaldo de expertos.
      </p>
      <div class="mt-6 flex items-center justify-center gap-3">
        <a routerLink="/register/cliente">
          <app-button size="lg">Crear cuenta</app-button>
        </a>
        <a routerLink="/login">
          <app-button variant="outline" size="lg">Ingresar</app-button>
        </a>
      </div>
    </section>
  `,
})
export class LandingPage implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly recipeService = inject(RecipeService);

  protected readonly categories = signal<CategoryResponse[]>([]);
  protected readonly loadingCategories = signal<boolean>(true);

  protected readonly recipes = signal<RecipeSummary[]>([]);
  protected readonly loadingRecipes = signal<boolean>(true);
  protected readonly errorRecipes = signal<boolean>(false);

  protected readonly featuredCategories = computed(() => this.categories().slice(0, 4));

  protected readonly kpis = [
    { label: 'Recetas', value: '+50' },
    { label: 'Expertos', value: '+12' },
    { label: 'Categorías', value: '8' },
  ];

  protected readonly values = [
    {
      icon: 'shield-check' as const,
      title: 'Expertos certificados',
      description:
        'Cada experto pasa por un proceso de validación de trayectoria y especialidad.',
    },
    {
      icon: 'book-open' as const,
      title: 'Recetas con respaldo',
      description:
        'Cada receta detalla ingredientes, preparación, uso y advertencias. Reseñas reales.',
    },
    {
      icon: 'message-circle' as const,
      title: 'Consultas privadas',
      description:
        'Conversa de forma directa con un experto y recibe orientación personalizada.',
    },
  ];

  ngOnInit(): void {
    this.catalogService
      .getCategories()
      .pipe(catchError(() => of([] as CategoryResponse[])))
      .subscribe((data) => {
        this.categories.set(data);
        this.loadingCategories.set(false);
      });

    this.recipeService
      .list({ size: 6, sort: 'createdAt,desc' })
      .pipe(
        catchError(() => {
          this.errorRecipes.set(true);
          return of(null);
        }),
      )
      .subscribe((page) => {
        if (page) this.recipes.set(page.content);
        this.loadingRecipes.set(false);
      });
  }

  protected humanLabel(name: string): string {
    if (!name) return '';
    return name.charAt(0) + name.slice(1).toLowerCase();
  }
}
