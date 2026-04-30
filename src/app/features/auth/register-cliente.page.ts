import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/icons/icon.component';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { ToastService } from '../../shared/services/toast.service';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

@Component({
  selector: 'app-register-cliente-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, IconComponent, LogoComponent],
  template: `
    <section class="mx-auto max-w-lg px-4 py-12">
      <div class="mb-6 flex justify-center">
        <app-logo [size]="36" />
      </div>
      <div class="card p-6 md:p-8">
        <h1 class="text-2xl">Crear cuenta</h1>
        <p class="mt-1 text-sm text-[var(--color-ink-500)]">
          Regístrate gratis para descubrir recetas y reservar consultas.
        </p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="mt-6 space-y-4" novalidate>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label" for="reg-first">Nombres</label>
              <input
                id="reg-first"
                class="input"
                autocomplete="given-name"
                formControlName="firstName"
              />
            </div>
            <div>
              <label class="label" for="reg-last">Apellidos</label>
              <input
                id="reg-last"
                class="input"
                autocomplete="family-name"
                formControlName="lastName"
              />
            </div>
          </div>

          <div>
            <label class="label" for="reg-email">Correo</label>
            <div class="relative">
              <span
                class="absolute inset-y-0 left-3 flex items-center text-[var(--color-ink-300)]"
              >
                <app-icon name="mail" [size]="16" />
              </span>
              <input
                id="reg-email"
                type="email"
                class="input pl-9"
                autocomplete="email"
                formControlName="email"
              />
            </div>
          </div>

          <div>
            <label class="label" for="reg-phone">Teléfono (opcional)</label>
            <div class="relative">
              <span
                class="absolute inset-y-0 left-3 flex items-center text-[var(--color-ink-300)]"
              >
                <app-icon name="phone" [size]="16" />
              </span>
              <input
                id="reg-phone"
                class="input pl-9"
                autocomplete="tel"
                placeholder="+51999999999"
                formControlName="phone"
              />
            </div>
          </div>

          <div>
            <label class="label" for="reg-pass">Contraseña</label>
            <div class="relative">
              <span
                class="absolute inset-y-0 left-3 flex items-center text-[var(--color-ink-300)]"
              >
                <app-icon name="lock" [size]="16" />
              </span>
              <input
                id="reg-pass"
                type="password"
                class="input pl-9"
                autocomplete="new-password"
                formControlName="password"
              />
            </div>
            <p class="mt-1 text-xs text-[var(--color-ink-500)]">
              Mínimo 8 caracteres con una mayúscula, una minúscula y un número.
            </p>
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
            Crear cuenta
          </app-button>

          <p class="text-xs text-[var(--color-ink-500)]">
            Al registrarte aceptas los
            <a routerLink="/terms" class="underline">términos</a> y la
            <a routerLink="/privacy" class="underline">política de privacidad</a>.
          </p>

          <div class="text-sm text-[var(--color-ink-500)] border-t border-[var(--color-border)] pt-4">
            ¿Eres profesional de la medicina natural?
            <a routerLink="/register/experto" class="text-[var(--color-brand-700)] font-medium">
              Regístrate como experto
            </a>
          </div>
        </form>
      </div>
    </section>
  `,
})
export class RegisterClientePage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    phone: ['', [Validators.pattern(/^$|^\+?[0-9]{7,15}$/)]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.pattern(PASSWORD_PATTERN)],
    ],
  });

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth.registerCliente(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.toast.success('Cuenta creada', `¡Bienvenido, ${response.user.firstName}!`);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(this.extractMessage(err));
      },
    });
  }

  private extractMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status?: number; error?: { message?: string; details?: Record<string, string> } };
      if (e.status === 0)
        return 'No pudimos contactar al servidor. ¿El backend está corriendo en localhost:8080?';
      if (e.status === 409) return 'Ese correo ya está registrado. Intenta iniciar sesión.';
      if (e.error?.details) {
        const first = Object.values(e.error.details)[0];
        if (first) return first;
      }
      if (e.error?.message) return e.error.message;
    }
    return 'No se pudo crear la cuenta. Revisa los datos e inténtalo de nuevo.';
  }
}
