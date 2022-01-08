import { HelperFunctions } from '../helpers/helper-functions';
import { Path } from './path.model';
import { Point } from './point.model';
import { Splinter } from './splinter.model';

const SCORE = {
  ASTEROID_DAMAGE: 10,
  ASTEROID_DESTROY: 50,
  UFO_DAMAGE: 0,
  UFO_DESTROY: 300,
};
const UFO_SPEED = 2;

/**
 * Ufo
 *
 * @super Point
 */
export class Ufo extends Point {
  public path;
  public destination;
  public v;
  public vanished = false;
  public hp = 100;
  public damagedBlink = 0;

  public constructor(x, y, canvasWidth, canvasHeight) {
    super(x, y);

    var P = function (px, py) {
      return new Point(x + px, y + py);
    };

    this.path = new Path([
      P(-4.5, -5),
      P(4.5, -5),
      P(7, 0), // 2
      P(15, 4.5), // 3
      P(7, 9),
      P(-7, 9),
      P(-15, 4.5), // 6
      P(-7, 0), // 7
    ]);

    this.destination = new Point(
      HelperFunctions.randUniform(canvasWidth),
      HelperFunctions.randUniform(canvasHeight)
    );
    this.v = new Point();
  }

  public static spawn(canvasWidth, canvasHeight) {
    var x,
      y,
      side = HelperFunctions.randInt(3); // 出現位置をランダムに決定

    // 0: Left, 1: Right
    if (side === 0 || side === 1) {
      y = HelperFunctions.randUniform(canvasHeight + 30, -30);
      x = side === 0 ? -30 : canvasWidth + 30;
    }
    // 2: Top, 3: Bottom
    else {
      x = HelperFunctions.randUniform(canvasWidth + 30, -30);
      y = side === 2 ? -30 : canvasHeight + 30;
    }

    return new Ufo(x, y, canvasWidth, canvasHeight);
  }

  public damage(damage, splinters) {
    if (damage <= 0) return;
    if (damage > 1) damage = 1;

    var splinterRadius = 10;
    var splinterNum = 5;
    var score = SCORE.UFO_DAMAGE;

    this.hp -= damage * 100;
    if (this.hp <= 0) {
      this.vanished = true;
      splinterRadius = 25;
      splinterNum = 20;
      score = SCORE.UFO_DESTROY;
    }

    splinters.push(new Splinter(this.x, this.y, splinterRadius, splinterNum));

    this.damagedBlink = 40;

    return score;
  }

  public update(args: { canvasWidth; canvasHeight }) {
    var v = this.v;
    var destination = this.destination;

    v.set(destination).sub(this);

    var dist = v.length();
    if (dist > UFO_SPEED) {
      v.normalize(UFO_SPEED);
    } else if (dist < 0.1) {
      destination.set(
        HelperFunctions.randUniform(args.canvasWidth),
        HelperFunctions.randUniform(args.canvasHeight)
      );
    }

    this.add(v);
    this.path.eachPoints(function (p, i) {
      p.add(v);
    });
  }

  public draw(ctx) {
    if (this.damagedBlink) {
      var off = this.damagedBlink % 4 === 0;
      this.damagedBlink--;
      if (off) return;
    }

    var path = this.path;
    path.draw(ctx);

    // 内側のライン
    var a1 = path[2],
      a2 = path[7];
    ctx.moveTo(a1.x, a1.y);
    ctx.lineTo(a2.x, a2.y);
    var b1 = path[3],
      b2 = path[6];
    ctx.moveTo(b1.x, b1.y);
    ctx.lineTo(b2.x, b2.y);
  }
}
