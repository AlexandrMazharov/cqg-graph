import {Component, OnInit} from '@angular/core';

import {CommitService} from './services/commit.service';
import {Commit} from './models/commit.model';
import {Tag} from './models/tag.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'cqg-graph';

  public tags = null;
  public commits = null;
  public newCommit: Commit;
  public newTag: Tag;
  public allId = [];


  constructor(private commitService: CommitService) {


  }

  ngOnInit(): void {

    this.getCommits();
    this.getTags();
  }

  getCommits(): void {
    this.commitService.getCommits().subscribe(res => {
        this.commits = res;
        this.allId = [];
        res.forEach(item => this.allId.push(item.id));
      },
      error => {
        console.log(error);
        alert('The server doesn\'t seem to be working. Please start the server:' +
          'npm i json-server' +
          'json-server info.json'
        );
        this.ngOnInit();
      });
    this.newCommit = new Commit();

  }

  getTags(): void {
    this.commitService.getTags().subscribe(res => {
      console.log(res);
      this.tags = res;
    });
    this.newTag = new Tag();

  }

  addCommit(): void {
    console.log(this.newCommit);
    if (!this.newCommit.parent && this.commits.length) {
      alert('Choose current commit');
    } else {
      this.newCommit.time = new Date().toISOString();
      this.newCommit.id = this.commits.length + 1;
      this.commitService.sendCommit(this.newCommit).subscribe((r) => {
        console.log(r);
        this.getCommits();
      }, (error) => {
        alert('Something went wrong. This commit was not sent.');
        console.log(error);
      });
    }

  }

  merge(): void {
    console.log(this.newCommit);
    if (!this.newCommit.parent) {
      alert('Choose current commit');
    } else if (!this.newCommit.parent2) {
      alert('Choose merge commit');
    } else {
      this.newCommit.time = new Date().toISOString();
      this.newCommit.id = this.commits.length + 1;
      this.commitService.sendCommit(this.newCommit).subscribe(() => {
          this.getCommits();
        },
        error => {
          alert('Something went wrong. MR didn\'t work');
          console.log(error);
        });
    }
  }

  addTag(): void {
    if (!this.newTag.commit) {
      alert('Choose commit');
      return;
    }
    this.commitService.sendTag(this.newTag).subscribe(() => {
        this.getTags();
      },
      error => {
        alert('Something went wrong. This tag was not sent.');
        console.log(error);
      });


  }
}
