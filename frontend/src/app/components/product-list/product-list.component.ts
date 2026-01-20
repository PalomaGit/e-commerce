import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.model';
import { RecipeModalComponent } from '../recipe-modal/recipe-modal.component';

type SortField = 'id' | 'name' | 'price' | 'stock';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, RecipeModalComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  searchTerm = '';
  searchSubject = new Subject<string>();
  sortField: SortField = 'id';
  sortDirection: SortDirection = 'asc';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  selectedProductId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private toastService: ToastService
  ) {
    this.setupSearchDebounce();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    console.log('Cargando productos...');
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        console.log('Productos recibidos:', data);
        this.products = data || [];
        this.applyFilters();
        this.loading = false;
        if (this.products.length === 0) {
          console.warn('No se recibieron productos');
        }
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = err.message || 'No se pudieron cargar los productos. Verifique la conexión con el servidor.';
        this.toastService.error(err.message || 'Error al cargar productos');
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  applyFilters(): void {
    let result = [...this.products];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) ||
        (product.description?.toLowerCase().includes(term))
      );
    }

    result.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        default:
          aValue = a.id || 0;
          bValue = b.id || 0;
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredProducts = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  sort(field: SortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(field: SortField): string {
    if (this.sortField !== field) return 'bi-arrow-down-up';
    return this.sortDirection === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  deleteProduct(id: number): void {
    const product = this.products.find(p => p.id === id);
    const productName = product?.name || 'este producto';
    
    if (confirm(`¿Está seguro de que desea eliminar "${productName}"?\n\nEsta acción no se puede deshacer.`)) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.successMessage = `Producto "${productName}" eliminado correctamente`;
          this.toastService.success(`Producto "${productName}" eliminado correctamente`);
          this.loadProducts();
          setTimeout(() => this.successMessage = null, 5000);
        },
        error: (err) => {
          this.error = 'Error al eliminar el producto. Por favor, intente nuevamente.';
          this.toastService.error('Error al eliminar producto');
          console.error('Error deleting product:', err);
        }
      });
    }
  }

  getTotalValue(): number {
    return this.products.reduce((total, product) => 
      total + (product.price * product.stock), 0
    );
  }

  getLowStockCount(): number {
    return this.products.filter(p => p.stock < 10 && p.stock > 0).length;
  }

  getOutOfStockCount(): number {
    return this.products.filter(p => p.stock === 0).length;
  }

  getStockStatusClass(stock: number): string {
    if (stock === 0) return 'text-danger';
    if (stock < 10) return 'text-warning';
    return 'text-success';
  }

  getStockBadgeClass(stock: number): string {
    if (stock === 0) return 'badge bg-danger';
    if (stock < 10) return 'badge bg-warning text-dark';
    return 'badge bg-success';
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  openRecipeModal(productId: number): void {
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
