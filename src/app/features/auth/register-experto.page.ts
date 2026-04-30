import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

import { AuthService } from '../../core/auth/services/auth.service';
import { CatalogService } from '../../core/services/catalog.service';
import { Especialidad } from '../../core/models/catalog.models';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/icons/icon.component';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { ToastService } from '../../shared/services/toast.service';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

@Component({
  selector: 'app-register-experto-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, IconComponent, LogoComponent],
  template: `
    <section class="mx-auto max-w-2xl px-4 py-12">
      <div class="mb-6 flex justify-center">
        <app-logo [size]="36" />
      </div>
      <div class="card p-6 md:p-8">
        <div class="flex items-start gap-3">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-50)] text-[var(--color-brand-700)] shrink-0"
          >
            <app-icon name="shield-check" [size]="20" />
          </span>
          <div>
            <h1 class="text-2xl">Postula como experto</h1>
            <p class="mt-1 text-sm text-[var(--color-ink-500)]">
              Comparte tu sabiduría con la comunidad QaliKay. Tu cuenta queda en revisión
              hasta ser verificada por nuestro equipo.
            </p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="mt-6 space-y-5" novalidate>
          <fieldset class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="label" for="exp-first">Nombres</label>
              <input
                id="exp-first"
                class="input"
                autocomplete="given-name"
                formControlName="firstName"
              />
            </div>
            <div>
              <label class="label" for="exp-last">Apellidos</label>
              <input
                id="exp-last"
                class="input"
                autocomplete="family-name"
                formControlName="lastName"
              />
            </div>
          </fieldset>

          <fieldset class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="label" for="exp-email">Correo</label>
              <input
                id="exp-email"
                type="email"
                class="input"
                autocomplete="email"
                formControlName="email"
              />
            </div>
            <div>
              <label class="label" for="exp-phone">Teléfono</label>
              <input
                id="exp-phone"
                class="input"
                autocomplete="tel"
                placeholder="+51999999999"
                formControlName="phone"
              />
            </div>
          </fieldset>

          <div>
            <label class="label" for="exp-pass">Contraseña</label>
            <input
              id="exp-pass"
              type="password"
              class="input"
              autocomplete="new-password"
              formControlName="password"
            />
            <p class="mt-1 text-xs text-[var(--color-ink-500)]">
              Mínimo 8 caracteres con una mayúscula, una minúscula y un número.
            </p>
          </div>

          <div class="grid sm:grid-cols-[2fr_1fr] gap-3">
            <div>
              <label class="label" for="exp-spec">Especialidad</label>
              <select id="exp-spec" class="input" formControlName="specialtyId">
                <option [ngValue]="null" disabled>
                  {{ loadingSpecialties() ? 'Cargando...' : 'Selecciona una especialidad' }}
                </option>
                @for (esp of specialties(); track esp.id) {
                  <option [ngValue]="esp.id">{{ esp.nombre }}</option>
                }
              </select>
            </div>
            <div>
              <label class="label" for="exp-years">Años de experiencia</label>
              <input
                id="exp-years"
                type="number"
                min="0"
                class="input"
                formControlName="yearsOfExperience"
              />
            </div>
          </div>

          <div>
            <label class="label" for="exp-traj">Trayectoria profesional</label>
            <textarea
              id="exp-traj"
              class="input min-h-28"
              rows="4"
              formControlName="trajectory"
              placeholder="Cuéntanos tu experiencia, formación y zonas en las que has trabajado..."
            ></textarea>
            <p class="mt-1 text-xs text-[var(--color-ink-500)]">
              Entre 30 y 1000 caracteres.
              <span [class.text-red-700]="trajectoryLengthExceeded()">
                {{ trajectoryLength() }} / 1000
              </span>
            </p>
          </div>

          <div>
            <label class="label" for="exp-bio">Biografía (opcional)</label>
            <textarea
              id="exp-bio"
              class="input min-h-20"
              rows="3"
              formControlName="biography"
              placeholder="Información adicional, certificaciones, especializaciones..."
            ></textarea>
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
            Enviar postulación
          </app-button>

          <div
            class="text-sm text-[var(--color-ink-500)] border-t border-[var(--color-border)] pt-4"
          >
            ¿Solo deseas comprar y consultar?
            <a routerLink="/register/cliente" class="text-[var(--color-brand-700)] font-medium">
              Crea cuenta de cliente
            </a>
          </div>
        </form>
      </div>
    </section>
  `,
})
export class RegisterExpertoPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly specialties = signal<Especialidad[]>([]);
  protected readonly loadingSpecialties = signal<boolean>(true);

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    phone: ['', [Validators.pattern(/^$|^\+?[0-9]{7,15}$/)]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.pattern(PASSWORD_PATTERN)],
    ],
    specialtyId: this.fb.control<number | null>(null, [Validators.required]),
    trajectory: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(1000)]],
    biography: ['', [Validators.maxLength(2000)]],
    yearsOfExperience: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
  });

  ngOnInit(): void {
    this.catalogService
      .getSpecialties()
      .pipe(catchError(() => of([] as Especialidad[])))
      .subscribe((data) => {
        this.specialties.set(data);
        this.loadingSpecialties.set(false);
      });
  }

  protected trajectoryLength(): number {
    return this.form.controls.trajectory.value?.length ?? 0;
  }

  protected trajectoryLengthExceeded(): boolean {
    return this.trajectoryLength() > 1000;
  }

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();
    this.auth
      .registerExperto({
        firstName: raw.firstName,
        lastName: raw.lastName,
        email: raw.email,
        phone: raw.phone || undefined,
        password: raw.password,
        specialtyId: raw.specialtyId!,
        trajectory: raw.trajectory,
        biography: raw.biography || undefined,
        yearsOfExperience: raw.yearsOfExperience!,
      })
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          this.toast.success('Postulación enviada', `Bienvenido, ${response.user.firstName}.`);
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
      if (e.status === 404) return 'La especialidad seleccionada no existe.';
      if (e.error?.details) {
        const first = Object.values(e.error.details)[0];
        if (first) return first;
      }
      if (e.error?.message) return e.error.message;
    }
    return 'No se pudo enviar la postulación. Revisa los datos e inténtalo de nuevo.';
  }
}
