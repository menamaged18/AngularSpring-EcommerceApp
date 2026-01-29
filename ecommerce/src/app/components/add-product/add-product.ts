import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { productStore } from '../../store/ProductStore';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  readonly store = inject(productStore);
  private fb = inject(FormBuilder);
  
  showSuccessMessage = signal(false);

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    quantity: [0, [Validators.required, Validators.min(1), Validators.max(9999)]],
    price: [0, [Validators.required, Validators.min(0.01), Validators.max(99999.99)]],
    category: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    brand: ['', [Validators.required, Validators.minLength(2)]],
    weight: [0, [Validators.min(0), Validators.max(1000)]],
    is_active: [true]
  });

  onSubmit() {
    if (this.productForm.valid) {
      this.store.addProduct(this.productForm.value as any);
      
      // Show success message
      this.showSuccessMessage.set(true);
      
      // Reset form but keep default values
      this.productForm.reset({
        quantity: 0,
        price: 0,
        weight: 0,
        is_active: true
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => this.showSuccessMessage.set(false), 3000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Helper method to get form control
  getControl(controlName: string) {
    return this.productForm.get(controlName);
  }

  // Helper to check if field is invalid
  isFieldInvalid(controlName: string): boolean {
    const control = this.getControl(controlName);
    return control ? control.invalid && control.touched : false;
  }
}