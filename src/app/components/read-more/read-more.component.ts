import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface Post {
  id: number;
  name: string;
  content: string;
  postedBy: string;
  tags: string[];
  img: string;
  date: string;
  visibility: 'public' | 'private';
  views: number; 
}

@Component({
  selector: 'app-my-blogs',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss']
})
export class ReadMoreComponent implements OnInit {
  myPosts: Post[] = [];
  username: string | null = localStorage.getItem('currentUser');
  profilePictureUrl: string | null = localStorage.getItem('profilePictureUrl') || '';
  showEditModal: boolean = false;
  editPostForm!: FormGroup;
  tags: string[] = [];
  currentPostId: number | null = null;

  isImageModalOpen = false;
  selectedImage: string | null = null;

  constructor(private dataService: DataService, private router: Router, private fb: FormBuilder, public sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.editPostForm = this.fb.group({
      name: [null, Validators.required],
      content: [null, Validators.required],
      tags: [null],
      img: [null],
      visibility: ['public', Validators.required]
    });

    console.log('Username:', this.username);
    console.log('Profile Picture URL:', this.profilePictureUrl);

    if (!this.profilePictureUrl && this.username) {
      this.dataService.getUserDetails(this.username).subscribe((userDetails) => {
        if (userDetails && userDetails.length > 0) {
          const user = userDetails[0];
          this.profilePictureUrl = user.profile_picture ? this.getFullProfilePictureUrl(user.profile_picture) : '';
          localStorage.setItem('profilePictureUrl', this.profilePictureUrl);
        }
        this.fetchMyPosts();
      });
    } else {
      this.fetchMyPosts();
    }
  }

  getFullProfilePictureUrl(relativePath: string): string {
    // Check if relativePath already includes "Uploads/Photos/"
    if (relativePath.startsWith('Uploads/Photos/')) {
      return `http://localhost/mmAPI/${relativePath}`;
    }
    return `http://localhost/mmAPI/Uploads/Photos/${relativePath}`;
  }

  fetchMyPosts(): void {
    if (this.username) {
      this.dataService.getPostsByUser(this.username).subscribe(
        (res: any) => {
          console.log('API Response:', res);
          if (res && res.status && res.status.remarks === 'success' && Array.isArray(res.payload)) {
            this.myPosts = res.payload.map((post: Post) => {
              if (typeof post.tags === 'string') {
                post.tags = JSON.parse(post.tags);
              }
              return post;
            });
          } else {
            console.error('Invalid response structure:', res);
          }
        },
        (err) => {
          console.error('API Error:', err);
        }
      );
    }
  }

  openEditModal(post: Post): void {
    this.currentPostId = post.id;
    this.tags = post.tags;
    this.editPostForm.patchValue({
      name: post.name,
      content: post.content,
      tags: post.tags,
      img: post.img,
      visibility: post.visibility
    });
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.editPostForm.get('tags')?.setValue(this.tags);
    }
  }

  addTag(event: any): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if ((value || '').trim()) {
      this.tags.push(value.trim());
      this.editPostForm.get('tags')?.setValue(this.tags);
    }

    input.value = '';
  }

  updatePost(): void {
    if (this.editPostForm.valid && this.currentPostId !== null) {
      const postData = this.editPostForm.getRawValue();
      this.dataService.updatePost(this.currentPostId, postData).subscribe(
        (response) => {
          Swal.fire('Post updated successfully!', '', 'success');
          this.fetchMyPosts();
          this.closeEditModal();
        },
        (error) => {
          console.error('Error updating post:', error);
          Swal.fire('Failed to update post!', '', 'error');
        }
      );
    }
  }

  deletePost(postId: number): void {
    console.log('Deleting post with ID:', postId);
    Swal.fire({
      title: 'Are you sure you want to delete this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.deletePost(postId).subscribe(
          (res: any) => {
            console.log('Delete response:', res); 
            if (res && res.status && res.status.remarks === 'success') {
              this.myPosts = this.myPosts.filter(post => post.id !== postId);
              Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
            } else {
              console.error('Unexpected response structure:', res);
              Swal.fire('Error!', 'Failed to delete post!', 'error');
            }
          },
          (err) => {
            console.error('Error deleting post:', err);
            Swal.fire('Error!', 'Something went wrong!', 'error');
          }
        );
      }
    });
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