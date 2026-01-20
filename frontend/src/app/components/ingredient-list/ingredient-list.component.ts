import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IngredientService } from '../../services/ingredient.service';
import { ToastService } from '../../services/toast.service';
import { Ingredient } from '../../models/product.model';

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1 fw-bold text-dark">Gestión de Ingredientes</h1>
          <p class="text-muted mb-0">Administración de materias primas</p>
        </div>
        <button class="btn btn-primary" (click)="openModal()">
          <i class="bi bi-plus-lg me-2"></i>Nuevo Ingrediente
        </button>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>

          <div *ngIf="!loading && ingredients.length === 0" class="text-center py-5">
            <i class="bi bi-inbox display-4 text-muted"></i>
            <p class="text-muted mt-3 mb-0">No hay ingredientes registrados</p>
            <button class="btn btn-primary mt-3" (click)="openModal()">
              <i class="bi bi-plus-lg me-2"></i>Crear Primer Ingrediente
            </button>
          </div>

          <div *ngIf="!loading && ingredients.length > 0" class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Nombre</th>
                  <th class="text-end">Coste Unitario</th>
                  <th class="text-center">Stock Actual</th>
                  <th class="text-center">Unidad</th>
                  <th class="text-end">Valor Total</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ingredient of ingredients" [class.table-warning]="ingredient.currentStock < 10">
                  <td>
                    <div class="fw-semibold">{{ ingredient.name }}</div>
                  </td>
                  <td class="text-end">
                    <span *ngIf="editingPriceId !== ingredient.id" class="fw-semibold">
                      {{ ingredient.costPrice | currency:'USD':'symbol':'1.2-2' }}
                    </span>
                    <div *ngIf="editingPriceId === ingredient.id" class="d-flex align-items-center gap-2">
                      <div class="input-group input-group-sm" style="width: 120px;">
                        <span class="input-group-text">€</span>
                        <input 
                          type="number" 
                          class="form-control" 
                          [(ngModel)]="tempPrice"
                          step="0.01"
                          min="0.01"
                          (keyup.enter)="savePrice(ingredient)"
                          (keyup.escape)="cancelPriceEdit()"
                          #priceInput>
                      </div>
                      <button class="btn btn-sm btn-success" (click)="savePrice(ingredient)" title="Guardar">
                        <i class="bi bi-check"></i>
                      </button>
                      <button class="btn btn-sm btn-secondary" (click)="cancelPriceEdit()" title="Cancelar">
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                  </td>
                  <td class="text-center">
                    <span [class]="getStockBadgeClass(ingredient.currentStock)">
                      {{ ingredient.currentStock }}
                    </span>
                  </td>
                  <td class="text-center">
                    <span class="badge bg-secondary">{{ ingredient.unit }}</span>
                  </td>
                  <td class="text-end">
                    <span class="fw-semibold">
                      {{ (ingredient.costPrice * ingredient.currentStock) | currency:'USD':'symbol':'1.2-2' }}
                    </span>
                  </td>
                  <td class="text-center">
                    <div class="btn-group" role="group">
                      <button 
                        *ngIf="editingPriceId !== ingredient.id"
                        class="btn btn-sm btn-outline-warning"
                        (click)="editPrice(ingredient)"
                        title="Editar Precio">
                        <i class="bi bi-currency-euro"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-primary"
                        (click)="editIngredient(ingredient)"
                        title="Editar Completo">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-danger"
                        (click)="deleteIngredient(ingredient.id!)"
                        title="Eliminar">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="ingredientModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingIngredient ? 'Editar' : 'Nuevo' }} Ingrediente</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form #ingredientForm="ngForm">
              <div class="mb-3">
                <label class="form-label">Nombre <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  [(ngModel)]="formIngredient.name"
                  name="name"
                  required>
              </div>
              <div class="mb-3">
                <label class="form-label">Coste Unitario <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input 
                    type="number" 
                    class="form-control" 
                    [(ngModel)]="formIngredient.costPrice"
                    name="costPrice"
                    step="0.01"
                    min="0.01"
                    required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Stock Actual <span class="text-danger">*</span></label>
                <input 
                  type="number" 
                  class="form-control" 
                  [(ngModel)]="formIngredient.currentStock"
                  name="currentStock"
                  min="0"
                  required>
              </div>
              <div class="mb-3">
                <label class="form-label">Unidad <span class="text-danger">*</span></label>
                <select 
                  class="form-select" 
                  [(ngModel)]="formIngredient.unit"
                  name="unit"
                  required>
                  <option value="">Seleccione...</option>
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="g">Gramos (g)</option>
                  <option value="L">Litros (L)</option>
                  <option value="ml">Mililitros (ml)</option>
                  <option value="unidad">Unidad</option>
                  <option value="paquete">Paquete</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button 
              type="button" 
              class="btn btn-primary"
              (click)="saveIngredient()"
              [disabled]="!ingredientForm.form.valid || saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-warning {
      background-color: #fff3cd !important;
    }
  `]
})
export class IngredientListComponent implements OnInit {
  ingredients: Ingredient[] = [];
  loading = false;
  saving = false;
  editingIngredient: Ingredient | null = null;
  editingPriceId: number | null = null;
  tempPrice: number = 0;
  formIngredient: Ingredient = {
    name: '',
    costPrice: 0,
    currentStock: 0,
    unit: ''
  };

  constructor(
    private ingredientService: IngredientService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadIngredients();
  }

  loadIngredients(): void {
    this.loading = true;
    this.ingredientService.getAllIngredients().subscribe({
      next: (ingredients) => {
        this.ingredients = ingredients;
        this.loading = false;
      },
      error: (err) => {
        this.toastService.error('Error al cargar ingredientes');
        this.loading = false;
      }
    });
  }

  openModal(): void {
    this.editingIngredient = null;
    this.formIngredient = {
      name: '',
      costPrice: 0,
      currentStock: 0,
      unit: ''
    };
    const modal = new (window as any).bootstrap.Modal(document.getElementById('ingredientModal'));
    modal.show();
  }

  editPrice(ingredient: Ingredient): void {
    this.editingPriceId = ingredient.id!;
    this.tempPrice = ingredient.costPrice;
    setTimeout(() => {
      const input = document.querySelector('input[type="number"]') as HTMLInputElement;
      if (input) input.focus();
    }, 100);
  }

  savePrice(ingredient: Ingredient): void {
    if (this.tempPrice <= 0) {
      this.toastService.warning('El precio debe ser mayor a 0');
      return;
    }
    
    const updatedIngredient = { ...ingredient, costPrice: this.tempPrice };
    this.saving = true;
    
    this.ingredientService.updateIngredient(ingredient.id!, updatedIngredient).subscribe({
      next: () => {
        this.toastService.success(`Precio de ${ingredient.name} actualizado correctamente`);
        this.loadIngredients();
        this.cancelPriceEdit();
        this.saving = false;
      },
      error: (err) => {
        this.toastService.error(err.message || 'Error al actualizar precio');
        this.saving = false;
      }
    });
  }

  cancelPriceEdit(): void {
    this.editingPriceId = null;
    this.tempPrice = 0;
  }

  editIngredient(ingredient: Ingredient): void {
    this.editingIngredient = ingredient;
    this.formIngredient = { ...ingredient };
    const modal = new (window as any).bootstrap.Modal(document.getElementById('ingredientModal'));
    modal.show();
  }

  saveIngredient(): void {
    this.saving = true;
    const operation = this.editingIngredient
      ? this.ingredientService.updateIngredient(this.editingIngredient.id!, this.formIngredient)
      : this.ingredientService.createIngredient(this.formIngredient);

    operation.subscribe({
      next: () => {
        this.toastService.success(
          `Ingrediente ${this.editingIngredient ? 'actualizado' : 'creado'} correctamente`
        );
        const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('ingredientModal'));
        modal.hide();
        this.loadIngredients();
        this.saving = false;
      },
      error: (err) => {
        this.toastService.error(err.message || 'Error al guardar ingrediente');
        this.saving = false;
      }
    });
  }

  deleteIngredient(id: number): void {
    const ingredient = this.ingredients.find(i => i.id === id);
    if (confirm(`¿Está seguro de eliminar "${ingredient?.name}"?`)) {
      this.ingredientService.deleteIngredient(id).subscribe({
        next: () => {
          this.toastService.success('Ingrediente eliminado correctamente');
          this.loadIngredients();
        },
        error: (err) => {
          this.toastService.error(err.message || 'Error al eliminar ingrediente');
        }
      });
    }
  }

  getStockBadgeClass(stock: number): string {
    if (stock === 0) return 'badge bg-danger';
    if (stock < 10) return 'badge bg-warning text-dark';
    return 'badge bg-success';
  }
}

