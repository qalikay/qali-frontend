import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, of } from 'rxjs';

import { CatalogService } from '../../../core/services/catalog.service';
import { Categoria } from '../../../core/models/catalog.models';
import { RecipeService } from '../services/recipe.service';
import { Receta } from '../models/recipe.models';
import { RecipeCardComponent } from '../components/recipe-card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../../shared/icons/icon.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RecipeCardComponent,
    BadgeComponent,
    ButtonComponent,
    EmptyStateComponent,
    IconComponent,
    PageHeaderComponent,
    SkeletonComponent,
  ],
  template: `
    <app-page-header
      eyebrow="Catalogo"
      title="Recetas naturales"
      description="Descubre recetas validadas por expertos en medicina ancestral del Peru."
    />

    <section class="mx-auto max-w-6xl px-4 py-8">
      <div class="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside class="lg:sticky lg:top-20 lg:self-start space-y-6">
          <form [formGroup]="form" class="space-y-5">
            <div>
              <label class="label" for="search">Buscar</label>
              <div class="relative">
                <span
                  class="absolute inset-y-0 left-3 flex items-center text-[var(--color-ink-300)]"
                >
                  <app-icon name="search" [size]="16" />
                </span>
                <input
                  id="search"
                  class="input pl-9"
                  type="search"
                  placeholder="Muna, manzanilla..."
                  formControlName="q"
                  autocomplete="off"
                />
              </div>
            </div>

            <fieldset>
              <legend class="label">Categoria</legend>
              <div class="flex flex-col gap-1">
                <label class="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    formControlName="categoriaId"
                    [value]="null"
                    class="accent-[var(--color-brand-600)]"
                  />
                  Todas
                </label>
                @for (cat of categorias(); track cat.id) {
                  <label class="inline-flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      formControlName="categoriaId"
                      [value]="cat.id"
                      class="accent-[var(--color-brand-600)]"
                    />
                    {{ cat.nombre }}
                  </label>
                }
              </div>
            </fieldset>
          </form>
        </aside>

        <main>
          <div class="flex items-center justify-between mb-4 text-sm">
            <span class="text-[var(--color-ink-500)]">
              {{ recipes().length }} {{ recipes().length === 1 ? 'resultado' : 'resultados' }}
            </span>
            @if (activeCategoria(); as activeCat) {
              <app-badge tone="brand">
                {{ activeCat.nombre }}
                <button
                  type="button"
                  class="ml-1 -mr-1 hover:text-[var(--color-brand-900)]"
                  (click)="clearCategoria()"
                  aria-label="Quitar filtro"
                >
                  <app-icon name="x" [size]="12" />
                </button>
              </app-badge>
            }
          </div>

          @if (loading()) {
            <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                <div class="card p-4 space-y-3">
                  <app-skeleton width="100%" height="180px" />
                  <app-skeleton width="60%" height="0.75rem" />
                  <app-skeleton width="90%" height="1rem" />
                  <app-skeleton width="80%" height="0.875rem" />
                </div>
              }
            </div>
          } @else if (errorMessage()) {
            <app-empty-state
              icon="alert-circle"
              [title]="'No pudimos cargar las recetas'"
              [description]="errorMessage()!"
            >
              <app-button variant="outline" (click)="reload()">Reintentar</app-button>
            </app-empty-state>
          } @else if (recipes().length === 0) {
            <app-empty-state
              icon="search"
              title="Sin resultados"
              description="Ajusta los filtros o intenta con otra categoria."
            />
          } @else {
            <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              @for (r of recipes(); track r.id) {
                <app-recipe-card [recipe]="r" />
              }
            </div>
          }
        </main>
      </div>
    </section>
  `,
})
export class RecipesListPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly recipeService = inject(RecipeService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = this.fb.nonNullable.group({
    q: [''],
    categoriaId: this.fb.control<number | null>(null),
  });

  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly recipes = signal<Receta[]>([]);
  protected readonly loading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly activeCategoria = computed<Categoria | null>(() => {
    const id = this.form.controls.categoriaId.value;
    if (id === null) return null;
    return this.categorias().find((c) => c.id === id) ?? null;
  });

  ngOnInit(): void {
    this.catalogService
      .getCategorias()
      .pipe(catchError(() => of([] as Categoria[])))
      .subscribe((data) => this.categorias.set(data));

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((qp) => {
        const cat = qp.get('categoriaId');
        const q = qp.get('q') ?? '';
        this.form.patchValue(
          { q, categoriaId: cat ? Number(cat) : null },
          { emitEvent: false },
        );
        this.fetch();
      });

    this.form.controls.q.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((q) => this.applyFilters({ q: q || undefined }));

    this.form.controls.categoriaId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => this.applyFilters({ categoriaId: id ?? undefined }));
  }

  protected reload(): void {
    this.fetch();
  }

  protected clearCategoria(): void {
    this.form.controls.categoriaId.setValue(null);
  }

  private applyFilters(patch: { q?: string; categoriaId?: number }): void {
    const current = this.route.snapshot.queryParamMap;
    const q = patch.q !== undefined ? patch.q : (current.get('q') ?? undefined);
    const categoriaId =
      patch.categoriaId !== undefined
        ? patch.categoriaId
        : (current.get('categoriaId') ?? undefined);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: q || null,
        categoriaId: categoriaId || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  private fetch(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    const { q, categoriaId } = this.form.getRawValue();

    this.recipeService
      .list({ q: q || undefined, categoriaId: categoriaId ?? undefined })
      .pipe(
        catchError((err) => {
          this.errorMessage.set(this.extractMessage(err));
          this.loading.set(false);
          return of([] as Receta[]);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.recipes.set(data);
        this.loading.set(false);
      });
  }

  private extractMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'status' in err) {
      const status = (err as { status?: number }).status;
      if (status === 0) return 'No se pudo conectar al servidor. El backend esta corriendo?';
    }
    return 'Ocurrio un error al cargar las recetas. Intenta nuevamente.';
  }
}
