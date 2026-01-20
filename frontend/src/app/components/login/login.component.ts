import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container-fluid py-5">
      <div class="row justify-content-center">
        <div class="col-md-5 col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4 mb-4 fw-bold text-center">Iniciar Sesión</h2>
              
              <div *ngIf="error" class="alert alert-danger alert-dismissible fade show">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
                <button type="button" class="btn-close" (click)="error = null"></button>
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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

                <div class="mb-4">
                  <label class="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    formControlName="password"
                    [class.is-invalid]="isFieldInvalid('password')"
                    autocomplete="current-password">
                  <div *ngIf="isFieldInvalid('password')" class="invalid-feedback">
                    Contraseña requerida
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100 mb-3"
                  [disabled]="loginForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
                </button>

                <div class="text-center">
                  <a routerLink="/register" class="text-decoration-none">¿No tienes cuenta? Regístrate</a>
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
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = null;

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.toastService.success('Bienvenido');
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
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}


