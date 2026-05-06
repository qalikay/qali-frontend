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
            <h1 class="text-2xl">Registrate como experto</h1>
            <p class="mt-1 text-sm text-[var(--color-ink-500)]">
              Comparte tu sabiduria con la comunidad QaliKay y comienza a publicar recetas e
              insumos.
            </p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="mt-6 space-y-5" novalidate>
          <fieldset class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="label" for="exp-nombres">Nombres</label>
              <input
                id="exp-nombres"
                class="input"
                autocomplete="given-name"
                formControlName="nombres"
              />
            </div>
            <div>
              <label class="label" for="exp-apellidos">Apellidos</label>
              <input
                id="exp-apellidos"
                class="input"
                autocomplete="family-name"
                formControlName="apellidos"
              />
            </div>
          </fieldset>

          <fieldset class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="label" for="exp-username">Usuario</label>
              <input
                id="exp-username"
                class="input"
                autocomplete="username"
                formControlName="username"
                placeholder="usuario"
              />
            </div>
            <div>
              <label class="label" for="exp-phone">Telefono</label>
              <input
                id="exp-phone"
                class="input"
                autocomplete="tel"
                placeholder="+51999999999"
                formControlName="telefono"
              />
            </div>
          </fieldset>

          <div>
            <label class="label" for="exp-pass">Contrasena</label>
            <input
              id="exp-pass"
              type="password"
              class="input"
              autocomplete="new-password"
              formControlName="password"
            />
            <p class="mt-1 text-xs text-[var(--color-ink-500)]">Minimo 4 caracteres.</p>
          </div>

          <div class="grid sm:grid-cols-[2fr_1fr] gap-3">
            <div>
              <label class="label" for="exp-spec">Especialidad</label>
              <select id="exp-spec" class="input" formControlName="especialidadId">
                <option [ngValue]="null" disabled>
                  {{ loadingEspecialidades() ? 'Cargando...' : 'Selecciona una especialidad' }}
                </option>
                @for (esp of especialidades(); track esp.id) {
                  <option [ngValue]="esp.id">{{ esp.nombre }}</option>
                }
              </select>
            </div>
            <div>
              <label class="label" for="exp-years">Anos de experiencia</label>
              <input
                id="exp-years"
                type="number"
                min="0"
                class="input"
                formControlName="anosExperiencia"
              />
            </div>
          </div>

          <div>
            <label class="label" for="exp-traj">Trayectoria profesional</label>
            <textarea
              id="exp-traj"
              class="input min-h-28"
              rows="4"
              formControlName="trayectoria"
              placeholder="Cuentanos tu experiencia, formacion y zonas en las que has trabajado..."
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
            Crear cuenta de experto
          </app-button>

          <div
            class="text-sm text-[var(--color-ink-500)] border-t border-[var(--color-border)] pt-4"
          >
            Solo deseas comprar y consultar?
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
  protected readonly especialidades = signal<Especialidad[]>([]);
  protected readonly loadingEspecialidades = signal<boolean>(true);

  protected readonly form = this.fb.nonNullable.group({
    nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    username: [
      '',
      [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_.-]+$/)],
    ],
    telefono: ['', [Validators.pattern(/^$|^\+?[0-9]{7,15}$/)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    especialidadId: this.fb.control<number | null>(null),
    trayectoria: ['', [Validators.maxLength(1000)]],
    anosExperiencia: this.fb.control<number | null>(null, [Validators.min(0)]),
  });

  ngOnInit(): void {
    this.catalogService
      .getEspecialidades()
      .pipe(catchError(() => of([] as Especialidad[])))
      .subscribe((data) => {
        this.especialidades.set(data);
        this.loadingEspecialidades.set(false);
      });
  }

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();
    this.auth
      .registerExperto({
        username: raw.username,
        password: raw.password,
        nombres: raw.nombres,
        apellidos: raw.apellidos,
        telefono: raw.telefono || undefined,
        especialidadId: raw.especialidadId ?? undefined,
        trayectoria: raw.trayectoria || undefined,
        anosExperiencia: raw.anosExperiencia ?? undefined,
      })
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          this.toast.success('Cuenta creada', `Bienvenido, ${response.username}.`);
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
      const e = err as { status?: number; error?: { message?: string } | string };
      if (e.status === 0)
        return 'No pudimos contactar al servidor. El backend esta corriendo en localhost:8080?';
      if (e.status === 409) return 'Ese usuario ya esta registrado. Intenta iniciar sesion.';
      if (typeof e.error === 'string' && e.error) return e.error;
      if (e.error && typeof e.error === 'object' && 'message' in e.error && e.error.message) {
        return e.error.message as string;
      }
    }
    return 'No se pudo crear la cuenta. Revisa los datos e intentalo de nuevo.';
  }
}
