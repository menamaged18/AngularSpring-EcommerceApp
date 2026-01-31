import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStore } from '../../store/UserStore';

@Component({
  selector: 'app-sign-up',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  readonly store = inject(UserStore);
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);

  constructor() {
    // after Creating the account direct to home page
    effect(() => {
      if (this.store.isAuthenticated()) {
        console.log('Registration successful, redirecting...');
        this.router.navigate(['/']); 
      }
    });
  }

  userForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    userType: ['Normal', Validators.required], 
    phone: ['', Validators.required],
    is_active: [true]
  });

  addUser() {
    if (this.userForm.valid) {
      const userData = this.userForm.getRawValue();
      this.store.registerUser(userData);
    }
  }
}