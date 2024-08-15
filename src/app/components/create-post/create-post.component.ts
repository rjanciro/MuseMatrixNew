import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  postForm!: FormGroup;
  tags: string[] = [];
  username: string | null = localStorage.getItem('currentUser'); 

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      name: [null, Validators.required],
      content: [null, Validators.required], 
      postedBy: [{ value: this.username, disabled: true }, Validators.required], 
      tags: [null],
      img: [null],
      visibility: ['public', Validators.required] 
    });
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.postForm.get('tags')?.setValue(this.tags); 
    }
  }

  add(event: any): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Add the tag
    if ((value || '').trim()) {
      this.tags.push(value.trim());
      this.postForm.get('tags')?.setValue(this.tags);
    }

    // Reset the input value
    input.value = '';
  }

  createPost(): void {
    if (this.postForm.valid) {
      let postData = this.postForm.getRawValue();

      // Replace newlines with <br> tags and wrap paragraphs with <p> tags
      postData.content = postData.content
        .split('\n\n')
        .map((paragraph: string) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
        .join('');

      console.log('Post Data:', postData);

      this.dataService.createPost(postData).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Post created successfully!',
            showConfirmButton: true,
            timer: 2000
          });
          this.router.navigate(['/view-all']);
        },
        (error) => {
          console.error('Error creating post:', error); 
          this.matSnackBar.open('Failed to create post!', 'Close', { duration: 3000 });
        }
      );
    }
  }
}