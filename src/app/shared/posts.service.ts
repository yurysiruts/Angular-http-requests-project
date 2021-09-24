import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "../post.model";
import { map } from "rxjs/operators";

@Injectable({providedIn: "root"})
export class PostsService {

  constructor(private http: HttpClient) {}
  
  createAndStorePost(title: string, content: string) {
    const postData: Post = {title: title, content: content}
    this.http.
    post<{ name: string }>(
      'https://http-practice-angular-ea87f-default-rtdb.europe-west1.firebasedatabase.app/posts.json', 
      postData)
    .subscribe(
      responseData => {
        console.log(responseData)
      }
    );
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>('https://http-practice-angular-ea87f-default-rtdb.europe-west1.firebasedatabase.app/posts.json')
      .pipe(
        map(fetchedData => {
          const postsArray: Post[] = [];
          for(let key in fetchedData) {
            if(fetchedData.hasOwnProperty(key)) {
              postsArray.push({ ...fetchedData[key], id: key});
            }
          };
          return postsArray;
        })
      );
  }
}