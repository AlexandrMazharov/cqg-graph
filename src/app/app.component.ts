import {Component, OnInit} from '@angular/core';

import {CommitService} from './services/commit.service';
import {Commit} from './models/commit.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'cqg-graph';

  public commits = null;
  public newCommit: Commit;
  public allId = [];

  constructor(private commitService: CommitService) {


  }

  ngOnInit(): void {

    this.getCommits();

  }

  getCommits(): void {
    this.commitService.getCommits().subscribe(res => {
      this.commits = res;

      res.forEach(item => this.allId.push(item.id));
    });
    this.newCommit = new Commit();

  }

  add(): void {

    this.newCommit.time = new Date().toISOString();
    this.newCommit.id = this.commits.length + 1;
    this.commitService.sendCommit(this.newCommit).subscribe(r => {
      this.getCommits();
    });
  }

  merge(): void {
    this.newCommit.time = new Date().toISOString();
    this.newCommit.id = this.commits.length + 1;
    this.commitService.sendCommit(this.newCommit).subscribe(r => {
      this.getCommits();
    });
  }
}
