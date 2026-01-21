import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-lg-4 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <div class="position-relative d-inline-block mb-3">
                <img 
                  [src]="profile.profilePicture || getDefaultAvatar()" 
                  [alt]="profile.username"
                  class="rounded-circle border border-3 border-primary"
                  style="width: 150px; height: 150px; object-fit: cover;"
                  onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'150\' height=\'150\'%3E%3Crect fill=\'%23ddd\' width=\'150\' height=\'150\'/%3E%3Ctext fill=\'%23999\' font-family=\'sans-serif\' font-size=\'50\' dy=\'10.5\' font-weight=\'bold\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\'%3E{{ getInitials() }}%3C/text%3E%3C/svg%3E'">
                <button 
                  class="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
                  (click)="triggerFileInput()"
                  title="Cambiar foto">
                  <i class="bi bi-camera"></i>
                </button>
                <input 
                  type="file" 
                  #fileInput
                  accept="image/*"
                  (change)="onFileSelected($event)"
                  class="d-none">
              </div>
              <h4 class="mb-1">{{ getFullName() || profile.username }}</h4>
              <p class="text-muted mb-2">@{{ profile.username }}</p>
              <div class="mb-3">
                <span *ngFor="let role of profile.roles" class="badge bg-secondary me-1">
                  {{ role.replace('ROLE_', '') }}
                </span>
              </div>
              <p *ngIf="profile.bio" class="text-muted small">{{ profile.bio }}</p>
            </div>
          </div>

          <div class="card border-0 shadow-sm mt-3">
            <div class="card-header bg-white">
              <h6 class="mb-0">Información de contacto</h6>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <small class="text-muted d-block">Email</small>
                <div>{{ profile.email }}</div>
              </div>
              <div *ngIf="profile.phone">
                <small class="text-muted d-block">Teléfono</small>
                <div>{{ profile.phone }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Editar Perfil</h5>
              <button 
                class="btn btn-sm btn-outline-secondary"
                (click)="editMode = !editMode"
                *ngIf="!editMode">
                <i class="bi bi-pencil me-1"></i>Editar
              </button>
            </div>
            <div class="card-body">
              <form *ngIf="editMode" (ngSubmit)="saveProfile()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Nombre</label>
                    <input 
                      type="text" 
                      class="form-control"
                      [(ngModel)]="editForm.firstName"
                      name="firstName"
                      placeholder="Nombre">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Apellidos</label>
                    <input 
                      type="text" 
                      class="form-control"
                      [(ngModel)]="editForm.lastName"
                      name="lastName"
                      placeholder="Apellidos">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email <span class="text-danger">*</span></label>
                  <input 
                    type="email" 
                    class="form-control"
                    [(ngModel)]="editForm.email"
                    name="email"
                    required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Teléfono</label>
                  <input 
                    type="tel" 
                    class="form-control"
                    [(ngModel)]="editForm.phone"
                    name="phone"
                    placeholder="+34 600 000 000">
                </div>
                <div class="mb-3">
                  <label class="form-label">Biografía</label>
                  <textarea 
                    class="form-control"
                    [(ngModel)]="editForm.bio"
                    name="bio"
                    rows="4"
                    placeholder="Cuéntanos sobre ti..."></textarea>
                </div>
                <div class="d-flex gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="saving">
                    <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                    {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-secondary"
                    (click)="cancelEdit()"
                    [disabled]="saving">
                    Cancelar
                  </button>
                </div>
              </form>
              <div *ngIf="!editMode">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <small class="text-muted d-block">Nombre</small>
                    <div>{{ profile.firstName || '-' }}</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <small class="text-muted d-block">Apellidos</small>
                    <div>{{ profile.lastName || '-' }}</div>
                  </div>
                </div>
                <div class="mb-3">
                  <small class="text-muted d-block">Email</small>
                  <div>{{ profile.email }}</div>
                </div>
                <div class="mb-3">
                  <small class="text-muted d-block">Teléfono</small>
                  <div>{{ profile.phone || '-' }}</div>
                </div>
                <div class="mb-3">
                  <small class="text-muted d-block">Biografía</small>
                  <div>{{ profile.bio || '-' }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">Cambiar Contraseña</h5>
            </div>
            <div class="card-body">
              <form (ngSubmit)="changePassword()">
                <div class="mb-3">
                  <label class="form-label">Contraseña Actual</label>
                  <input 
                    type="password" 
                    class="form-control"
                    [(ngModel)]="passwordForm.currentPassword"
                    name="currentPassword"
                    required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Nueva Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control"
                    [(ngModel)]="passwordForm.newPassword"
                    name="newPassword"
                    required
                    minlength="6">
                  <small class="text-muted">Mínimo 6 caracteres</small>
                </div>
                <button 
                  type="submit" 
                  class="btn btn-warning"
                  [disabled]="changingPassword">
                  <span *ngIf="changingPassword" class="spinner-border spinner-border-sm me-2"></span>
                  {{ changingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-2px);
    }
  `]
})
export class ProfileComponent implements OnInit {
  profile: UserProfile = {
    id: 0,
    username: '',
    email: '',
    roles: []
  };
  
  editMode = false;
  saving = false;
  changingPassword = false;
  loading = true;

  editForm: UpdateProfileRequest = {};
  passwordForm: ChangePasswordRequest = {
    currentPassword: '',
    newPassword: ''
  };

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.editForm = {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          bio: profile.bio,
          profilePicture: profile.profilePicture
        };
        this.loading = false;
      },
      error: (err) => {
        this.toastService.error(err.message || 'Error al cargar perfil');
        this.loading = false;
      }
    });
  }

  saveProfile(): void {
    this.saving = true;
    this.userService.updateProfile(this.editForm).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.editMode = false;
        this.saving = false;
        this.toastService.success('Perfil actualizado correctamente');
      },
      error: (err) => {
        this.toastService.error(err.message || 'Error al actualizar perfil');
        this.saving = false;
      }
    });
  }

  cancelEdit(): void {
    this.editForm = {
      firstName: this.profile.firstName,
      lastName: this.profile.lastName,
      email: this.profile.email,
      phone: this.profile.phone,
      bio: this.profile.bio,
      profilePicture: this.profile.profilePicture
    };
    this.editMode = false;
  }

  changePassword(): void {
    if (this.passwordForm.newPassword.length < 6) {
      this.toastService.warning('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.changingPassword = true;
    this.userService.changePassword(this.passwordForm).subscribe({
      next: () => {
        this.passwordForm = { currentPassword: '', newPassword: '' };
        this.changingPassword = false;
        this.toastService.success('Contraseña cambiada correctamente');
      },
      error: (err) => {
        this.toastService.error(err.message || 'Error al cambiar contraseña');
        this.changingPassword = false;
      }
    });
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error('La imagen no puede superar los 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editForm.profilePicture = e.target.result;
        this.profile.profilePicture = e.target.result;
        this.userService.updateProfile({ profilePicture: e.target.result }).subscribe({
          next: () => {
            this.toastService.success('Foto de perfil actualizada');
          },
          error: (err) => {
            this.toastService.error(err.message || 'Error al actualizar foto');
          }
        });
      };
      reader.readAsDataURL(file);
    }
  }

  getFullName(): string {
    if (this.profile.firstName || this.profile.lastName) {
      return `${this.profile.firstName || ''} ${this.profile.lastName || ''}`.trim();
    }
    return '';
  }

  getInitials(): string {
    if (this.profile.firstName && this.profile.lastName) {
      return `${this.profile.firstName[0]}${this.profile.lastName[0]}`.toUpperCase();
    }
    return this.profile.username.substring(0, 2).toUpperCase();
  }

  getDefaultAvatar(): string {
    const initials = this.getInitials();
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23007bff' width='150' height='150'/%3E%3Ctext fill='white' font-family='sans-serif' font-size='50' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E${initials}%3C/text%3E%3C/svg%3E`;
  }
}

