import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Commit} from './commit.model';
import {map} from 'rxjs/operators';

const commitURL = 'http://localhost:3000/commits';

@Injectable({
  providedIn: 'root'
})


export class CommitService {

  constructor(private httpClient: HttpClient) {
  }

  sendCommit(commit: Commit): Observable<any> {
    console.log(commit);
    return this.httpClient.post(commitURL, commit);
  }

  getCommits(): Observable<any> {
    return this.httpClient.get<Commit[]>(commitURL)
      .pipe(map(res => {
        console.log(res);
        const commits = [];
        res.forEach(i => commits.push(new Commit().deserialize(i)));
        return commits;
      }));

  }

}
