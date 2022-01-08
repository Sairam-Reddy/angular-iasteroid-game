import { HelperFunctions } from '../helpers/helper-functions';
import { Point } from './point.model';

const PI = Math.PI;
const TWO_PI = PI * 2;

/**
 * Splinter
 *
 * @super Point
 */
export class Splinter extends Point {
  private _values;
  private _time;
  public vanished = false;

  public constructor(x, y, radius, num) {
    super(x, y);

    var values = (this._values = []);
    for (var i = 0; i < num; i++) {
      values.push({
        x: x,
        y: y,
        angle: HelperFunctions.randUniform(TWO_PI),
        radius: HelperFunctions.randUniform(radius),
        dist: Math.random(),
      });
    }

    this._time = new Date().getTime();
  }

  public update(fieldRange) {
    var o, c, r, x, y;

    for (var i = 0, len = this._values.length; i < len; i++) {
      o = this._values[i];
      c = o.angle;
      r = o.radius;
      x = o.x = Math.round(this.x + r * Math.cos(c));
      y = o.y = Math.round(this.y + r * Math.sin(c));

      if (!fieldRange.contains(x, y)) {
        this._values.splice(i, 1);
        len--;
        i--;
        continue;
      }

      this._values[i].radius += o.dist;
    }

    this.vanished =
      this._values.length === 0 || new Date().getTime() - this._time > 1000 * 7;
  }

  public draw(ctx) {
    for (var i = 0, len = this._values.length, o; i < len; i++) {
      o = this._values[i];
      ctx.rect(o.x, o.y, 1, 1);
    }
  }
}
