import {Deserializable} from './Deserializable';

export class Tag implements Deserializable {
  commit: string;
  tag: string;

  deserialize(input: any): any {
    Object.assign(this, input);
    return this;
  }

}
