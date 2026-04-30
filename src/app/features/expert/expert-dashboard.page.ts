import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent, IconName } from '../../shared/icons/icon.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

interface DashTile {
  title: string;
  description: string;
  link: string;
  icon: IconName;
}

@Component({
  selector: 'app-expert-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent, IconComponent, PageHeaderComponent],
  template: `
    <app-page-header
      eyebrow="Panel del experto"
      [title]="greeting()"
      description="Administra tus recetas, insumos y consultas con clientes."
    >
      <ng-container actions>
        <a routerLink="/expert/recipes/new">
          <app-button size="sm">
            <app-icon name="plus" [size]="14" />
            Nueva receta
          </app-button>
        </a>
      </ng-container>
    </app-page-header>

    <section class="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      @for (tile of tiles; track tile.title) {
        <a [routerLink]="tile.link" class="card p-5 hover:border-[var(--color-brand-300)] transition-colors">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
          >
            <app-icon [name]="tile.icon" [size]="18" />
          </div>
          <h3 class="mt-4 font-semibold text-[var(--color-ink-900)]">{{ tile.title }}</h3>
          <p class="mt-1 text-sm text-[var(--color-ink-500)]">{{ tile.description }}</p>
          <div
            class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand-700)]"
          >
            Abrir <app-icon name="arrow-right" [size]="12" />
          </div>
        </a>
      }
    </section>
  `,
})
export class ExpertDashboardPage {
  protected readonly auth = inject(AuthService);

  protected readonly greeting = computed(() => {
    const u = this.auth.user();
    return u ? `Hola, ${u.firstName}` : 'Panel del experto';
  });

  protected readonly tiles: DashTile[] = [
    {
      title: 'Mis recetas',
      description: 'Crea, edita, publica o archiva tus recetas.',
      link: '/expert/recipes',
      icon: 'book-open',
    },
    {
      title: 'Mis insumos',
      description: 'Administra tu inventario de insumos naturales.',
      link: '/expert/products',
      icon: 'package',
    },
    {
      title: 'Consultas',
      description: 'Mensajes con tus clientes y solicitudes pendientes.',
      link: '/expert/consultations',
      icon: 'message-circle',
    },
    {
      title: 'Ventas',
      description: 'Historial de transacciones de tus contenidos.',
      link: '/expert/sales',
      icon: 'shopping-bag',
    },
    {
      title: 'Mi perfil público',
      description: 'Edita tu trayectoria y especialidad.',
      link: '/expert/profile',
      icon: 'user',
    },
    {
      title: 'Estadísticas',
      description: 'Reseñas, vistas y crecimiento de tu cuenta.',
      link: '/expert/stats',
      icon: 'sparkles',
    },
  ];
}
