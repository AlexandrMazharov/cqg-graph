import {Deserializable} from './Deserializable';

export class Commit implements Deserializable {
  id: string;
  text: string;
  time: string;
  previous: [];
  children: string;
  parent: string;
  parent2: string; //mergeTo: number;
  mergeFrom: string;


  constructor() {
  }


  deserialize(input: any): any {
    Object.assign(this, input);
    return this;
  }

}
