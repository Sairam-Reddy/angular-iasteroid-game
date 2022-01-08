/**
 * Collection
 *
 * @super Array
 */
export class Collection extends Array {
  public constructor() {
    super();
    for (var i = 0, len = arguments.length; i < len; i++) {
      this.push(arguments[i]);
    }
  }

  public eachUpdate(callback: Function) {
    for (let i = 0, len = this.length, item; i < len; i++) {
      item = this[i];

      if (item.vanished) {
        this.splice(i, 1);
        len--;
        i--;
        continue;
      }
      item.update();

      if (callback) {
        callback.call(this, i, item);
      }
    }
  }

  public eachDraw(ctx) {
    for (var i = 0, len = this.length; i < len; i++) {
      this[i].draw(ctx);
    }
  }
}
