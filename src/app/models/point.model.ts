import { HelperFunctions } from '../helpers/helper-functions';

/**
 * Point
 */
export class Point {
  public x;
  public y;
  public constructor(x = undefined, y = undefined) {
    this.set(x, y);
  }

  public static interpolat(p1, p2, f) {
    var dx = p2.x - p1.x,
      dy = p2.y - p1.y;
    return new Point(p1.x + dx * f, p1.y + dy * f);
  }

  public static polar(length, angle) {
    return new Point(length * Math.cos(angle), length * Math.sin(angle));
  }

  public set(x, y) {
    if (HelperFunctions.isObject(x)) {
      y = x.y;
      x = x.x;
    }

    this.x = x !== undefined ? x : 0;
    this.y = y !== undefined ? y : 0;

    return this;
  }

  public offset(x, y) {
    this.x += x !== undefined ? x : 0;
    this.y += y !== undefined ? y : 0;

    return this;
  }

  public add(p) {
    this.x += p.x;
    this.y += p.y;

    return this;
  }

  public sub(p) {
    this.x -= p.x;
    this.y -= p.y;

    return this;
  }

  public scale(scale) {
    this.x *= scale;
    this.y *= scale;

    return this;
  }

  public length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public lengthSq() {
    return this.x * this.x + this.y * this.y;
  }

  public normalize(thickness) {
    if (HelperFunctions.isUndefined(thickness)) thickness = 1;

    var len = Math.sqrt(this.x * this.x + this.y * this.y);
    var nx = 0,
      ny = 0;

    if (len) {
      nx = this.x / len;
      ny = this.y / len;
    }

    this.x = nx * thickness;
    this.y = ny * thickness;

    return this;
  }

  public angle(): number {
    return Math.atan2(this.y, this.x);
  }

  public angleTo(p) {
    var dx = p.x - this.x,
      dy = p.y - this.y;
    return Math.atan2(dy, dx);
  }

  public distanceTo(p): number {
    var dx = this.x - p.x,
      dy = this.y - p.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public distanceToSq(p) {
    var dx = this.x - p.x,
      dy = this.y - p.y;
    return dx * dx + dy * dy;
  }

  public negate() {
    this.x *= -1;
    this.y *= -1;

    return this;
  }

  public eq(p) {
    return this.x === p.x && this.y === p.y;
  }

  public isEmpty() {
    return !this.x && !this.y;
  }

  public clone() {
    return new Point(this.x, this.y);
  }

  public toArray() {
    return [this.x, this.y];
  }

  public toString() {
    return '(x:' + this.x + ', y:' + this.y + ')';
  }
}
