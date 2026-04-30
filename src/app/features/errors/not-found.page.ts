import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/icons/icon.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent, IconComponent],
  template: `
    <section class="mx-auto max-w-xl px-4 py-24 text-center">
      <div
        class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
      >
        <app-icon name="leaf" [size]="26" />
      </div>
      <h1 class="mt-5 text-3xl">Página no encontrada</h1>
      <p class="mt-2 text-[var(--color-ink-500)]">
        La ruta que buscas no existe o fue movida. Puedes volver al inicio o explorar el catálogo.
      </p>
      <div class="mt-6 flex items-center justify-center gap-2">
        <a routerLink="/">
          <app-button>Volver al inicio</app-button>
        </a>
        <a routerLink="/recipes">
          <app-button variant="outline">Ver recetas</app-button>
        </a>
      </div>
    </section>
  `,
})
export class NotFoundPage {}
