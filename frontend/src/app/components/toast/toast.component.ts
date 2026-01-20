import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
      <div 
        *ngFor="let toast of toasts" 
        class="toast show align-items-center text-white bg-{{ getToastClass(toast.type) }} border-0"
        role="alert">
        <div class="d-flex">
          <div class="toast-body">
            <i [class]="getIconClass(toast.type)" class="me-2"></i>
            {{ toast.message }}
          </div>
          <button 
            type="button" 
            class="btn-close btn-close-white me-2 m-auto" 
            (click)="removeToast(toast.id)"
            aria-label="Close"></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      max-width: 400px;
    }
    .toast {
      margin-bottom: 0.5rem;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private destroy$ = new Subject<void>();

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toasts$.pipe(takeUntil(this.destroy$)).subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeToast(id: number): void {
    this.toastService.remove(id);
  }

  getToastClass(type: string): string {
    const classes: { [key: string]: string } = {
      success: 'success',
      error: 'danger',
      warning: 'warning',
      info: 'info'
    };
    return classes[type] || 'info';
  }

  getIconClass(type: string): string {
    const icons: { [key: string]: string } = {
      success: 'bi bi-check-circle-fill',
      error: 'bi bi-exclamation-triangle-fill',
      warning: 'bi bi-exclamation-circle-fill',
      info: 'bi bi-info-circle-fill'
    };
    return icons[type] || 'bi bi-info-circle-fill';
  }
}

