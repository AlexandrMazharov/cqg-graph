import {Commit} from './commit.model';
import {takeLast} from 'rxjs/operators';


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
        const children = this.commits[parent2].children;
        this.commits[parent2].mergeFrom = item.id;

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
        const last = table[table.length - 1];
        for (let i = 0; i < last.length; i++) {
          const node = last[i];
          if (node.children === 0) {
            row.push({
              id: node.id,
              type: 'P',
              children: 0,
              parentColumn: i
            });
          } else if (node.children === 1) {
            row.push({
              id: node.id,
              type: 'L',
              children: 1,
              parentColumn: i
            });
          } else if (node.children > 1) {
            row.push({
              id: node.id,
              type: 'L',
              children: 1,
              parentColumn: i
            });

            row.push({
              id: node.id,
              type: 'L',
              children: node.children - 1,
              parentColumn: i
            });
          }
        }
      }
      let found = false;

      for (let i = 0; i < row.length; i++) { // по строке
        const node = row[i];
        if (node.id === item.parent) {
          node.id = item.id;
          node.type = 'O';
          node.children = Number(item.children);

          found = true;
          break;
        }
      }

      // рисуем родителя всех
      if (!found) {
        row.push({
          id: item.id,
          type: 'O',
          children: Number(item.children),
          parentColumn: null
        });
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

        if (table[i][j].parentColumn != null && table[i][j].type !== 'P') {

          const x1 = table[i][j].parentColumn * this.cellWidth + this.cellWidth / 2;
          const y1 = cell.y - this.cellHeight;
          const x2 = cell.x;
          const y2 = cell.y;

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


