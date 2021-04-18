import {Deserializable} from './Deserializable';

export class Commit implements Deserializable {
  id: number;
  text: string;
  time: string;
  previous: [];
  children: number;
  parent: number;
  mergeTo: number;


  constructor() {
  }



  deserialize(input: any): any {
    Object.assign(this, input);
    return this;
  }

}
