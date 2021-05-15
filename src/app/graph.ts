import {Commit} from './commit.model';
import {GraphItem} from './graph-item.model';

export class ChangesGraph {
  private cellHeight: any;
  private cellWidth: any;
  private element: HTMLElement;
  private commits: Commit[];

  constructor(commits, element: HTMLElement) {
    this.commits = commits;
    this.element = element;

    this.cellWidth = 32; // width ? width : 32;
    this.cellHeight = 32; // height ? height : 32;

    this.element.style.position = 'relative';
    this.element.style.padding = '0px';
    console.log(commits);
    this.calcChildrenCount();

    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    this.element.insertBefore(wrapper, this.element.firstChild);

    const svg = this.buildSVG(this.getViewTable());
    wrapper.appendChild(svg);

  }


  calcChildrenCount(): void {
    const items = this.commits;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      item.children = '0';

      const parent = item.parent;
      const parent2 = item.parent2;
      if (parent) {
        const children = this.commits[Number(parent) - 1].children;
        this.commits[Number(parent) - 1].children = String(Number(children) + 1);

      }
      // это добавил
      if (parent2) {
        const children = this.commits[Number(parent2) - 1].children;
        this.commits[Number(parent2) - 1].children = String(Number(children) + 1);
      }

    }
  }


  getViewTable(): object {
    const items = this.commits;

    const table = [];
    // index  - номер строки

    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const row = [];
      if (table.length) {
        const lastRow = table[table.length - 1];
        for (let i = 0; i < lastRow.length; i++) {
          const node = lastRow[i];

          if (node.children === 0) {
            // console.log(node);
            if (node.type === 'O') {
              row.push(new GraphItem(node.id, 'P', 0, i, i, null));
            }
          } else if (node.children === 1) {

            row.push(new GraphItem(node.id, 'L', 1, i, i, null));

          } else if (node.children > 1) {
            row.push(new GraphItem(node.id, 'L', 1, i, i, null));
            row.push(new GraphItem(node.id, 'L', node.children - 1, i, i, null));
          }
        }
      }

      let found = false;

      for (let i = 0; i < row.length; i++) { // по строке
        const node = row[i];
        if (node.id === item.parent) {


          //////////// это магия работает как то. хз
//           if (this.commits[index].parent2) {
//
//               console.log(row[i - 1]);
//               row[i - 1].finishColumn++;
//               if (row[i - 1].children > 0) {
//                 row[i - 1].children--;
//
//             }
//               ///////////////
//             // console.log(this.commits[index]);
// // 9 должен мержиться в 10
//
//           }

          node.id = item.id;
          node.type = 'O';
          node.children = Number(item.children);
          node.parent2 = Number(item.parent2);
          found = true;
          break;
        }

      }


      if (!found) {      // рисуем родителя всех
        // console.log(item);
        row.push(new GraphItem(item.id, 'O', Number(item.children), null, null, Number(item.parent2)));
      }
      for (let i = 0; i < row.length; i++) {

        if (row[i - 1]) {
          if (row[i - 1].parent2 && this.commits[row[i].id - 1].id) {
            // console.log(row[i - 1].parent2, this.commits[row[i].id - 1].id);
            if (row[i].finishColumn > 0) {
              row[i].finishColumn--;
            }
            if (row[i].children > 0) {
              row[i].children--;
            }
            // console.log(row[i]);
          }

          //
          //   if (row[i - 1].parent2 &&  this.commits[row[i].id - 1].id) {
          // if (row[i - 1].parent2, this.commits[row[i - 1].id - 1].parent2) {
          //   if (row[i - 1].parent2) {
          console.log(row[i], row[i - 1], this.commits[row[i].id ]);
          // console.log(row[i - 1],this.commits[row[i - 1].id - 1] );
          // row[i - 2].finishColumn++;
          // row[i - 2].children--;


          //   }
          // }
          // row[i].finishColumn--;
          // row[i].children--;
          // console.log(row[i]);
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

        if (table[i][j].startColumn != null && table[i][j].type !== 'P') {

          const x1 = table[i][j].startColumn * this.cellWidth + this.cellWidth / 2;
          const y1 = cell.y - this.cellHeight;
          let x2 = cell.x;
          const y2 = cell.y;
          if (table[i][j].startColumn !== table[i][j].finishColumn) {
            // console.log(table[i][j]);
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

          svg.appendChild(node);

        }
      }
    }

    svg.setAttribute('width', String(maxWidth * this.cellWidth));
    svg.setAttribute('height', String(table.length * this.cellHeight));

    return svg;
  }
}


