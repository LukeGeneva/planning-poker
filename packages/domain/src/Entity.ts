export class Entity {
  private _id: string;

  get id() {
    return this._id;
  }

  constructor() {
    this._id = crypto.randomUUID();
  }
}
