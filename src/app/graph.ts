import {Commit} from './commit.model';


export class ChangesGraph {
  private cellHeight: any;
  private cellWidth: any;
  private element: HTMLElement;
  private commits: Commit[];

  constructor(commits, element: HTMLElement) {
    console.log(element);
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

    // const items = this.element.querySelectorAll('li');

    // for (let i = 0; i < items.length; i++) {
    //   items[i].style['line-height'] = this.cellHeight + 'px';
    //   items[i].style['margin-left'] = (Number(svg.getAttribute('width')) + 15) + 'px';
    // }
  }

  // ChangesGraph.prototype = {
  calcChildrenCount(): void {
    const items = this.commits;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      item.children = 0;
      const parent = item.parent;
      if (parent) {
        const children = this.commits[parent].children;
        this.commits[parent].children = Number(children) + 1;
      }

    }
    console.log(this.commits);
  }


  getViewTable() {
    const items = this.commits;
    console.log(items);

    const table = [];

    for (let index = 0; index < items.length; index++) {
      const item = items[index];

      const row = [];

      if (table.length) {
        const last = table[table.length - 1];
        //line
        for (let i = 0; i < last.length; i++) {
          const node = last[i];
          if (node.children === 1) {
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
      for (let i = 0; i < row.length; i++) {
        const node = row[i];

        if (node.id === item.parent) {
          node.id = item.id;

          node.type = 'O';
          node.children = Number(item.children);

          found = true;
          break;
        }
      }

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
    console.log(JSON.stringify(table));
    // return [
    //   [{'id': '0', 'type': 'O', 'children': 3, 'parentColumn': null}],
    //   [{
    //     'id': '1',
    //     'type': 'O',
    //     'children': 1,
    //     'parentColumn': 0
    //   }, {'id': '0', 'type': 'L', 'children': 2, 'parentColumn': 0}],
    //   [{'id': '1', 'type': 'L', 'children': 1, 'parentColumn': 0}, {
    //     'id': '2',
    //     'type': 'O',
    //     'children': 1,
    //     'parentColumn': 1
    //   }, {'id': '0', 'type': 'L', 'children': 1, 'parentColumn': 1}],
    //   [{'id': '1', 'type': 'L', 'children': 1, 'parentColumn': 0}, {
    //     'id': '2',
    //     'type': 'L',
    //     'children': 1,
    //     'parentColumn': 1
    //   }, {'id': '3', 'type': 'O', 'children': 0, 'parentColumn': 2}],
    //   [{'id': '1', 'type': 'L', 'children': 1, 'parentColumn': 0}, {
    //     'id': '4',
    //     'type': 'O',
    //     'children': 1,
    //     'parentColumn': 1
    //   }],
    //   [{'id': '1', 'type': 'L', 'children': 1, 'parentColumn': 0}, {
    //     'id': '5',
    //     'type': 'O',
    //     'children': 0,
    //     'parentColumn': 1
    //   }],
    //   [{'id': '6', 'type': 'O', 'children': 0, 'parentColumn': 0}]];

    return table;
  }

  makeSVGElement(tag, attrs): HTMLElement {
   // console.log(tag);
    // console.log(attrs);

    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k of Object.keys(attrs)) {
      el.setAttribute(k, attrs[k]);
    }
    return el;
  }


  buildSVG(table): SVGElement {
    console.log(table);
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

        if (table[i][j].parentColumn != null) {
          const link = this.makeSVGElement('line', {
            x1: table[i][j].parentColumn * this.cellWidth + this.cellWidth / 2,
            y1: cell.y - this.cellHeight,
            x2: cell.x,
            y2: cell.y,
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


