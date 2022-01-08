import { HelperFunctions } from '../helpers/helper-functions';

/**
 * Path
 *
 * @super Array
 */
export class Path extends Array {
  public closed = true;
  public constructor(points?, closed?) {
    super();
    if (HelperFunctions.isArray(points)) {
      for (var i = 0, len = points.length; i < len; i++) {
        this.push(points[i]);
      }
    }

    this.closed = HelperFunctions.isUndefined(closed) ? true : closed;
  }

  public segment(index) {
    if (index > this.segmentNum()) {
      return null;
    }
    return [this[index], this[index === this.length - 1 ? 0 : index + 1]];
  }

  public segmentNum() {
    return this.closed ? this.length : this.length - 1;
  }

  public eachSegments(callback: Function) {
    for (var i = 0, len = this.segmentNum(); i < len; i++) {
      if (callback.call(this, this.segment(i), i) === false) {
        break;
      }
    }
  }

  public eachPoints(callback: Function) {
    for (var i = 0, len = this.length; i < len; i++) {
      if (callback.call(this, this[i], i) === false) {
        break;
      }
    }
  }

  public draw(ctx) {
    this.eachPoints(function (p, i) {
      ctx[i === 0 ? 'moveTo' : 'lineTo'](p.x, p.y);
    });

    if (this.closed && this.length > 2) {
      var p = this[0];
      ctx.lineTo(p.x, p.y);
    }
  }
}
