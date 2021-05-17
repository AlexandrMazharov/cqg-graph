export class GraphItem {
  // graph item is a node of graph table
  // NULL  - empty cell
  // L - line
  // O - object = node
  public id: string;
  public type: string;
  public children: number;
  public startColumn: number;
  public finishColumn: number;
  public mergeFrom: number;

  constructor(id: string, type: string, children: number, startColumn: number, finishColumn: number, mergeFrom: number) {
    this.id = id;
    this.type = type;
    this.children = children;
    this.startColumn = startColumn;
    this.finishColumn = finishColumn;
    this.mergeFrom = mergeFrom;

  }
}
