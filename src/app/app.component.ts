import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular';
  isLoggedIn = false;
  showSettingsDropdown = false;

  constructor() {
    // Check login status on initialization
    this.isLoggedIn = this.checkLoginStatus();
  }

  checkLoginStatus(): boolean {
    // Implement your actual login check logic here
    // For example, check if a token exists in local storage
    return !!localStorage.getItem('token');
  }

  toggleSettingsDropdown(event: Event) {
    event.preventDefault(); // Prevent the default link behavior
    this.showSettingsDropdown = !this.showSettingsDropdown;
  }

  logout(event: Event) {
    event.preventDefault(); // Prevent the default link behavior
    Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Implement your logout logic here
        localStorage.removeItem('token');
        this.isLoggedIn = false;
        this.showSettingsDropdown = false;
        Swal.fire('Logged out!', '', 'success').then(() => {
          window.location.href = '/landing-page';
        });
      }
    });
  }
}