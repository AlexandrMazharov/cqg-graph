import {Component, OnInit} from '@angular/core';
import {ChangesGraph} from './graph';
import {CommitService} from './commit.service';
import {Commit} from './commit.model';
import {log} from 'util';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'cqg-graph';
  private changesGraph: ChangesGraph;
  public commits = null;
  public newCommit: Commit;
public  allId = [];
  mergeFrom: any;
  mergeTo: any;
  constructor(private commitService: CommitService) {


  }

  ngOnInit(): void {


    this.commitService.getCommits().subscribe(res => {
      this.commits = res;
      // console.log(res);

      res.forEach(item => this.allId.push(item.id));
      this.changesGraph = new ChangesGraph(
        res,
        document.getElementById('changes-graph')
      );
    });
    this.newCommit = new Commit();
  }

  add(): void {

    this.newCommit.time = new Date().toISOString();
    this.newCommit.id = this.commits.length + 1;
    this.commitService.sendCommit(this.newCommit).subscribe(r => {
      this.ngOnInit();
    });
    console.log(this.newCommit);
  }

  merge() {
    this.newCommit.time = new Date().toISOString();
    this.newCommit.id = this.commits.length + 1;
    this.commitService.sendCommit(this.newCommit).subscribe(r => {
      this.ngOnInit();
    });
    console.log(this.newCommit);
  }
}
