import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { IngredientService } from '../../services/ingredient.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.model';
import { Ingredient } from '../../models/product.model';
import { RecipeModalComponent } from '../recipe-modal/recipe-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RecipeModalComponent],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1 fw-bold text-dark">Dashboard</h1>
          <p class="text-muted mb-0">Resumen general del sistema</p>
        </div>
        <div>
          <a routerLink="/products/new" class="btn btn-primary me-2">
            <i class="bi bi-plus-lg me-2"></i>Nuevo Producto
          </a>
          <a routerLink="/ingredients" class="btn btn-outline-primary">
            <i class="bi bi-box-seam me-2"></i>Ingredientes
          </a>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-3 col-sm-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="stat-icon bg-primary bg-opacity-10 text-primary rounded p-3">
                    <i class="bi bi-box-seam fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small text-uppercase fw-semibold">Total Productos</div>
                  <div class="h4 mb-0 fw-bold">{{ metrics.totalProducts }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 col-sm-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="stat-icon bg-success bg-opacity-10 text-success rounded p-3">
                    <i class="bi bi-currency-dollar fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small text-uppercase fw-semibold">Valor Total</div>
                  <div class="h4 mb-0 fw-bold">{{ metrics.totalValue | currency:'USD':'symbol':'1.0-0' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 col-sm-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="stat-icon bg-info bg-opacity-10 text-info rounded p-3">
                    <i class="bi bi-graph-up-arrow fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small text-uppercase fw-semibold">Margen Promedio</div>
                  <div class="h4 mb-0 fw-bold" [ngClass]="getMarginClass()">
                    {{ metrics.averageMargin | currency:'USD':'symbol':'1.0-0' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 col-sm-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="stat-icon bg-warning bg-opacity-10 text-warning rounded p-3">
                    <i class="bi bi-exclamation-triangle fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <div class="text-muted small text-uppercase fw-semibold">Productos con Pérdida</div>
                  <div class="h4 mb-0 fw-bold text-danger">{{ metrics.negativeMarginProducts }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-bottom">
              <h5 class="mb-0 fw-semibold">Productos con Márgenes Negativos</h5>
            </div>
            <div class="card-body">
              <div *ngIf="negativeMarginProducts.length === 0" class="text-center py-4 text-muted">
                <i class="bi bi-check-circle fs-1 d-block mb-2"></i>
                <p>No hay productos con márgenes negativos</p>
              </div>
              <div *ngIf="negativeMarginProducts.length > 0" class="table-responsive">
                <table class="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th class="text-end">Precio</th>
                      <th class="text-end">Coste</th>
                      <th class="text-end">Pérdida</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let product of negativeMarginProducts">
                      <td>{{ product.name }}</td>
                      <td class="text-end">{{ product.price | currency:'USD':'symbol':'1.2-2' }}</td>
                      <td class="text-end">{{ product.calculatedCost | currency:'USD':'symbol':'1.2-2' }}</td>
                      <td class="text-end fw-bold text-danger">
                        {{ product.profitMargin | currency:'USD':'symbol':'1.2-2' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-bottom">
              <h5 class="mb-0 fw-semibold">Resumen de Ingredientes</h5>
            </div>
            <div class="card-body">
              <div *ngIf="loading" class="text-center py-4">
                <div class="spinner-border text-primary"></div>
              </div>
              <div *ngIf="!loading" class="row g-3">
                <div class="col-6">
                  <div class="text-muted small">Total Ingredientes</div>
                  <div class="h5 mb-0 fw-bold">{{ metrics.totalIngredients }}</div>
                </div>
                <div class="col-6">
                  <div class="text-muted small">Stock Bajo</div>
                  <div class="h5 mb-0 fw-bold text-warning">{{ metrics.lowStockIngredients }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom">
              <h5 class="mb-0 fw-semibold">Productos Recientes</h5>
            </div>
            <div class="card-body">
              <div *ngIf="recentProducts.length === 0" class="text-center py-4 text-muted">
                <p>No hay productos registrados</p>
                <a routerLink="/products/new" class="btn btn-primary">Crear Primer Producto</a>
              </div>
              <div *ngIf="recentProducts.length > 0" class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Producto</th>
                      <th class="text-end">Precio</th>
                      <th class="text-center">Stock</th>
                      <th class="text-end">Margen</th>
                      <th class="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let product of recentProducts">
                      <td>
                        <div class="fw-semibold">{{ product.name }}</div>
                        <small class="text-muted">{{ product.description || 'Sin descripción' }}</small>
                      </td>
                      <td class="text-end">{{ product.price | currency:'USD':'symbol':'1.2-2' }}</td>
                      <td class="text-center">
                        <span [class]="getStockBadgeClass(product.stock)">
                          {{ product.stock }}
                        </span>
                      </td>
                      <td class="text-end">
                        <span [ngClass]="getMarginBadgeClass(product.profitMargin || 0)">
                          {{ product.profitMargin | currency:'USD':'symbol':'1.2-2' }}
                        </span>
                      </td>
                      <td class="text-end">
                        <button 
                          class="btn btn-sm btn-outline-primary"
                          (click)="viewRecipe(product.id!)"
                          title="Ver Escandallo">
                          <i class="bi bi-clipboard-data"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <app-recipe-modal [productId]="selectedProductId || 0"></app-recipe-modal>
  `,
  styles: [`
    .stat-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  ingredients: Ingredient[] = [];
  loading = false;
  metrics = {
    totalProducts: 0,
    totalValue: 0,
    averageMargin: 0,
    negativeMarginProducts: 0,
    totalIngredients: 0,
    lowStockIngredients: 0
  };
  negativeMarginProducts: Product[] = [];
  recentProducts: Product[] = [];
  selectedProductId: number | null = null;

  constructor(
    private productService: ProductService,
    private ingredientService: IngredientService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.calculateMetrics();
        this.loading = false;
        console.log('Productos cargados:', products.length);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.toastService.error('Error al cargar productos: ' + (err.message || 'Error desconocido'));
        this.loading = false;
      }
    });

    this.ingredientService.getAllIngredients().subscribe({
      next: (ingredients) => {
        this.ingredients = ingredients;
        this.calculateIngredientMetrics();
        console.log('Ingredientes cargados:', ingredients.length);
      },
      error: (err) => {
        console.error('Error al cargar ingredientes:', err);
      }
    });
  }

  calculateMetrics(): void {
    this.metrics.totalProducts = this.products.length;
    this.metrics.totalValue = this.products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    
    const productsWithMargin = this.products.filter(p => p.profitMargin !== undefined);
    if (productsWithMargin.length > 0) {
      this.metrics.averageMargin = productsWithMargin.reduce((sum, p) => sum + (p.profitMargin || 0), 0) / productsWithMargin.length;
    }

    this.negativeMarginProducts = this.products.filter(p => (p.profitMargin || 0) < 0);
    this.metrics.negativeMarginProducts = this.negativeMarginProducts.length;

    this.recentProducts = [...this.products].slice(-5).reverse();
  }

  calculateIngredientMetrics(): void {
    this.metrics.totalIngredients = this.ingredients.length;
    this.metrics.lowStockIngredients = this.ingredients.filter(i => i.currentStock < 10).length;
  }

  getStockBadgeClass(stock: number): string {
    if (stock === 0) return 'badge bg-danger';
    if (stock < 10) return 'badge bg-warning text-dark';
    return 'badge bg-success';
  }

  getMarginBadgeClass(margin: number): string {
    if (margin < 0) return 'badge bg-danger';
    if (margin < 10) return 'badge bg-warning text-dark';
    return 'badge bg-success';
  }

  getMarginClass(): string {
    return this.metrics.averageMargin < 0 ? 'text-danger' : 'text-success';
  }

  viewRecipe(productId: number): void {
    this.selectedProductId = productId;
    setTimeout(() => {
      const modalElement = document.getElementById('recipeModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 100);
  }
}

