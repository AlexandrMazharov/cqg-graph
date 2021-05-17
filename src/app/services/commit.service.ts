import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Commit} from '../models/commit.model';
import {map} from 'rxjs/operators';
import {Tag} from '../models/tag.model';

const commitsURL = 'http://localhost:3000/commits';
const tagsURL = 'http://localhost:3000/tags';

@Injectable({
  providedIn: 'root'
})


export class CommitService {

  constructor(private httpClient: HttpClient) {
  }

  sendCommit(commit: Commit): Observable<any> {
    return this.httpClient.post(commitsURL, commit);
  }

  sendTag(tag: Tag): Observable<any> {
    return this.httpClient.post(tagsURL, tag);
  }

  getCommits(): Observable<Commit[]> {
    return this.httpClient.get<Commit[]>(commitsURL)
      .pipe(map(res => {
        const commits = [];
        res.forEach(i => commits.push(new Commit().deserialize(i)));
        return commits;
      }));

  }

  getTags(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(tagsURL)
      .pipe(map(
        res => {
          const tags = [];
          res.forEach(i => tags.push(new Tag().deserialize(i)));
          return tags;
        }));

  }
}
