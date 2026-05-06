import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/auth/services/auth.service';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { IconComponent } from '../../shared/icons/icon.component';
import { ToastHostComponent } from '../../shared/components/toast-host/toast-host.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LogoComponent,
    IconComponent,
    ToastHostComponent,
  ],
  template: `
    <div class="min-h-full flex flex-col bg-white">
      <header
        class="sticky top-0 z-30 border-b bg-white/85 backdrop-blur"
        [style.borderColor]="'var(--color-border)'"
      >
        <div class="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
          <a routerLink="/" class="flex items-center" aria-label="QaliKay inicio">
            <app-logo />
          </a>

          <nav class="hidden md:flex items-center gap-1 text-sm">
            @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="bg-[var(--color-brand-50)] text-[var(--color-brand-800)]"
                class="px-3 h-9 inline-flex items-center rounded-lg text-[var(--color-ink-700)] hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                {{ link.label }}
              </a>
            }
          </nav>

          @if (auth.isAuthenticated()) {
            <div class="relative">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-[var(--color-surface-muted)] transition-colors"
                [attr.aria-expanded]="menuOpen()"
                aria-haspopup="menu"
                (click)="toggleMenu()"
              >
                <span
                  class="h-8 w-8 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-800)] flex items-center justify-center text-sm font-semibold"
                  aria-hidden="true"
                >
                  {{ initials() }}
                </span>
                <span class="hidden sm:inline text-sm font-medium text-[var(--color-ink-700)]">
                  {{ auth.user()?.username }}
                </span>
                <app-icon name="chevron-down" [size]="14" />
              </button>

              @if (menuOpen()) {
                <div
                  class="absolute right-0 mt-2 w-56 card shadow-md py-1 text-sm"
                  role="menu"
                  (click)="closeMenu()"
                >
                  <div class="px-3 py-2 border-b border-[var(--color-border)]">
                    <div class="font-medium text-[var(--color-ink-900)] truncate">
                      {{ auth.user()?.username }}
                    </div>
                    <div class="mt-1 flex gap-1 flex-wrap">
                      @for (role of auth.roles(); track role) {
                        <span
                          class="inline-flex items-center rounded-full border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-800)]"
                        >
                          {{ roleLabel(role) }}
                        </span>
                      }
                    </div>
                  </div>
                  @if (auth.isExperto()) {
                    <a
                      class="flex items-center gap-2 px-3 py-2 hover:bg-[var(--color-surface-muted)]"
                      routerLink="/expert"
                      role="menuitem"
                    >
                      <app-icon name="package" [size]="16" /> Panel del experto
                    </a>
                  }
                  @if (auth.isCliente()) {
                    <a
                      class="flex items-center gap-2 px-3 py-2 hover:bg-[var(--color-surface-muted)]"
                      routerLink="/me"
                      role="menuitem"
                    >
                      <app-icon name="user" [size]="16" /> Mi panel
                    </a>
                  }
                  <button
                    type="button"
                    class="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--color-surface-muted)] text-left"
                    (click)="logout()"
                    role="menuitem"
                  >
                    <app-icon name="log-out" [size]="16" /> Cerrar sesion
                  </button>
                </div>
              }
            </div>
          } @else {
            <div class="flex items-center gap-2">
              <a routerLink="/login" class="hidden sm:inline-flex btn btn-ghost">Ingresar</a>
              <a routerLink="/register/cliente" class="btn btn-primary">Crear cuenta</a>
            </div>
          }
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="border-t bg-[var(--color-surface-muted)]" [style.borderColor]="'var(--color-border)'">
        <div class="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-3 gap-6">
          <div>
            <app-logo />
            <p class="mt-3 text-sm text-[var(--color-ink-500)] max-w-xs">
              Plataforma peruana que conecta a personas con expertos certificados en medicina
              natural andina.
            </p>
          </div>
          <div class="text-sm">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-500)]">
              Explorar
            </h4>
            <ul class="mt-3 space-y-2">
              <li><a class="hover:text-[var(--color-ink-900)]" routerLink="/recipes">Recetas</a></li>
              <li><a class="hover:text-[var(--color-ink-900)]" routerLink="/products">Insumos</a></li>
            </ul>
          </div>
          <div class="text-sm">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-500)]">
              Compania
            </h4>
            <ul class="mt-3 space-y-2">
              <li><span class="text-[var(--color-ink-500)]">Sobre nosotros</span></li>
              <li><span class="text-[var(--color-ink-500)]">Privacidad</span></li>
              <li><span class="text-[var(--color-ink-500)]">Terminos</span></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-[var(--color-border)]">
          <div
            class="mx-auto max-w-6xl px-4 py-4 text-xs text-[var(--color-ink-500)] flex items-center justify-between"
          >
            <span>&copy; {{ year }} QaliKay. Todos los derechos reservados.</span>
            <span>Hecho en Peru.</span>
          </div>
        </div>
      </footer>

      <app-toast-host />
    </div>
  `,
})
export class MainLayoutComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly navLinks = [
    { path: '/recipes', label: 'Recetas' },
    { path: '/products', label: 'Insumos' },
  ];
  protected readonly year = new Date().getFullYear();
  protected readonly menuOpen = signal(false);

  protected readonly initials = computed(() => {
    const u = this.auth.user();
    if (!u) return '';
    return (u.username[0] || '?').toUpperCase();
  });

  protected roleLabel(role: string): string {
    return role.replace('ROLE_', '');
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.menuOpen.set(false);
    this.router.navigate(['/']);
  }
}
