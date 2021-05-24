import {Component, Input} from '@angular/core';
import {Commit} from '../models/commit.model';
import {GraphItem} from '../models/graph-item.model';
import {Tag} from '../models/tag.model';

interface Position {
  screenX: number;
  screenY: number;
}

@Component({
  selector: 'app-svg-graph',
  templateUrl: './svg-graph.component.html',
  styleUrls: ['./svg-graph.component.css']
})
export class SvgGraphComponent {


  tags = new Map<string, string>();
  public commits: Commit[];

  @Input()
  set inputTags(tags: Tag[]) {
    tags.forEach(tag => this.tags.set(tag.commit, tag.tag));
  }

  @Input()
  set inputCommits(commits: Commit[]) {
    if (this.commits !== commits) {
      this.commits = commits;
      this.rerender();
    }

  }

  public mouseOwerItem: Commit;
  private readonly cellHeight: any;
  private readonly cellWidth: any;
  private element: HTMLElement;
  popupPosition: Position;

  constructor() {
    this.cellWidth = 32;
    this.cellHeight = 32;
    this.popupPosition = {screenX: 0, screenY: 0};
  }

  rerender(): void {
    this.element = document.getElementById('changes-graph');
    this.element.style.position = 'relative';
    this.element.style.padding = '0px';

    this.calcChildrenCount();
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    this.element.insertBefore(wrapper, this.element.firstChild);
    const svg = this.buildSVG(this.getViewTable());
    wrapper.appendChild(svg);

    const nodes = Array.from(document.querySelectorAll('svg .node'));
    nodes.forEach(node => node.addEventListener('mouseover', this.mouseoverNode.bind(this)));

  }


  calcChildrenCount(): void {
    const items = this.commits;
    items.forEach((commit: Commit) => {
      commit.children = '0';
      const parent = commit.parent;
      const parent2 = commit.parent2;

      if (parent) {
        const children = items[Number(parent) - 1].children;
        items[Number(parent) - 1].children = String(Number(children) + 1);

      }
      if (parent2) {
        const children = items[Number(parent2) - 1].children;
        items[Number(parent2) - 1].children = String(Number(children) + 1);
      }

    });
  }

  getViewTable(): object {
    const items = this.commits;
    const table = [];
    for (const item of items) {
      const row = [];
      if (table.length) {
        const lastRow = table[table.length - 1];
        for (let i = 0; i < lastRow.length; i++) {
          const node = lastRow[i];
          if (node.children === 0) {
            row.push(new GraphItem(node.id, 'NULL', 0, null, null, null));
          } else if (node.children === 1) {
            row.push(new GraphItem(node.id, 'L', 1, i, i, null));
          } else if (node.children > 1) {
            row.push(new GraphItem(node.id, 'L', 1, i, i, null));
            row.push(new GraphItem(node.id, 'L', node.children - 1, i, i, null));
          }
        }
      }

      let found = false;

      for (const node of row) {
        if (node.id === item.parent) {
          node.id = item.id;
          node.type = 'O';
          node.children = Number(item.children);
          node.parent2 = Number(item.parent2);
          found = true;
          break;
        }
      }

      if (!found) {
        row.push(new GraphItem(item.id, 'O', Number(item.children), null, null, Number(item.parent2)));
      }
      // correct line, if merge
      for (let i = 0; i < row.length; i++) {
        if (row[i - 1]) {
          const currentObject = row[i - 1];
          if (currentObject.type === 'O') {
            // merge from right to left
            for (let k = i - 1; k < row.length; k++) {
              if (currentObject.parent2 === row[k].id) {
                row[k].finishColumn = i - 1;
                if (row[k].children > 0) {
                  row[k].children = 0;
                }
              }
            }
          }
        }

        // merge from left to right
        if (row[i + 1]) {
          const currentObject = row[i + 1];
          if (currentObject.type === 'O') {
            for (let k = i + 1; k > 0; k--) {
              if (currentObject.parent2 === row[k - 1].id) {
                row[k - 1].finishColumn = i + 1;
                if (row[k - 1].children > 0) {
                  row[k - 1].children = 0;
                }
              }
            }
          }
        }
      }
      table.push(row);
    }
    console.log(table);
    return table;
  }

  makeSVGElement(tag, attrs): HTMLElement {

    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k of Object.keys(attrs)) {
      el.setAttribute(k, attrs[k]);
    }
    return el;
  }


  buildSVG(table): SVGElement {

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    let maxWidth = 0;

    for (let i = 0; i < table.length; i++) {

      if (table[i].length > maxWidth) {
        maxWidth = table[i].length;
      }

      for (let j = 0; j < table[i].length; j++) {

        const cell = {
          x: (j + 0.5) * this.cellWidth,
          y: (i + 0.5) * this.cellHeight
        };

        if (table[i][j].startColumn != null && table[i][j].type !== 'NULL') {

          const x1 = table[i][j].startColumn * this.cellWidth + this.cellWidth / 2;
          const y1 = cell.y - this.cellHeight;
          let x2 = cell.x;
          const y2 = cell.y;
          if (table[i][j].startColumn !== table[i][j].finishColumn) {
            x2 = table[i][j].finishColumn * this.cellWidth + this.cellWidth / 2;
          }

          const link = this.makeSVGElement('line', {
            x1, y1, x2, y2,
            stroke: '#000',
            'stroke-linecap': 'round'
          });

          link.setAttribute('class', 'link');

          svg.appendChild(link);
        }
      }
    }

    for (let i = 0; i < table.length; i++) {
      for (let j = 0; j < table[i].length; j++) {
        if (table[i][j].type === 'O') {

          const node = this.makeSVGElement('circle', {
            cx: (j + 0.5) * this.cellWidth,
            cy: (i + 0.5) * this.cellHeight,
            r: Math.min(this.cellWidth, this.cellHeight) / 4
          });

          node.setAttribute('class', 'node');
          node.setAttribute('id', table[i][j].id);


          svg.appendChild(node);
        }
      }
    }

    svg.setAttribute('width', String(maxWidth * this.cellWidth));
    svg.setAttribute('height', String(table.length * this.cellHeight));

    return svg;
  }

  mouseoverNode(e): void {
    this.popupPosition.screenX = e.screenX - 1500;
    this.popupPosition.screenY = e.screenY;
    this.mouseOwerItem = this.commits[e.target.id - 1];
  }

  dateParse = (date: string) => date.split(' ').join('');

}
