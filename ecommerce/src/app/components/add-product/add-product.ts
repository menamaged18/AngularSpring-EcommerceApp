import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { productStore } from '../../store/ProductStore';
import { ProductService } from '../../services/product/product-service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  readonly store = inject(productStore);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  
  showSuccessMessage = signal(false);
  selectedImage = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  isUploading = signal(false);
  uploadProgress = signal(0);
  imageSizeError = signal<string | null>(null);
  imageTypeError = signal<string | null>(null);

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

  async onSubmit() {
    if (this.productForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    try {
      this.isUploading.set(true);
      this.uploadProgress.set(10);

      // Step 1: Create the product
      const productData = this.productForm.value as any;
      const newProduct = await lastValueFrom(this.productService.addProduct(productData));
      this.uploadProgress.set(50);

      // Step 2: Upload image if selected
      if (this.selectedImage()) {
        try {
          const imageUrl = await lastValueFrom(
            this.productService.uploadProductImage(newProduct.id, this.selectedImage()!)
          );
          // Update product with image URL in store
          const updatedProduct = { ...newProduct, imageUrl };
          
          // Update store with the new product (which now has image)
          this.store.addProduct(updatedProduct);
          
          this.uploadProgress.set(100);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          // Product was created successfully, but image upload failed
          // Still add product to store without image
          this.store.addProduct(newProduct);
        }
      } else {
        // Add product without image
        this.store.addProduct(newProduct);
        this.uploadProgress.set(100);
      }

      this.showSuccessMessage.set(true);
      
      this.resetForm();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        this.showSuccessMessage.set(false);
        this.isUploading.set(false);
        this.uploadProgress.set(0);
      }, 3000);

    } catch (error) {
      console.error('Error adding product:', error);
      this.isUploading.set(false);
      this.uploadProgress.set(0);
      // TODO: show an error message to the user
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Reset errors
    this.imageSizeError.set(null);
    this.imageTypeError.set(null);

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.imageTypeError.set('Only JPEG, PNG, and WEBP images are allowed');
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.imageSizeError.set('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview.set(e.target.result);
    };
    reader.readAsDataURL(file);

    this.selectedImage.set(file);
  }

  removeImage(): void {
    this.selectedImage.set(null);
    this.imagePreview.set(null);
    this.imageSizeError.set(null);
    this.imageTypeError.set(null);
  }

  resetForm(): void {
    this.productForm.reset({
      quantity: 0,
      price: 0,
      weight: 0,
      is_active: true
    });
    this.removeImage();
    
    // Reset file input
    const fileInput = document.getElementById('productImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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