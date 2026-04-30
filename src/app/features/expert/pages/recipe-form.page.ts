import { ChangeDetectionStrategy, Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

import { CatalogService } from '../../../core/services/catalog.service';
import { CategoryResponse } from '../../../core/models/catalog.models';
import { RecipeService } from '../../recipes/services/recipe.service';
import { RecipeRequest, RecipeResponse } from '../../recipes/models/recipe.models';
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
            <label class="label" for="rec-title">Título</label>
            <input
              id="rec-title"
              class="input"
              formControlName="title"
              placeholder="Infusión de muña para la digestión"
            />
            <p class="mt-1 text-xs text-[var(--color-ink-500)]">Entre 5 y 150 caracteres.</p>
          </div>

          <div>
            <label class="label" for="rec-short">Descripción corta</label>
            <textarea
              id="rec-short"
              class="input min-h-20"
              rows="2"
              formControlName="shortDescription"
              placeholder="Resumen visible en el listado."
            ></textarea>
            <p class="mt-1 text-xs text-[var(--color-ink-500)]">
              Entre 20 y 300 caracteres.
              <span [class.text-red-700]="lengthExceeds('shortDescription', 300)">
                {{ length('shortDescription') }} / 300
              </span>
            </p>
          </div>

          <div class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="label" for="rec-cat">Categoría</label>
              <select id="rec-cat" class="input" formControlName="categoryId">
                <option [ngValue]="null" disabled>
                  {{ loadingCategories() ? 'Cargando...' : 'Selecciona una categoría' }}
                </option>
                @for (c of categories(); track c.id) {
                  <option [ngValue]="c.id">{{ humanLabel(c.name) }}</option>
                }
              </select>
            </div>
            <div>
              <label class="label" for="rec-mins">Tiempo de preparación (min)</label>
              <input
                id="rec-mins"
                type="number"
                min="0"
                class="input"
                formControlName="preparationMinutes"
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
              formControlName="price"
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
              formControlName="imageUrl"
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
              formControlName="ingredients"
              placeholder="10 hojas de muña fresca, 1 taza de agua hirviendo, miel al gusto"
            ></textarea>
            <p class="mt-1 text-xs text-[var(--color-ink-500)]">
              Entre 10 y 4000 caracteres.
              <span [class.text-red-700]="lengthExceeds('ingredients', 4000)">
                {{ length('ingredients') }} / 4000
              </span>
            </p>
          </div>

          <div>
            <label class="label" for="rec-prep">Preparación</label>
            <textarea
              id="rec-prep"
              class="input min-h-32"
              rows="5"
              formControlName="preparation"
              placeholder="Hervir el agua y verterla sobre las hojas..."
            ></textarea>
            <p class="mt-1 text-xs text-[var(--color-ink-500)]">
              Entre 20 y 4000 caracteres.
              <span [class.text-red-700]="lengthExceeds('preparation', 4000)">
                {{ length('preparation') }} / 4000
              </span>
            </p>
          </div>

          <div>
            <label class="label" for="rec-use">Uso recomendado (opcional)</label>
            <textarea
              id="rec-use"
              class="input min-h-20"
              rows="3"
              formControlName="usage"
              placeholder="Beber 1 taza tibia después de cada comida principal por 3 días."
            ></textarea>
          </div>

          <div>
            <label class="label" for="rec-warn">Precauciones (opcional)</label>
            <textarea
              id="rec-warn"
              class="input min-h-20"
              rows="3"
              formControlName="warnings"
              placeholder="No consumir durante el embarazo. Consultar en caso de gastritis crónica."
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
            · Las recetas guardadas inician como borrador. Publícalas desde la lista.
          </p>
        } @else {
          <p class="text-xs text-[var(--color-ink-500)] text-right">
            La receta se guarda como <strong>BORRADOR</strong>. Podrás publicarla desde
            la lista cuando esté lista.
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

  protected readonly categories = signal<CategoryResponse[]>([]);
  protected readonly loadingCategories = signal<boolean>(true);
  protected readonly saving = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);
  protected readonly currentStatus = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
    shortDescription: [
      '',
      [Validators.required, Validators.minLength(20), Validators.maxLength(300)],
    ],
    ingredients: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(4000)],
    ],
    preparation: [
      '',
      [Validators.required, Validators.minLength(20), Validators.maxLength(4000)],
    ],
    usage: ['', [Validators.maxLength(1000)]],
    warnings: ['', [Validators.maxLength(1000)]],
    imageUrl: ['', [Validators.maxLength(500)]],
    price: this.fb.control<number>(0, [Validators.required, Validators.min(0), Validators.max(9999.99)]),
    preparationMinutes: this.fb.control<number | null>(null, [Validators.min(0)]),
    categoryId: this.fb.control<number | null>(null, [Validators.required]),
  });

  protected readonly isEdit = computed(() => !!this.id);

  protected readonly title = computed(() => (this.isEdit() ? 'Editar receta' : 'Nueva receta'));
  protected readonly description = computed(() =>
    this.isEdit()
      ? 'Actualiza el contenido. Los cambios solo se reflejan cuando guardas.'
      : 'Comparte una receta validada. Se guardará como borrador para que la revises antes de publicar.',
  );

  ngOnInit(): void {
    this.catalogService
      .getCategories()
      .pipe(catchError(() => of([] as CategoryResponse[])))
      .subscribe((data) => {
        this.categories.set(data);
        this.loadingCategories.set(false);
      });

    if (this.id) {
      const recipeId = Number(this.id);
      if (!Number.isFinite(recipeId)) {
        this.loadError.set('Identificador de receta inválido.');
        return;
      }
      this.recipeService
        .getOwn(recipeId)
        .pipe(
          catchError((err) => {
            const status = (err as { status?: number })?.status;
            if (status === 404) {
              this.loadError.set('Esta receta no existe o no es tuya.');
            } else if (status === 0) {
              this.loadError.set('No pudimos contactar al servidor.');
            } else {
              this.loadError.set('Ocurrió un error al cargar la receta.');
            }
            return of(null);
          }),
        )
        .subscribe((recipe) => {
          if (recipe) this.populateForm(recipe);
        });
    }
  }

  protected length(field: keyof ReturnType<typeof this.form.getRawValue>): number {
    const value = this.form.get(field as string)?.value;
    return typeof value === 'string' ? value.length : 0;
  }

  protected lengthExceeds(field: keyof ReturnType<typeof this.form.getRawValue>, max: number): boolean {
    return this.length(field) > max;
  }

  protected humanLabel(name: string): string {
    if (!name) return '';
    return name.charAt(0) + name.slice(1).toLowerCase();
  }

  submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();
    const payload: RecipeRequest = {
      title: raw.title,
      shortDescription: raw.shortDescription,
      ingredients: raw.ingredients,
      preparation: raw.preparation,
      usage: raw.usage || undefined,
      warnings: raw.warnings || undefined,
      imageUrl: raw.imageUrl || undefined,
      price: Number(raw.price),
      preparationMinutes: raw.preparationMinutes ?? undefined,
      categoryId: raw.categoryId!,
    };

    const request$ = this.isEdit()
      ? this.recipeService.update(Number(this.id), payload)
      : this.recipeService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(
          this.isEdit() ? 'Receta actualizada' : 'Receta creada',
          this.isEdit() ? undefined : 'Está en borrador. Publícala cuando esté lista.',
        );
        this.router.navigate(['/expert/recipes']);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(this.extractMessage(err));
      },
    });
  }

  private populateForm(recipe: RecipeResponse): void {
    this.currentStatus.set(recipe.status);
    this.form.patchValue({
      title: recipe.title,
      shortDescription: recipe.shortDescription,
      ingredients: recipe.ingredients,
      preparation: recipe.preparation,
      usage: recipe.usage ?? '',
      warnings: recipe.warnings ?? '',
      imageUrl: recipe.imageUrl ?? '',
      price: Number(recipe.price ?? 0),
      preparationMinutes: recipe.preparationMinutes ?? null,
      categoryId: recipe.category.id,
    });
  }

  private extractMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as {
        status?: number;
        error?: { message?: string; details?: Record<string, string> };
      };
      if (e.status === 0)
        return 'No pudimos contactar al servidor. ¿El backend está corriendo?';
      if (e.status === 403) return 'No tienes permiso para esta acción.';
      if (e.error?.details) {
        const first = Object.values(e.error.details)[0];
        if (first) return first;
      }
      if (e.error?.message) return e.error.message;
    }
    return 'No se pudo guardar la receta. Revisa los datos e inténtalo de nuevo.';
  }
}
