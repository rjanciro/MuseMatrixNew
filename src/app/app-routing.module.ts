import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogPageComponent } from './components/blog-page/blog-page.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { ReadMoreComponent } from './components/read-more/read-more.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MyBlogsComponent } from './components/my-blogs/my-blogs.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/landing-page', pathMatch: 'full' },
  { path: 'blogpage', component: BlogPageComponent, title: 'MuseMatrix | Blog' },
  { path: 'myblogs', component: MyBlogsComponent, title: 'MuseMatrix | My Blogs' },
  { path: 'createpost', component: CreatePostComponent, title: 'MuseMatrix | Create Post' },
  { path: 'readmore/:id', component: ReadMoreComponent, title: 'MuseMatrix | Read More' },
  { path: 'landing-page', component: LandingPageComponent, title: 'Welcome to MuseMatrix' },
  { path: 'login', component: LoginComponent, title: 'MuseMatrix | Login' },
  { path: 'register', component: RegisterComponent, title: 'MuseMatrix | Register' },
  { path: 'profile', component: ProfileComponent, title: 'MuseMatrix | Profile' },
];

export { routes };

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }