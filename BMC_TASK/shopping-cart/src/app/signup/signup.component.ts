import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // Import Router

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signUpForm: FormGroup;
  emailExists: boolean = false;
  signUpSuccess: boolean = false; 
  passwordVisible = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^(?=.*[A-Z]).+$')
        ]
      ],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  togglePasswordVisibility(event: any) {
    this.passwordVisible = event.target.checked;
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const email = this.signUpForm.get('email')?.value;
      const username = this.signUpForm.get('username')?.value;
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

      const userExists = existingUsers.some((user: any) => user.email === email);

      if (userExists) {
        this.emailExists = true;
      } else {
        const newUser = {
          username,
          email,
          password: this.signUpForm.get('password')?.value
        };
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        this.emailExists = false;

        this.signUpSuccess = true; 

    
        setTimeout(() => {
          this.signUpSuccess = false;
        }, 1500);

        this.signUpForm.reset(); 
      }
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
