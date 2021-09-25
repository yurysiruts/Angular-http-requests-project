import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "../post.model";
import { map, catchError, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({providedIn: "root"})
export class PostsService {

  public errorSubj = new Subject<string>();

  constructor(private http: HttpClient) {}
  
  createAndStorePost(title: string, content: string) {
    const postData: Post = {title: title, content: content}
    this.http.
      post<{ name: string }>(
        'https://http-practice-angular-ea87f-default-rtdb.europe-west1.firebasedatabase.app/posts.json', 
        postData,
        // extra third argument to configure the response 
        {
          observe: 'response'
          // response || body || events
        }
        )
      .subscribe(
        responseData => console.log(responseData),
        error => this.errorSubj.next(error.message)
      );
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        'https://http-practice-angular-ea87f-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        {
          headers: new HttpHeaders({"Custom-Header": "Hello"}),
          params: new HttpParams().set('print', 'pretty'),
          responseType: 'json'
        }
      )
      .pipe(
        map(fetchedData => {
          const postsArray: Post[] = [];
          for(let key in fetchedData) {
            if(fetchedData.hasOwnProperty(key)) {
              postsArray.push({ ...fetchedData[key], id: key});
            }
          };
          return postsArray;
        }),
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  clearPosts() {
    return this.http
      .delete(
        'https://http-practice-angular-ea87f-default-rtdb.europe-west1.firebasedatabase.app/posts.json', {
        observe: 'events'
      })
      // not necessary, tap - for not exequting but for editting the response  
      .pipe(
        tap(event => {
          console.log(event);
          if(event.type === HttpEventType.Sent) {
            // ...
          }
          if(event.type === HttpEventType.Response) {
            console.log(event.body)
          }
        })
      )
  }
}