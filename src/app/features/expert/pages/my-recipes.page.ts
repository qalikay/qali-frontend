import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

import { EstadoReceta, Receta } from '../../recipes/models/recipe.models';
import { RecipeService } from '../../recipes/services/recipe.service';
import { BadgeComponent, BadgeTone } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../../shared/icons/icon.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { ToastService } from '../../../shared/services/toast.service';

const STATUS_LABEL: Record<EstadoReceta, string> = {
  BORRADOR: 'Borrador',
  PUBLICADA: 'Publicada',
};

const STATUS_TONE: Record<EstadoReceta, BadgeTone> = {
  BORRADOR: 'warning',
  PUBLICADA: 'success',
};

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    RouterLink,
    BadgeComponent,
    ButtonComponent,
    EmptyStateComponent,
    IconComponent,
    PageHeaderComponent,
    SkeletonComponent,
  ],
  template: `
    <app-page-header
      eyebrow="Panel del experto"
      title="Mis recetas"
      description="Crea, publica y administra las recetas que comparte con la comunidad."
    >
      <ng-container actions>
        <a routerLink="/expert">
          <app-button variant="ghost" size="sm">
            <app-icon name="arrow-left" [size]="14" />
            Volver
          </app-button>
        </a>
        <a routerLink="/expert/recipes/new">
          <app-button size="sm">
            <app-icon name="plus" [size]="14" />
            Nueva receta
          </app-button>
        </a>
      </ng-container>
    </app-page-header>

    <section class="mx-auto max-w-6xl px-4 py-8">
      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1, 2, 3]; track i) {
            <div class="card p-4 flex gap-4">
              <app-skeleton width="96px" height="72px" />
              <div class="flex-1 space-y-2">
                <app-skeleton width="60%" height="1rem" />
                <app-skeleton width="40%" height="0.875rem" />
              </div>
            </div>
          }
        </div>
      } @else if (errorMessage()) {
        <app-empty-state
          icon="alert-circle"
          title="No pudimos cargar tus recetas"
          [description]="errorMessage()!"
        >
          <app-button variant="outline" (click)="reload()">Reintentar</app-button>
        </app-empty-state>
      } @else if (items().length === 0) {
        <app-empty-state
          icon="book-open"
          title="Aun no tienes recetas"
          description="Empieza compartiendo una receta con la comunidad QaliKay."
        >
          <a routerLink="/expert/recipes/new">
            <app-button>
              <app-icon name="plus" [size]="14" />
              Crear primera receta
            </app-button>
          </a>
        </app-empty-state>
      } @else {
        <div class="card divide-y divide-[var(--color-border)]">
          @for (r of items(); track r.id) {
            <article class="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
              <a
                [routerLink]="['/expert/recipes', r.id, 'edit']"
                class="block w-full sm:w-32 shrink-0 aspect-[4/3] rounded-lg overflow-hidden bg-[var(--color-surface-muted)]"
              >
                @if (r.imagenUrl) {
                  <img
                    [src]="r.imagenUrl"
                    [alt]="r.titulo"
                    class="h-full w-full object-cover"
                  />
                } @else {
                  <div
                    class="flex h-full w-full items-center justify-center text-[var(--color-brand-200)]"
                  >
                    <app-icon name="leaf" [size]="32" />
                  </div>
                }
              </a>

              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 text-xs">
                  <app-badge [tone]="statusTone(r.estado)">{{ statusLabel(r.estado) }}</app-badge>
                  @if (r.categoria?.nombre) {
                    <span class="text-[var(--color-ink-500)]">{{ r.categoria!.nombre }}</span>
                  }
                </div>
                <h3 class="mt-1 text-base font-semibold text-[var(--color-ink-900)] truncate">
                  {{ r.titulo }}
                </h3>
                @if (r.descripcion) {
                  <p class="mt-1 text-sm text-[var(--color-ink-500)] line-clamp-2">
                    {{ r.descripcion }}
                  </p>
                }
                <div class="mt-2 flex items-center gap-4 text-xs text-[var(--color-ink-500)]">
                  <span class="font-medium text-[var(--color-ink-700)]">
                    @if ((r.precio ?? 0) > 0) {
                      {{ r.precio | currency: 'PEN' : 'symbol-narrow' : '1.2-2' : 'es-PE' }}
                    } @else {
                      Gratis
                    }
                  </span>
                </div>
              </div>

              <div class="flex flex-row sm:flex-col gap-2 shrink-0">
                <a [routerLink]="['/expert/recipes', r.id, 'edit']">
                  <app-button variant="outline" size="sm">Editar</app-button>
                </a>
                @if (r.estado === 'BORRADOR') {
                  <app-button
                    variant="primary"
                    size="sm"
                    [loading]="busyId() === r.id && busyAction() === 'publish'"
                    (click)="publish(r.id)"
                  >
                    <app-icon name="check" [size]="14" />
                    Publicar
                  </app-button>
                }
                @if (r.estado === 'PUBLICADA') {
                  <app-button
                    variant="outline"
                    size="sm"
                    [loading]="busyId() === r.id && busyAction() === 'archive'"
                    (click)="archive(r.id)"
                  >
                    Despublicar
                  </app-button>
                }
                <app-button
                  variant="ghost"
                  size="sm"
                  [loading]="busyId() === r.id && busyAction() === 'delete'"
                  (click)="confirmDelete(r)"
                >
                  <app-icon name="x" [size]="14" />
                  Eliminar
                </app-button>
              </div>
            </article>
          }
        </div>
      }
    </section>
  `,
})
export class MyRecipesPage implements OnInit {
  private readonly recipeService = inject(RecipeService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly items = signal<Receta[]>([]);
  protected readonly loading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly busyId = signal<number | null>(null);
  protected readonly busyAction = signal<'publish' | 'archive' | 'delete' | null>(null);

  ngOnInit(): void {
    this.fetch();
  }

  protected reload(): void {
    this.fetch();
  }

  protected statusLabel(status: EstadoReceta): string {
    return STATUS_LABEL[status] ?? status;
  }

  protected statusTone(status: EstadoReceta): BadgeTone {
    return STATUS_TONE[status] ?? 'neutral';
  }

  protected publish(id: number): void {
    this.busyId.set(id);
    this.busyAction.set('publish');
    this.recipeService
      .publish(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Receta publicada', 'Ya es visible en el catalogo publico.');
          this.busyId.set(null);
          this.busyAction.set(null);
          this.fetch();
        },
        error: (err) => {
          this.busyId.set(null);
          this.busyAction.set(null);
          this.toast.error('No se pudo publicar', this.extractMessage(err));
        },
      });
  }

  protected archive(id: number): void {
    this.busyId.set(id);
    this.busyAction.set('archive');
    this.recipeService
      .archive(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Receta despublicada', 'Vuelve a estar como borrador.');
          this.busyId.set(null);
          this.busyAction.set(null);
          this.fetch();
        },
        error: (err) => {
          this.busyId.set(null);
          this.busyAction.set(null);
          this.toast.error('No se pudo despublicar', this.extractMessage(err));
        },
      });
  }

  protected confirmDelete(r: Receta): void {
    if (typeof window === 'undefined') return;
    const ok = window.confirm(
      `Seguro que deseas eliminar "${r.titulo}"? Esta accion no se puede deshacer.`,
    );
    if (!ok) return;
    this.busyId.set(r.id);
    this.busyAction.set('delete');
    this.recipeService
      .delete(r.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Receta eliminada');
          this.busyId.set(null);
          this.busyAction.set(null);
          this.fetch();
        },
        error: (err) => {
          this.busyId.set(null);
          this.busyAction.set(null);
          this.toast.error('No se pudo eliminar', this.extractMessage(err));
        },
      });
  }

  private fetch(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.recipeService
      .listMine()
      .pipe(
        catchError((err) => {
          const status = (err as { status?: number })?.status;
          this.errorMessage.set(
            status === 0
              ? 'No se pudo conectar al servidor. El backend esta corriendo?'
              : 'Ocurrio un error al cargar tus recetas.',
          );
          this.loading.set(false);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        if (data) this.items.set(data);
        this.loading.set(false);
      });
  }

  private extractMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const body = (err as { error?: { message?: string } }).error;
      if (body?.message) return body.message;
    }
    return 'Intentalo de nuevo en unos segundos.';
  }
}
