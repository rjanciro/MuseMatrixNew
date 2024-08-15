import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public apiUrl = 'http://localhost/mmAPI/api';

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`);
  }

  getPostById(postId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/posts/${postId}`);
  }

  getPostsByUser(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_posts_by_user/${username}`).pipe(
      map((response: any) => {
        // Parse the response if necessary
        return typeof response === 'string' ? JSON.parse(response) : response;
      })
    );
  }

  incrementViews(postId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/increment_views/${postId}`, {});
  }

  searchByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/${name}`, { responseType: 'text' }).pipe(
      map((response: any) => {
        // Parse the response if necessary
        return typeof response === 'string' ? JSON.parse(response) : response;
      })
    );
  }

  // Comment related methods
  createComment(postId: number, postedBy: string, content: string): Observable<any> {
    const body = {
      postId: postId,
      postedBy: postedBy,
      content: content
    };

    return this.http.post<any>(`${this.apiUrl}/add_comment`, body);
  }

  getAllCommentsByPostId(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/comments/${postId}`).pipe(
      map((response: any) => {
        // Parse the response if necessary
        return typeof response === 'string' ? JSON.parse(response) : response;
      })
    );
  }

  // Authentication methods
  register(data: any): Observable<any> {
    console.log('Registration` data:', data);
    return this.http.post(`${this.apiUrl}/register`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap(response => console.log('Registration successful:', response)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error during registration:', error.message, error.error);
        return throwError(error);
      })
    );
  }

  login(data: any): Observable<any> {
    console.log('Login data:', data);
    return this.http.post(`${this.apiUrl}/login`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap(response => console.log('Login successful:', response)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error during login:', error.message, error.error);
        return throwError(error);
      })
    );
  }

  createPost(postData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_post`, postData);
  }

  updatePost(postId: number, postData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_post/${postId}`, postData);
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_post/${postId}`).pipe(
      map((response: any) => {
        // Parse the response if necessary
        return typeof response === 'string' ? JSON.parse(response) : response;
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error creating post:', error);
    return throwError(() => new Error('Error creating post'));
  }

  getUserDetails(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_user_details&username=${username}`).pipe(
      map((response: any) => {
        // Parse the response if necessary
        return typeof response === 'string' ? JSON.parse(response) : response;
      })
    );
  }

  uploadProfilePicture(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload_profile_picture`, formData).pipe(
      map((response: any) => {
        // Parse the response if necessary
        return typeof response === 'string' ? JSON.parse(response) : response;
      })
    );
  }

  updateUserDetails(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_user_details`, data).pipe(
      map((response: any) => {
        // Parse the response if necessary
        return typeof response === 'string' ? JSON.parse(response) : response;
      })
    );
  }

  changePassword(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/change_password`, data).pipe(
      map((response: any) => {
        return typeof response === 'string' ? JSON.parse(response) : response;
      })
    );
  }
}