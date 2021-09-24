import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";

import { Post } from "./post.model";
import { PostsService } from './shared/posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  public loadedPosts = [];

  public isLoading = false;
  public error = null;
  public errorType = null;

  constructor(
    private http: HttpClient,
    private postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isLoading = false;
      this.loadedPosts = posts;
    }, error => {
      this.error = error.error.error;
      this.errorType = error.message;
    });
  }

  onCreatePost(postData: Post) {
    // Send Http request
    console.log(postData);
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.isLoading = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isLoading = false;
      this.loadedPosts = posts;
    }, error => {
      this.error = error.error.error;
      this.errorType = error.message;
    });
  }

  onClearPosts() {
    // Send Http request
    this.postsService.clearPosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }
}
