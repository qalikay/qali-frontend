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
import { ProductService } from '../services/product.service';
import { ProductSummary, TipoInsumo } from '../models/product.models';
import { ProductCardComponent } from '../components/product-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../../shared/icons/icon.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

const TYPE_OPTIONS: TipoInsumo[] = [
  'HOJAS',
  'RAIZ',
  'FLOR',
  'FRUTO',
  'SEMILLA',
  'CORTEZA',
  'ACEITE',
  'MIEL',
  'EXTRACTO',
  'POLVO',
  'OTRO',
];

@Component({
  selector: 'app-products-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ProductCardComponent,
    ButtonComponent,
    EmptyStateComponent,
    IconComponent,
    PageHeaderComponent,
    SkeletonComponent,
  ],
  template: `
    <app-page-header
      eyebrow="Catálogo"
      title="Insumos naturales"
      description="Hojas, raíces, mieles y aceites cosechados con respeto por la tradición."
    />

    <section class="mx-auto max-w-6xl px-4 py-8">
      <div class="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside class="lg:sticky lg:top-20 lg:self-start space-y-6">
          <form [formGroup]="form" class="space-y-5">
            <div>
              <label class="label" for="prod-search">Buscar</label>
              <div class="relative">
                <span
                  class="absolute inset-y-0 left-3 flex items-center text-[var(--color-ink-300)]"
                >
                  <app-icon name="search" [size]="16" />
                </span>
                <input
                  id="prod-search"
                  class="input pl-9"
                  type="search"
                  placeholder="Muña, kion, aceite..."
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
                    {{ humanLabel(cat.name) }}
                  </label>
                }
              </div>
            </fieldset>

            <fieldset>
              <legend class="label">Tipo</legend>
              <div class="flex flex-wrap gap-1.5">
                @for (t of types; track t) {
                  <label
                    class="inline-flex items-center cursor-pointer text-xs font-medium rounded-full border px-2.5 py-1 transition-colors"
                    [style.backgroundColor]="
                      form.controls.type.value === t
                        ? 'var(--color-brand-50)'
                        : 'transparent'
                    "
                    [style.borderColor]="
                      form.controls.type.value === t
                        ? 'var(--color-brand-300)'
                        : 'var(--color-border)'
                    "
                    [style.color]="
                      form.controls.type.value === t
                        ? 'var(--color-brand-800)'
                        : 'var(--color-ink-700)'
                    "
                  >
                    <input type="radio" formControlName="type" [value]="t" class="hidden" />
                    {{ humanLabel(t) }}
                  </label>
                }
                @if (form.controls.type.value) {
                  <button
                    type="button"
                    class="text-xs text-[var(--color-ink-500)] underline"
                    (click)="clearType()"
                  >
                    Limpiar
                  </button>
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
          </div>

          @if (loading()) {
            <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                <div class="card p-4 space-y-3">
                  <app-skeleton width="100%" height="180px" />
                  <app-skeleton width="60%" height="0.75rem" />
                  <app-skeleton width="90%" height="1rem" />
                </div>
              }
            </div>
          } @else if (errorMessage()) {
            <app-empty-state
              icon="alert-circle"
              [title]="'No pudimos cargar los insumos'"
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
              @for (p of page()!.content; track p.id) {
                <app-product-card [product]="p" />
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
export class ProductsListPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = this.fb.nonNullable.group({
    q: [''],
    categoryId: this.fb.control<number | null>(null),
    type: this.fb.control<TipoInsumo | null>(null),
  });

  protected readonly categories = signal<CategoryResponse[]>([]);
  protected readonly page = signal<PageResponse<ProductSummary> | null>(null);
  protected readonly loading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);
  private readonly currentPage = signal<number>(0);

  protected readonly types = TYPE_OPTIONS;

  ngOnInit(): void {
    this.catalogService
      .getCategories()
      .pipe(catchError(() => of([] as CategoryResponse[])))
      .subscribe((data) => this.categories.set(data));

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((qp) => {
        const cat = qp.get('categoryId');
        const type = qp.get('type') as TipoInsumo | null;
        const q = qp.get('q') ?? '';
        const pageParam = qp.get('page');
        this.form.patchValue(
          {
            q,
            categoryId: cat ? Number(cat) : null,
            type,
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

    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((t) => this.applyFilters({ type: t ?? undefined, page: 0 }));
  }

  protected reload(): void {
    this.fetch();
  }

  protected clearType(): void {
    this.form.controls.type.setValue(null);
  }

  protected goPrev(): void {
    this.applyFilters({ page: Math.max(0, this.currentPage() - 1) });
  }

  protected goNext(): void {
    this.applyFilters({ page: this.currentPage() + 1 });
  }

  protected humanLabel(name: string): string {
    if (!name) return '';
    return name.charAt(0) + name.slice(1).toLowerCase();
  }

  private applyFilters(patch: {
    q?: string;
    categoryId?: number;
    type?: TipoInsumo;
    page?: number;
  }): void {
    const current = this.route.snapshot.queryParamMap;
    const q = patch.q !== undefined ? patch.q : (current.get('q') ?? undefined);
    const categoryId =
      patch.categoryId !== undefined ? patch.categoryId : current.get('categoryId') ?? undefined;
    const type = patch.type !== undefined ? patch.type : current.get('type') ?? undefined;
    const page = patch.page ?? 0;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: q || null,
        categoryId: categoryId || null,
        type: type || null,
        page: page > 0 ? page : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  private fetch(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    const { q, categoryId, type } = this.form.getRawValue();

    this.productService
      .list({
        q: q || undefined,
        categoryId: categoryId ?? undefined,
        type: type ?? undefined,
        page: this.currentPage(),
        size: 9,
        sort: 'createdAt,desc',
      })
      .pipe(
        catchError((err) => {
          const status = (err as { status?: number })?.status;
          this.errorMessage.set(
            status === 0
              ? 'No se pudo conectar al servidor. ¿El backend está corriendo?'
              : 'Ocurrió un error al cargar los insumos. Intenta nuevamente.',
          );
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
}
