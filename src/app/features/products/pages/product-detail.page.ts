import { CurrencyPipe } from '@angular/common';
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

import { ProductService } from '../services/product.service';
import { Insumo } from '../models/product.models';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../../shared/icons/icon.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    RouterLink,
    BadgeComponent,
    ButtonComponent,
    EmptyStateComponent,
    IconComponent,
    SkeletonComponent,
  ],
  template: `
    @if (loading()) {
      <section class="mx-auto max-w-5xl px-4 py-10 grid lg:grid-cols-2 gap-8">
        <app-skeleton width="100%" height="380px" />
        <div class="space-y-3">
          <app-skeleton width="40%" height="0.875rem" />
          <app-skeleton width="80%" height="2rem" />
          <app-skeleton width="100%" height="120px" />
          <app-skeleton width="60%" height="1.5rem" />
        </div>
      </section>
    } @else if (errorMessage()) {
      <section class="mx-auto max-w-3xl px-4 py-12">
        <app-empty-state
          icon="alert-circle"
          [title]="'No pudimos cargar el insumo'"
          [description]="errorMessage()!"
        >
          <a routerLink="/products">
            <app-button variant="outline">Volver al catalogo</app-button>
          </a>
        </app-empty-state>
      </section>
    } @else if (product(); as p) {
      <section class="mx-auto max-w-5xl px-4 py-10">
        <a
          routerLink="/products"
          class="inline-flex items-center gap-1 text-sm text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]"
        >
          <app-icon name="arrow-left" [size]="14" /> Volver al catalogo
        </a>

        <div class="mt-6 grid lg:grid-cols-2 gap-8">
          <div class="card overflow-hidden">
            @if (p.imagenUrl) {
              <img
                [src]="p.imagenUrl"
                [alt]="p.nombre"
                class="w-full aspect-square object-cover"
              />
            } @else {
              <div
                class="aspect-square flex items-center justify-center text-[var(--color-brand-200)]"
              >
                <app-icon name="package" [size]="80" />
              </div>
            }
          </div>

          <div>
            <div class="flex flex-wrap gap-2">
              @if (p.categoria?.nombre) {
                <app-badge tone="brand">{{ p.categoria!.nombre }}</app-badge>
              }
              @if (p.tipo) {
                <app-badge tone="neutral">{{ humanLabel(p.tipo) }}</app-badge>
              }
              @if (p.estado === 'DISPONIBLE') {
                <app-badge tone="success">Disponible</app-badge>
              } @else if (p.estado === 'AGOTADO') {
                <app-badge tone="warning">Agotado</app-badge>
              }
            </div>
            <h1 class="mt-3 text-3xl">{{ p.nombre }}</h1>

            <div class="mt-6 card p-5">
              <div class="flex items-baseline justify-between">
                <div>
                  <div class="text-xs uppercase tracking-wider text-[var(--color-ink-500)]">
                    Precio
                  </div>
                  <div class="text-3xl font-semibold text-[var(--color-ink-900)]">
                    @if ((p.precio ?? 0) > 0) {
                      {{ p.precio | currency: 'PEN' : 'symbol-narrow' : '1.2-2' : 'es-PE' }}
                    } @else {
                      <span class="text-[var(--color-brand-700)]">Consultar</span>
                    }
                  </div>
                  @if (p.unidad) {
                    <div class="text-xs text-[var(--color-ink-500)]">por {{ p.unidad }}</div>
                  }
                </div>
                @if (p.stock !== undefined && p.stock !== null) {
                  <div class="text-right">
                    <div class="text-xs text-[var(--color-ink-500)]">Stock</div>
                    <div class="text-lg font-semibold">{{ p.stock }}</div>
                  </div>
                }
              </div>

              <div class="mt-4 grid sm:grid-cols-1 gap-2">
                <app-button [fullWidth]="true" [disabled]="p.estado !== 'DISPONIBLE'">
                  <app-icon name="shopping-bag" [size]="16" />
                  Agregar al carrito
                </app-button>
              </div>
            </div>

            @if (p.experto) {
              <div class="mt-6 flex items-center gap-3 text-sm">
                <span
                  class="h-9 w-9 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-800)] flex items-center justify-center font-semibold"
                  aria-hidden="true"
                >
                  {{ initials() }}
                </span>
                <div>
                  <div class="font-medium text-[var(--color-ink-900)]">
                    {{ p.experto.nombres }} {{ p.experto.apellidos }}
                  </div>
                  <div class="text-xs text-[var(--color-ink-500)]">Experto QaliKay</div>
                </div>
              </div>
            }
          </div>
        </div>

        @if (p.descripcion) {
          <article class="mt-10 card p-6 max-w-3xl">
            <h2 class="text-xl">Descripcion</h2>
            <p class="mt-2 text-[var(--color-ink-700)] whitespace-pre-line">{{ p.descripcion }}</p>
          </article>
        }
      </section>
    }
  `,
})
export class ProductDetailPage implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  @Input() id!: string;

  protected readonly product = signal<Insumo | null>(null);
  protected readonly loading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly initials = computed(() => {
    const e = this.product()?.experto;
    if (!e) return 'Q';
    return ((e.nombres?.[0] ?? '') + (e.apellidos?.[0] ?? '')).toUpperCase() || 'Q';
  });

  ngOnInit(): void {
    const productId = Number(this.id);
    if (!Number.isFinite(productId)) {
      this.errorMessage.set('Identificador de insumo invalido.');
      this.loading.set(false);
      return;
    }
    this.productService
      .getById(productId)
      .pipe(
        catchError((err) => {
          const status = (err as { status?: number })?.status;
          if (status === 404) this.errorMessage.set('Este insumo no existe.');
          else if (status === 0)
            this.errorMessage.set('No pudimos contactar al servidor. El backend esta corriendo?');
          else this.errorMessage.set('Ocurrio un error inesperado al cargar el insumo.');
          this.loading.set(false);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        if (data) this.product.set(data);
        this.loading.set(false);
      });
  }

  protected humanLabel(name: string): string {
    if (!name) return '';
    return name.charAt(0) + name.slice(1).toLowerCase();
  }
}
