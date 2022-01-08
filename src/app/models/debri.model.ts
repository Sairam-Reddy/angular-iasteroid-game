import { HelperFunctions } from '../helpers/helper-functions';
import { Point } from './point.model';

/**
 * Debri
 *
 * @super Point
 */
export class Debri extends Point {
  public speed;
  public vanished = false;

  public constructor(x, canvasHeight) {
    super(x, HelperFunctions.randInt(canvasHeight));
    this.speed = HelperFunctions.randUniform(2, 0.5);
  }

  public update() {
    if (this.vanished) {
      return;
    }

    if (this.x < 0) {
      this.vanished = true;
      return;
    }

    this.x = Math.round(this.x - this.speed);
  }

  public draw(ctx) {
    ctx.rect(this.x, this.y, 1, 1);
  }
}
