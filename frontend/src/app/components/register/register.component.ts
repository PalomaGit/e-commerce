import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container-fluid py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4 mb-4 fw-bold text-center">Registro</h2>
              
              <div *ngIf="error" class="alert alert-danger alert-dismissible fade show">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
                <button type="button" class="btn-close" (click)="error = null"></button>
              </div>

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">Usuario</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    formControlName="username"
                    [class.is-invalid]="isFieldInvalid('username')"
                    autocomplete="username">
                  <div *ngIf="isFieldInvalid('username')" class="invalid-feedback">
                    Usuario requerido
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    formControlName="email"
                    [class.is-invalid]="isFieldInvalid('email')"
                    autocomplete="email">
                  <div *ngIf="isFieldInvalid('email')" class="invalid-feedback">
                    Email válido requerido
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    formControlName="password"
                    [class.is-invalid]="isFieldInvalid('password')"
                    autocomplete="new-password">
                  <div *ngIf="isFieldInvalid('password')" class="invalid-feedback">
                    Mínimo 6 caracteres
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">Confirmar Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    formControlName="confirmPassword"
                    [class.is-invalid]="isFieldInvalid('confirmPassword') || registerForm.hasError('passwordMismatch')"
                    autocomplete="new-password">
                  <div *ngIf="registerForm.hasError('passwordMismatch')" class="invalid-feedback">
                    Las contraseñas no coinciden
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100 mb-3"
                  [disabled]="registerForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Registrando...' : 'Registrarse' }}
                </button>

                <div class="text-center">
                  <a routerLink="/login" class="text-decoration-none">¿Ya tienes cuenta? Inicia sesión</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 0.5rem;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value 
      ? null 
      : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = null;

      const { confirmPassword, ...registerData } = this.registerForm.value;
      this.authService.register(registerData).subscribe({
        next: () => {
          this.toastService.success('Registro exitoso. Bienvenido');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = err.message;
          this.toastService.error(err.message);
          this.loading = false;
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}


