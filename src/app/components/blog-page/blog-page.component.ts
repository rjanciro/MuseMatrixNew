import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-all',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.scss']
})
export class BlogPageComponent implements OnInit {
  allPosts: any[] = [];

  isImageModalOpen = false;
  selectedImage: string | null = null;

  constructor(private dataService: DataService, private matSnackBar: MatSnackBar, public sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.fetchAllPosts();
  }

  fetchAllPosts() {
    this.dataService.getAllPosts().subscribe(
      (res: any) => {
        console.log('API Response:', res); 
        try {
          const parsedRes = JSON.parse(res); 
          if (parsedRes && parsedRes.status && parsedRes.status.remarks === 'success' && Array.isArray(parsedRes.payload)) {
            this.allPosts = parsedRes.payload
              .filter((post: any) => post.visibility === 'public') 
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()); 
            this.allPosts.forEach((post: any) => {
              post.tags = JSON.parse(post.tags);
              post.content = post.content;
            });
            console.log('All Posts:', this.allPosts);
          } else {
            console.error('Invalid response structure:', parsedRes);
            this.matSnackBar.open("Failed to load posts!", "Close");
          }
        } catch (e) {
          console.error('Error parsing response:', e);
          this.matSnackBar.open("Failed to load posts!", "Close");
        }
      },
      (err) => {
        console.error('API Error:', err);
        this.matSnackBar.open("Something went wrong!", "Close");
      }
    );
  }

  openImageModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.isImageModalOpen = true;
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
    this.selectedImage = null;
  }
}