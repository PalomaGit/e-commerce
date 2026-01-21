import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { IngredientService } from '../../services/ingredient.service';
import { ToastService } from '../../services/toast.service';
import { Product, ProductRecipe, Ingredient } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  showValidationAlert = false;
  
  ingredients: Ingredient[] = [];
  recipes: ProductRecipe[] = [];
  selectedIngredientId: number | null = null;
  recipeQuantity: number = 1;
  loadingIngredients = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private ingredientService: IngredientService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadIngredients();
    setTimeout(() => {
      const firstInput = document.querySelector('input[formControlName="name"]') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    }, 100);
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]]
    });
  }

  loadIngredients(): void {
    this.loadingIngredients = true;
    this.ingredientService.getAllIngredients().subscribe({
      next: (ingredients) => {
        this.ingredients = ingredients;
        this.loadingIngredients = false;
      },
      error: () => {
        this.loadingIngredients = false;
      }
    });
  }

  addRecipe(): void {
    if (!this.selectedIngredientId || this.recipeQuantity <= 0) {
      this.toastService.warning('Seleccione un ingrediente y una cantidad válida');
      return;
    }

    const ingredient = this.ingredients.find(i => i.id === this.selectedIngredientId);
    if (!ingredient) {
      this.toastService.error('Ingrediente no encontrado');
      return;
    }

    const existingRecipe = this.recipes.find(r => r.ingredient.id === ingredient.id);
    if (existingRecipe) {
      this.toastService.warning('Este ingrediente ya está en la receta');
      return;
    }

    const recipe: ProductRecipe = {
      ingredient: ingredient,
      quantity: this.recipeQuantity
    };

    this.recipes.push(recipe);
    this.selectedIngredientId = null;
    this.recipeQuantity = 1;
    this.toastService.success('Ingrediente agregado a la receta');
  }

  removeRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.toastService.info('Ingrediente eliminado de la receta');
  }

  getRecipeTotalCost(): number {
    return this.recipes.reduce((total, recipe) => {
      return total + (recipe.ingredient.costPrice * recipe.quantity);
    }, 0);
  }

  getEstimatedMargin(): number {
    const price = parseFloat(this.productForm.value.price) || 0;
    return price - this.getRecipeTotalCost();
  }

  onSubmit(): void {
    this.showValidationAlert = false;
    this.error = null;
    this.successMessage = null;

    if (this.productForm.valid) {
      this.loading = true;

      const productData: Product = {
        name: this.productForm.value.name.trim(),
        description: this.productForm.value.description?.trim() || '',
        price: parseFloat(this.productForm.value.price),
        stock: parseInt(this.productForm.value.stock, 10),
        recipes: this.recipes.length > 0 ? this.recipes : undefined
      };

      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.successMessage = 'Producto creado exitosamente';
          this.toastService.success('Producto creado exitosamente');
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1500);
        },
        error: (err) => {
          this.error = this.getErrorMessage(err);
          this.toastService.error(this.getErrorMessage(err));
          this.loading = false;
        }
      });
    } else {
      this.showValidationAlert = true;
      this.markFormGroupTouched();
      this.scrollToFirstError();
    }
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifique su conexión.';
    }
    return 'Error al crear el producto. Por favor, intente nuevamente.';
  }

  private scrollToFirstError(): void {
    const firstInvalidField = document.querySelector('.is-invalid');
    if (firstInvalidField) {
      firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (firstInvalidField as HTMLElement).focus();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.valid && field.dirty && !field.pending);
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'Este campo es obligatorio';
    }
    if (field.errors['min']) {
      return fieldName === 'price' ? 'El precio debe ser mayor a 0' : 'El valor no puede ser negativo';
    }
    if (field.errors['maxLength']) {
      return `Máximo ${field.errors['maxLength'].requiredLength} caracteres`;
    }
    if (field.errors['pattern']) {
      return 'Solo se permiten números enteros';
    }
    return '';
  }

  markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  getPreviewTotal(): number {
    const price = parseFloat(this.productForm.value.price) || 0;
    const stock = parseInt(this.productForm.value.stock, 10) || 0;
    return price * stock;
  }
}
