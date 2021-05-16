export class GraphItem {
  // элемент графа. Бывает трех типов
  // NULL -пусто
  // L - line
  // O - object те узел
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
