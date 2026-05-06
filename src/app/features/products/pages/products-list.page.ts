import {
  ChangeDetectionStrategy,
  Component,
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
import { ProductService } from '../services/product.service';
import { Insumo, TipoInsumo, TIPOS_INSUMO } from '../models/product.models';
import { ProductCardComponent } from '../components/product-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../../shared/icons/icon.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

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
      eyebrow="Catalogo"
      title="Insumos naturales"
      description="Hierbas, aceites, extractos y polvos seleccionados por nuestros expertos."
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
                  placeholder="Muna, kion, aceite..."
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

            <fieldset>
              <legend class="label">Tipo</legend>
              <div class="flex flex-wrap gap-1.5">
                @for (t of tipos; track t) {
                  <label
                    class="inline-flex items-center cursor-pointer text-xs font-medium rounded-full border px-2.5 py-1 transition-colors"
                    [style.backgroundColor]="
                      form.controls.tipo.value === t
                        ? 'var(--color-brand-50)'
                        : 'transparent'
                    "
                    [style.borderColor]="
                      form.controls.tipo.value === t
                        ? 'var(--color-brand-300)'
                        : 'var(--color-border)'
                    "
                    [style.color]="
                      form.controls.tipo.value === t
                        ? 'var(--color-brand-800)'
                        : 'var(--color-ink-700)'
                    "
                  >
                    <input type="radio" formControlName="tipo" [value]="t" class="hidden" />
                    {{ humanLabel(t) }}
                  </label>
                }
                @if (form.controls.tipo.value) {
                  <button
                    type="button"
                    class="text-xs text-[var(--color-ink-500)] underline"
                    (click)="clearTipo()"
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
              {{ insumos().length }} resultados
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
          } @else if (insumos().length === 0) {
            <app-empty-state
              icon="search"
              title="Sin resultados"
              description="Ajusta los filtros o intenta con otra categoria."
            />
          } @else {
            <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              @for (p of insumos(); track p.id) {
                <app-product-card [product]="p" />
              }
            </div>
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
    categoriaId: this.fb.control<number | null>(null),
    tipo: this.fb.control<TipoInsumo | null>(null),
  });

  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly insumos = signal<Insumo[]>([]);
  protected readonly loading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly tipos = TIPOS_INSUMO;

  ngOnInit(): void {
    this.catalogService
      .getCategorias()
      .pipe(catchError(() => of([] as Categoria[])))
      .subscribe((data) => this.categorias.set(data));

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((qp) => {
        const cat = qp.get('categoriaId');
        const tipo = qp.get('tipo') as TipoInsumo | null;
        const q = qp.get('q') ?? '';
        this.form.patchValue(
          {
            q,
            categoriaId: cat ? Number(cat) : null,
            tipo,
          },
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

    this.form.controls.tipo.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((t) => this.applyFilters({ tipo: t ?? undefined }));
  }

  protected reload(): void {
    this.fetch();
  }

  protected clearTipo(): void {
    this.form.controls.tipo.setValue(null);
  }

  protected humanLabel(name: string): string {
    if (!name) return '';
    return name.charAt(0) + name.slice(1).toLowerCase();
  }

  private applyFilters(patch: { q?: string; categoriaId?: number; tipo?: TipoInsumo }): void {
    const current = this.route.snapshot.queryParamMap;
    const q = patch.q !== undefined ? patch.q : (current.get('q') ?? undefined);
    const categoriaId =
      patch.categoriaId !== undefined
        ? patch.categoriaId
        : (current.get('categoriaId') ?? undefined);
    const tipo = patch.tipo !== undefined ? patch.tipo : (current.get('tipo') ?? undefined);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: q || null,
        categoriaId: categoriaId || null,
        tipo: tipo || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  private fetch(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    const { q, categoriaId, tipo } = this.form.getRawValue();

    this.productService
      .list({
        q: q || undefined,
        categoriaId: categoriaId ?? undefined,
        tipo: tipo ?? undefined,
      })
      .pipe(
        catchError((err) => {
          const status = (err as { status?: number })?.status;
          this.errorMessage.set(
            status === 0
              ? 'No se pudo conectar al servidor. El backend esta corriendo?'
              : 'Ocurrio un error al cargar los insumos. Intenta nuevamente.',
          );
          this.loading.set(false);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        if (data) this.insumos.set(data);
        this.loading.set(false);
      });
  }
}
