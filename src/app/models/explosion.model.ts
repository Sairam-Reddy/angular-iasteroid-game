import { Path } from './path.model';
import { Point } from './point.model';

const PI = Math.PI;
const TWO_PI = PI * 2;

/**
 * Explosion
 *
 * @super Path
 */
export class ExplosionPath extends Path {
  public currentRange = 0;
  public complete = false;
  public x;
  public y;
  public options;
  public speed;
  public range;

  public constructor(x, y, options: { speed; range }) {
    super();
    this.x = x;
    this.y = y;
    if (options) {
      this.speed = options.speed;
      this.range = options.range;
    }
  }

  public update() {
    if (this.complete) {
      return;
    }

    this.currentRange += this.speed * 2;

    if (this.currentRange > this.range) {
      this.currentRange = this.range;
      this.complete = true;
    }

    for (var i = 0, p; i < 10; i++) {
      p = Point.polar(this.currentRange / 2, (TWO_PI / 10) * i).add(this);

      // In the case of a class that inherits an array, the length is not reflected well in the insertion by specifying the address directly, so push is used first
      if (!this[i]) {
        this.push(p);
      } else {
        this[i] = p;
      }
    }
  }
}
