import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" routerLink="/dashboard">
          <i class="bi bi-calculator me-2"></i>Sistema de Cálculo de Costes
        </a>
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto" *ngIf="isAuthenticated">
            <li class="nav-item">
              <a 
                class="nav-link" 
                routerLink="/dashboard" 
                routerLinkActive="active" 
                [routerLinkActiveOptions]="{exact: true}">
                <i class="bi bi-speedometer2 me-1"></i>Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                routerLink="/products" 
                routerLinkActive="active">
                <i class="bi bi-box-seam me-1"></i>Productos
              </a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                routerLink="/ingredients" 
                routerLinkActive="active">
                <i class="bi bi-basket me-1"></i>Ingredientes
              </a>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto" *ngIf="isAuthenticated">
            <li class="nav-item">
              <a 
                class="nav-link" 
                routerLink="/products/new" 
                routerLinkActive="active">
                <i class="bi bi-plus-circle me-1"></i>Nuevo Producto
              </a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle me-1"></i>{{ username }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" (click)="navigateToProfile()">
                  <i class="bi bi-person-vcard me-2"></i>Mi Perfil
                </a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" (click)="logout()">
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </a></li>
              </ul>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto" *ngIf="!isAuthenticated">
            <li class="nav-item">
              <a class="nav-link" routerLink="/login">Iniciar Sesión</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/register">Registrarse</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-size: 1.25rem;
    }
    .nav-link {
      font-weight: 500;
    }
    .nav-link.active {
      font-weight: 600;
      color: #fff !important;
    }
    .dropdown-item {
      cursor: pointer;
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  username: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.auth$.pipe(takeUntil(this.destroy$)).subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.username = this.authService.getUsername();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
    this.closeDropdown();
  }

  closeDropdown(): void {
    setTimeout(() => {
      const dropdownElement = document.querySelector('.dropdown-menu.show');
      if (dropdownElement) {
        const dropdown = dropdownElement.closest('.dropdown');
        if (dropdown) {
          const bsDropdown = (window as any).bootstrap?.Dropdown?.getInstance(dropdown);
          if (bsDropdown) {
            bsDropdown.hide();
          } else {
            dropdown.classList.remove('show');
            dropdown.querySelector('.dropdown-menu')?.classList.remove('show');
          }
        }
      }
    }, 100);
  }
}
