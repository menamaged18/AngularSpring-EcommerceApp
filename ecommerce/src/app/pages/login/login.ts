import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserStore } from '../../store/UserStore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  readonly store = inject(UserStore);
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);

  constructor() {
    // after login the account direct to home page
    effect(() => {
      if (this.store.isAuthenticated()) {
        console.log('Registration successful, redirecting...');
        this.router.navigate(['/']); 
      }
    });
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.getRawValue();
      this.store.login(credentials);
      // console.log("loggin sucess");
    }
  }
}
