import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/icons/icon.component';
import { ToastService } from '../../shared/services/toast.service';
import { LogoComponent } from '../../shared/components/logo/logo.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, IconComponent, LogoComponent],
  template: `
    <section class="mx-auto max-w-md px-4 py-12">
      <div class="mb-6 flex justify-center">
        <app-logo [size]="36" />
      </div>
      <div class="card p-6 md:p-8">
        <h1 class="text-2xl">Bienvenido de vuelta</h1>
        <p class="mt-1 text-sm text-[var(--color-ink-500)]">
          Inicia sesion para continuar tu camino con QaliKay.
        </p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="mt-6 space-y-4" novalidate>
          <div>
            <label class="label" for="login-username">Usuario</label>
            <div class="relative">
              <span
                class="absolute inset-y-0 left-3 flex items-center text-[var(--color-ink-300)]"
              >
                <app-icon name="user" [size]="16" />
              </span>
              <input
                id="login-username"
                type="text"
                autocomplete="username"
                class="input pl-9"
                formControlName="username"
                placeholder="tu_usuario"
              />
            </div>
          </div>

          <div>
            <label class="label" for="login-password">Contrasena</label>
            <div class="relative">
              <span
                class="absolute inset-y-0 left-3 flex items-center text-[var(--color-ink-300)]"
              >
                <app-icon name="lock" [size]="16" />
              </span>
              <input
                id="login-password"
                [type]="showPassword() ? 'text' : 'password'"
                autocomplete="current-password"
                class="input pl-9 pr-9"
                formControlName="password"
                placeholder="********"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-3 flex items-center text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]"
                (click)="togglePassword()"
                [attr.aria-label]="showPassword() ? 'Ocultar contrasena' : 'Mostrar contrasena'"
              >
                <app-icon name="eye" [size]="16" />
              </button>
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

          <app-button type="submit" [fullWidth]="true" [loading]="loading()">
            <app-icon name="log-in" [size]="16" />
            Ingresar
          </app-button>
        </form>

        <div class="mt-6 text-center text-sm text-[var(--color-ink-500)]">
          Aun no tienes cuenta?
          <a routerLink="/register/cliente" class="text-[var(--color-brand-700)] font-medium">
            Crear cuenta
          </a>
        </div>

        <div class="mt-6 rounded-lg bg-[var(--color-surface-muted)] p-3 text-xs text-[var(--color-ink-500)]">
          <strong class="text-[var(--color-ink-700)]">Cuentas demo:</strong>
          <ul class="mt-1 space-y-0.5">
            <li>cliente / cliente123</li>
            <li>experto / experto123</li>
            <li>admin / admin123</li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.errorMessage.set(null);

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';

    this.auth.login(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.toast.success('Bienvenido', `Hola, ${response.username}`);
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading.set(false);
        const status = (err as { status?: number })?.status;
        if (status === 0) {
          this.errorMessage.set(
            'No pudimos contactar al servidor. El backend esta corriendo en localhost:8080?',
          );
        } else if (status === 401 || status === 403) {
          this.errorMessage.set('Credenciales incorrectas. Verifica tu usuario y contrasena.');
        } else {
          this.errorMessage.set(this.extractMessage(err));
        }
      },
    });
  }

  private extractMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const body = (err as { error?: { message?: string } | string }).error;
      if (typeof body === 'string' && body.length) return body;
      if (body && typeof body === 'object' && 'message' in body && body.message) {
        return body.message as string;
      }
    }
    return 'No se pudo iniciar sesion. Intentalo de nuevo.';
  }
}
