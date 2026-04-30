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
  selector: 'app-client-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent, IconComponent, PageHeaderComponent],
  template: `
    <app-page-header
      eyebrow="Mi panel"
      [title]="greeting()"
      description="Gestiona tus consultas, compras y favoritos en un solo lugar."
    >
      <ng-container actions>
        <a routerLink="/recipes">
          <app-button variant="outline" size="sm">Explorar recetas</app-button>
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
            Ver más <app-icon name="arrow-right" [size]="12" />
          </div>
        </a>
      }
    </section>
  `,
})
export class ClientDashboardPage {
  protected readonly auth = inject(AuthService);

  protected readonly greeting = computed(() => {
    const u = this.auth.user();
    return u ? `Hola, ${u.firstName}` : 'Mi panel';
  });

  protected readonly tiles: DashTile[] = [
    {
      title: 'Mis consultas',
      description: 'Mensajes y orientaciones con tus expertos.',
      link: '/me/consultations',
      icon: 'message-circle',
    },
    {
      title: 'Mis compras',
      description: 'Historial de transacciones y comprobantes.',
      link: '/me/purchases',
      icon: 'shopping-bag',
    },
    {
      title: 'Recetas guardadas',
      description: 'Recetas favoritas para acceder rápido.',
      link: '/me/saved',
      icon: 'book-open',
    },
    {
      title: 'Mis reseñas',
      description: 'Tus opiniones sobre recetas e insumos.',
      link: '/me/reviews',
      icon: 'star',
    },
    {
      title: 'Editar perfil',
      description: 'Actualiza tus datos personales y foto.',
      link: '/me/profile',
      icon: 'user',
    },
    {
      title: 'Seguridad',
      description: 'Cambia tu contraseña y revisa accesos.',
      link: '/me/security',
      icon: 'lock',
    },
  ];
}
