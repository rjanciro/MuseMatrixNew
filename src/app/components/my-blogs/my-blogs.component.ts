import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

interface Blog {
  title: string;
  content: string;
  img: string;
  postedBy: string;
  tags: string[];
  visibility: string;
  date: string;
}

@Component({
  selector: 'app-my-blogs',
  templateUrl: './my-blogs.component.html',
  styleUrls: ['./my-blogs.component.css']
})
export class MyBlogsComponent {
  blogs: Blog[] = [
    {
      title: 'My Blog 1',
      content: 'This is the content for my blog 1.',
      img: 'image1.jpg',
      postedBy: 'Your Name',
      tags: ['tag1', 'tag2'],
      visibility: 'public',
      date: 'August 2024'
    },
    {
      title: 'My Blog 2',
      content: 'This is the content for my blog 2.',
      img: 'image2.jpg',
      postedBy: 'Your Name',
      tags: ['tag3', 'tag4'],
      visibility: 'private',
      date: 'August 2024'
    }
  ];
}