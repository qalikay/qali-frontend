import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

import { CatalogService } from '../../../core/services/catalog.service';
import { Categoria } from '../../../core/models/catalog.models';
import { RecipeService } from '../../recipes/services/recipe.service';
import { CrearRecetaRequest, Receta } from '../../recipes/models/recipe.models';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/icons/icon.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    IconComponent,
    PageHeaderComponent,
  ],
  template: `
    <app-page-header
      eyebrow="Panel del experto"
      [title]="title()"
      [description]="description()"
    >
      <ng-container actions>
        <a routerLink="/expert/recipes">
          <app-button variant="ghost" size="sm">
            <app-icon name="arrow-left" [size]="14" />
            Volver
          </app-button>
        </a>
      </ng-container>
    </app-page-header>

    <section class="mx-auto max-w-3xl px-4 py-8">
      @if (loadError()) {
        <div
          class="card p-5 mb-4 border-red-200 bg-red-50 text-sm text-red-700 flex gap-2 items-start"
        >
          <span class="mt-0.5"><app-icon name="alert-circle" [size]="14" /></span>
          {{ loadError() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6" novalidate>
        <div class="card p-5 md:p-6 space-y-4">
          <div>
            <label class="label" for="rec-title">Titulo</label>
            <input
              id="rec-title"
              class="input"
              formControlName="titulo"
              placeholder="Infusion de muna para la digestion"
            />
            <p class="mt-1 text-xs text-[var(--color-ink-500)]">Entre 5 y 150 caracteres.</p>
          </div>

          <div>
            <label class="label" for="rec-desc">Descripcion corta (opcional)</label>
            <textarea
              id="rec-desc"
              class="input min-h-20"
              rows="2"
              formControlName="descripcion"
              placeholder="Resumen visible en el listado."
            ></textarea>
          </div>

          <div class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="label" for="rec-cat">Categoria</label>
              <select id="rec-cat" class="input" formControlName="categoriaId">
                <option [ngValue]="null" disabled>
                  {{ loadingCategories() ? 'Cargando...' : 'Selecciona una categoria' }}
                </option>
                @for (c of categorias(); track c.id) {
                  <option [ngValue]="c.id">{{ c.nombre }}</option>
                }
              </select>
            </div>
            <div>
              <label class="label" for="rec-mins">Tiempo de preparacion (min)</label>
              <input
                id="rec-mins"
                type="number"
                min="0"
                class="input"
                formControlName="minutosPreparacion"
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <label class="label" for="rec-price">Precio (S/)</label>
            <input
              id="rec-price"
              type="number"
              min="0"
              step="0.10"
              class="input"
              formControlName="precio"
              placeholder="0.00"
            />
            <p class="mt-1 text-xs text-[var(--color-ink-500)]">
              Coloca <strong>0</strong> para que la receta sea gratuita.
            </p>
          </div>

          <div>
            <label class="label" for="rec-img">URL de imagen (opcional)</label>
            <input
              id="rec-img"
              type="url"
              class="input"
              formControlName="imagenUrl"
              placeholder="https://..."
            />
          </div>
        </div>

        <div class="card p-5 md:p-6 space-y-4">
          <h2 class="text-lg">Contenido</h2>

          <div>
            <label class="label" for="rec-ing">Ingredientes</label>
            <textarea
              id="rec-ing"
              class="input min-h-28"
              rows="4"
              formControlName="ingredientes"
              placeholder="10 hojas de muna fresca, 1 taza de agua hirviendo, miel al gusto"
            ></textarea>
          </div>

          <div>
            <label class="label" for="rec-prep">Preparacion</label>
            <textarea
              id="rec-prep"
              class="input min-h-32"
              rows="5"
              formControlName="preparacion"
              placeholder="Hervir el agua y verterla sobre las hojas..."
            ></textarea>
          </div>

          <div>
            <label class="label" for="rec-warn">Precauciones (opcional)</label>
            <textarea
              id="rec-warn"
              class="input min-h-20"
              rows="3"
              formControlName="advertencias"
              placeholder="No consumir durante el embarazo. Consultar en caso de gastritis cronica."
            ></textarea>
          </div>
        </div>

        @if (errorMessage()) {
          <div
            class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 flex gap-2 items-start"
          >
            <span class="mt-0.5"><app-icon name="alert-circle" [size]="14" /></span>
            {{ errorMessage() }}
          </div>
        }

        <div class="flex flex-wrap items-center justify-end gap-3">
          <a routerLink="/expert/recipes">
            <app-button variant="ghost">Cancelar</app-button>
          </a>
          <app-button type="submit" [loading]="saving()" [disabled]="form.invalid">
            {{ isEdit() ? 'Guardar cambios' : 'Guardar receta' }}
          </app-button>
        </div>

        @if (isEdit() && currentStatus()) {
          <p class="text-xs text-[var(--color-ink-500)] text-right">
            Estado actual:
            <span class="font-medium text-[var(--color-ink-700)]">{{ currentStatus() }}</span>
            . Las recetas inician como borrador. Publicalas desde la lista.
          </p>
        } @else {
          <p class="text-xs text-[var(--color-ink-500)] text-right">
            La receta se guarda como <strong>BORRADOR</strong>. Podras publicarla desde
            la lista cuando este lista.
          </p>
        }
      </form>
    </section>
  `,
})
export class RecipeFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CatalogService);
  private readonly recipeService = inject(RecipeService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  @Input() id?: string;

  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly loadingCategories = signal<boolean>(true);
  protected readonly saving = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);
  protected readonly currentStatus = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    descripcion: ['', [Validators.maxLength(500)]],
    ingredientes: ['', [Validators.required, Validators.maxLength(4000)]],
    preparacion: ['', [Validators.required, Validators.maxLength(4000)]],
    advertencias: ['', [Validators.maxLength(1000)]],
    imagenUrl: ['', [Validators.maxLength(500)]],
    precio: this.fb.control<number>(0, [Validators.min(0)]),
    minutosPreparacion: this.fb.control<number | null>(null, [Validators.min(0)]),
    categoriaId: this.fb.control<number | null>(null, [Validators.required]),
  });

  protected readonly isEdit = computed(() => !!this.id);
  protected readonly title = computed(() => (this.isEdit() ? 'Editar receta' : 'Nueva receta'));
  protected readonly description = computed(() =>
    this.isEdit()
      ? 'Actualiza el contenido. Los cambios solo se reflejan cuando guardas.'
      : 'Comparte una receta validada. Se guardara como borrador para que la revises antes de publicar.',
  );

  ngOnInit(): void {
    this.catalogService
      .getCategorias()
      .pipe(catchError(() => of([] as Categoria[])))
      .subscribe((data) => {
        this.categorias.set(data);
        this.loadingCategories.set(false);
      });

    if (this.id) {
      const recipeId = Number(this.id);
      if (!Number.isFinite(recipeId)) {
        this.loadError.set('Identificador de receta invalido.');
        return;
      }
      this.recipeService
        .getOwn(recipeId)
        .pipe(
          catchError((err) => {
            const status = (err as { status?: number })?.status;
            if (status === 404) {
              this.loadError.set('Esta receta no existe o no es tuya.');
            } else if (status === 403) {
              this.loadError.set('No tienes permiso para editar esta receta.');
            } else if (status === 0) {
              this.loadError.set('No pudimos contactar al servidor.');
            } else {
              this.loadError.set('Ocurrio un error al cargar la receta.');
            }
            return of(null);
          }),
        )
        .subscribe((recipe) => {
          if (recipe) this.populateForm(recipe);
        });
    }
  }

  submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();
    const payload: CrearRecetaRequest = {
      titulo: raw.titulo,
      descripcion: raw.descripcion || undefined,
      ingredientes: raw.ingredientes,
      preparacion: raw.preparacion,
      advertencias: raw.advertencias || undefined,
      imagenUrl: raw.imagenUrl || undefined,
      precio: Number(raw.precio ?? 0),
      minutosPreparacion: raw.minutosPreparacion ?? undefined,
      categoriaId: raw.categoriaId ?? undefined,
    };

    const request$ = this.isEdit()
      ? this.recipeService.update(Number(this.id), payload)
      : this.recipeService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(
          this.isEdit() ? 'Receta actualizada' : 'Receta creada',
          this.isEdit() ? undefined : 'Esta en borrador. Publicala cuando este lista.',
        );
        this.router.navigate(['/expert/recipes']);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(this.extractMessage(err));
      },
    });
  }

  private populateForm(recipe: Receta): void {
    this.currentStatus.set(recipe.estado);
    this.form.patchValue({
      titulo: recipe.titulo,
      descripcion: recipe.descripcion ?? '',
      ingredientes: recipe.ingredientes ?? '',
      preparacion: recipe.preparacion ?? '',
      advertencias: recipe.advertencias ?? '',
      imagenUrl: recipe.imagenUrl ?? '',
      precio: Number(recipe.precio ?? 0),
      minutosPreparacion: recipe.minutosPreparacion ?? null,
      categoriaId: recipe.categoria?.id ?? null,
    });
  }

  private extractMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status?: number; error?: { message?: string } };
      if (e.status === 0) return 'No pudimos contactar al servidor. El backend esta corriendo?';
      if (e.status === 403) return 'No tienes permiso para esta accion.';
      if (e.error?.message) return e.error.message;
    }
    return 'No se pudo guardar la receta. Revisa los datos e intentalo de nuevo.';
  }
}
