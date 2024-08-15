import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar, private dataService: DataService) {
    this.loginForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.snackBar.open("Please fill in all fields!", "Close", {
        duration: 5000
      });
      return;
    }

    this.dataService.login(this.loginForm.value).subscribe((res) => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('currentUser', this.loginForm.value.username);

      // Fetch user details after successful login
      this.dataService.getUserDetails(this.loginForm.value.username).subscribe((userDetails) => {
        if (userDetails && userDetails.length > 0) {
          const user = userDetails[0];
          const profilePictureUrl = user.profile_picture ? this.getFullProfilePictureUrl(user.profile_picture) : '';
          localStorage.setItem('profilePictureUrl', profilePictureUrl); 
          window.dispatchEvent(new Event('storage'));
        }

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Login Successfully',
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          customClass: {
            popup: 'colored-toast'
          }
        }).then(() => {
          this.router.navigateByUrl("/myblogs").then(() => {
            window.location.reload();
          });
        });
      }, (err) => {
        this.snackBar.open("Failed to fetch user details!", "Close", {
          duration: 5000
        });
      });
    }, (err) => {
      this.snackBar.open("Invalid credentials!", "Close", {
        duration: 5000
      });
    });
  }

  getFullProfilePictureUrl(relativePath: string): string {
    // Check if relativePath already includes "Uploads/Photos/"
    if (relativePath.startsWith('Uploads/Photos/')) {
      return `http://localhost/mmAPI/${relativePath}`;
    }
    return `http://localhost/mmAPI/Uploads/Photos/${relativePath}`;
  }
}