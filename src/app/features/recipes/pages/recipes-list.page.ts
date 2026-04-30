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
import { CategoryResponse } from '../../../core/models/catalog.models';
import { PageResponse } from '../../../core/models/api.models';
import { RecipeService } from '../services/recipe.service';
import { RecipeSummary } from '../models/recipe.models';
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
      eyebrow="Catálogo"
      title="Recetas naturales"
      description="Descubre recetas validadas por expertos en medicina ancestral del Perú."
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
                  placeholder="Muña, manzanilla..."
                  formControlName="q"
                  autocomplete="off"
                />
              </div>
            </div>

            <fieldset>
              <legend class="label">Categoría</legend>
              <div class="flex flex-col gap-1">
                <label class="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    formControlName="categoryId"
                    [value]="null"
                    class="accent-[var(--color-brand-600)]"
                  />
                  Todas
                </label>
                @for (cat of categories(); track cat.id) {
                  <label class="inline-flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      formControlName="categoryId"
                      [value]="cat.id"
                      class="accent-[var(--color-brand-600)]"
                    />
                    {{ humanCategory(cat.name) }}
                  </label>
                }
              </div>
            </fieldset>
          </form>
        </aside>

        <main>
          <div class="flex items-center justify-between mb-4 text-sm">
            <span class="text-[var(--color-ink-500)]">
              @if (page()) {
                {{ page()!.totalElements }} resultados
              }
            </span>
            @if (activeCategory(); as activeCat) {
              <app-badge tone="brand">
                {{ humanCategory(activeCat.name) }}
                <button
                  type="button"
                  class="ml-1 -mr-1 hover:text-[var(--color-brand-900)]"
                  (click)="clearCategory()"
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
          } @else if ((page()?.content?.length ?? 0) === 0) {
            <app-empty-state
              icon="search"
              title="Sin resultados"
              description="Ajusta los filtros o intenta con otra categoría."
            />
          } @else {
            <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              @for (r of page()!.content; track r.id) {
                <app-recipe-card [recipe]="r" />
              }
            </div>

            @if ((page()?.totalPages ?? 0) > 1) {
              <nav
                class="mt-8 flex items-center justify-between border-t border-[var(--color-border)] pt-5"
                aria-label="Paginación"
              >
                <app-button
                  variant="outline"
                  size="sm"
                  [disabled]="page()!.first"
                  (click)="goPrev()"
                >
                  <app-icon name="arrow-left" [size]="14" />
                  Anterior
                </app-button>
                <span class="text-sm text-[var(--color-ink-500)]">
                  Página {{ page()!.number + 1 }} de {{ page()!.totalPages }}
                </span>
                <app-button
                  variant="outline"
                  size="sm"
                  [disabled]="page()!.last"
                  (click)="goNext()"
                >
                  Siguiente
                  <app-icon name="arrow-right" [size]="14" />
                </app-button>
              </nav>
            }
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
    categoryId: this.fb.control<number | null>(null),
  });

  protected readonly categories = signal<CategoryResponse[]>([]);
  protected readonly page = signal<PageResponse<RecipeSummary> | null>(null);
  protected readonly loading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);
  private readonly currentPage = signal<number>(0);

  protected readonly activeCategory = computed<CategoryResponse | null>(() => {
    const id = this.form.controls.categoryId.value;
    if (id === null) return null;
    return this.categories().find((c) => c.id === id) ?? null;
  });

  ngOnInit(): void {
    this.catalogService
      .getCategories()
      .pipe(catchError(() => of([] as CategoryResponse[])))
      .subscribe((data) => this.categories.set(data));

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((qp) => {
        const cat = qp.get('categoryId');
        const q = qp.get('q') ?? '';
        const pageParam = qp.get('page');
        this.form.patchValue(
          {
            q,
            categoryId: cat ? Number(cat) : null,
          },
          { emitEvent: false },
        );
        this.currentPage.set(pageParam ? Number(pageParam) : 0);
        this.fetch();
      });

    this.form.controls.q.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((q) => this.applyFilters({ q: q || undefined, page: 0 }));

    this.form.controls.categoryId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => this.applyFilters({ categoryId: id ?? undefined, page: 0 }));
  }

  protected reload(): void {
    this.fetch();
  }

  protected clearCategory(): void {
    this.form.controls.categoryId.setValue(null);
  }

  protected goPrev(): void {
    this.applyFilters({ page: Math.max(0, this.currentPage() - 1) });
  }

  protected goNext(): void {
    this.applyFilters({ page: this.currentPage() + 1 });
  }

  protected humanCategory(name: string): string {
    if (!name) return '';
    return name.charAt(0) + name.slice(1).toLowerCase();
  }

  private applyFilters(patch: { q?: string; categoryId?: number; page?: number }): void {
    const current = this.route.snapshot.queryParamMap;
    const q = patch.q !== undefined ? patch.q : (current.get('q') ?? undefined);
    const categoryId =
      patch.categoryId !== undefined ? patch.categoryId : current.get('categoryId') ?? undefined;
    const page = patch.page ?? 0;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: q || null,
        categoryId: categoryId || null,
        page: page > 0 ? page : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  private fetch(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    const { q, categoryId } = this.form.getRawValue();

    this.recipeService
      .list({
        q: q || undefined,
        categoryId: categoryId ?? undefined,
        page: this.currentPage(),
        size: 9,
        sort: 'createdAt,desc',
      })
      .pipe(
        catchError((err) => {
          this.errorMessage.set(this.extractMessage(err));
          this.loading.set(false);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((page) => {
        if (page) this.page.set(page);
        this.loading.set(false);
      });
  }

  private extractMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'status' in err) {
      const status = (err as { status?: number }).status;
      if (status === 0) return 'No se pudo conectar al servidor. ¿El backend está corriendo?';
    }
    return 'Ocurrió un error al cargar las recetas. Intenta nuevamente.';
  }
}
