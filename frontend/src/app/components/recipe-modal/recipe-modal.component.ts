import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-recipe-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal fade" id="recipeModal" tabindex="-1" aria-labelledby="recipeModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold" id="recipeModalLabel">
              <i class="bi bi-clipboard-data me-2"></i>Escandallo: {{ product?.name }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div *ngIf="loading" class="text-center py-4">
              <div class="spinner-border text-primary"></div>
            </div>

            <div *ngIf="!loading && product">
              <div class="row mb-4">
                <div class="col-md-6">
                  <div class="card border-0 bg-light">
                    <div class="card-body">
                      <h6 class="text-muted mb-2">Precio de Venta</h6>
                      <h4 class="mb-0 fw-bold text-primary">{{ product.price | currency:'USD':'symbol':'1.2-2' }}</h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card border-0" [ngClass]="getCostCardClass()">
                    <div class="card-body">
                      <h6 class="text-muted mb-2">Coste Calculado</h6>
                      <h4 class="mb-0 fw-bold">{{ product.calculatedCost | currency:'USD':'symbol':'1.2-2' }}</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card border-0 mb-3" [ngClass]="getMarginCardClass()">
                <div class="card-body text-center py-3">
                  <h6 class="text-muted mb-2">Margen de Beneficio</h6>
                  <h3 class="mb-0 fw-bold" [ngClass]="getMarginTextClass()">
                    {{ product.profitMargin | currency:'USD':'symbol':'1.2-2' }}
                    <span class="fs-6">({{ getMarginPercentage() }}%)</span>
                  </h3>
                </div>
              </div>

              <div *ngIf="product.recipes && product.recipes.length > 0">
                <h6 class="fw-semibold mb-3">Ingredientes</h6>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead class="table-light">
                      <tr>
                        <th>Ingrediente</th>
                        <th class="text-end">Cantidad</th>
                        <th class="text-end">Coste Unitario</th>
                        <th class="text-end">Coste Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let recipe of product.recipes">
                        <td>{{ recipe.ingredient.name }}</td>
                        <td class="text-end">{{ recipe.quantity }} {{ recipe.ingredient.unit }}</td>
                        <td class="text-end">{{ recipe.ingredient.costPrice | currency:'USD':'symbol':'1.2-2' }}</td>
                        <td class="text-end fw-semibold">
                          {{ (recipe.ingredient.costPrice * recipe.quantity) | currency:'USD':'symbol':'1.2-2' }}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot class="table-light">
                      <tr>
                        <th colspan="3" class="text-end">Total Coste:</th>
                        <th class="text-end">{{ product.calculatedCost | currency:'USD':'symbol':'1.2-2' }}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div *ngIf="!product.recipes || product.recipes.length === 0" class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>Este producto no tiene ingredientes asignados.
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-content {
      border-radius: 0.5rem;
    }
  `]
})
export class RecipeModalComponent implements OnInit, OnChanges {
  @Input() productId: number = 0;
  product: Product | null = null;
  loading = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    if (this.productId && this.productId > 0) {
      this.loadProduct();
    }
  }

  ngOnChanges(): void {
    if (this.productId && this.productId > 0) {
      this.loadProduct();
    }
  }

  loadProduct(): void {
    this.loading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getMarginCardClass(): string {
    if (!this.product?.profitMargin) return 'bg-light';
    return this.product.profitMargin < 0 ? 'bg-danger bg-opacity-10' : 'bg-success bg-opacity-10';
  }

  getCostCardClass(): string {
    if (!this.product?.profitMargin) return 'bg-light';
    return this.product.profitMargin < 0 ? 'bg-danger bg-opacity-10' : 'bg-light';
  }

  getMarginTextClass(): string {
    if (!this.product?.profitMargin) return 'text-dark';
    return this.product.profitMargin < 0 ? 'text-danger' : 'text-success';
  }

  getMarginPercentage(): string {
    if (!this.product?.price || !this.product?.calculatedCost) return '0';
    const percentage = (this.product.profitMargin! / this.product.price) * 100;
    return percentage.toFixed(1);
  }
}
