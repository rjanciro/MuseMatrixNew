import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar, private dataService: DataService) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      username: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.snackBar.open("Passwords do not match!", "Close", {
        duration: 3000 
      });
      return;
    }

    const registerData = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };

    this.dataService.register(registerData).subscribe((res) => {
      localStorage.setItem(`${this.registerForm.value.username}_firstName`, this.registerForm.value.firstName);
      localStorage.setItem(`${this.registerForm.value.username}_lastName`, this.registerForm.value.lastName);
      localStorage.setItem('currentUser', this.registerForm.value.username);
      Swal.fire({
        title: 'Registration successful!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigateByUrl("/login");
      });
    }, (err) => {
      if (err.error && err.error.message === "Username already taken.") {
        this.snackBar.open("Username already taken!", "Close", {
          duration: 3000 
        });
      } else {
        this.snackBar.open("Username already taken!", "Close", {
          duration: 3000 
        });
      }
    });
  }
}