import { HelperFunctions } from '../helpers/helper-functions';
import { Path } from './path.model';
import { Point } from './point.model';
import { Splinter } from './splinter.model';

const PI = Math.PI;
const TWO_PI = PI * 2;
const DEG_TO_RAD: number = PI / 180;
const ASTEROID_MAX_SIZE = 80;
const ASTEROID_MIN_SIZE = 5;
const SCORE = {
  ASTEROID_DAMAGE: 10,
  ASTEROID_DESTROY: 50,
  UFO_DAMAGE: 0,
  UFO_DESTROY: 300,
};

/**
 * Asteroid
 *
 * @super Point
 */
export class Asteroid extends Point {
  public radius;
  public vanished = false;
  public v;
  public path;
  public angleValue: number;

  public constructor(x, y, radius, angle) {
    super(x, y);
    this.radius = radius;
    this.angleValue = angle;

    this.make();
  }

  // Returns a new Asteroid object with random parameters
  // Appearance location has a traveling angle to enter the screen outside the screen
  public static spawn(canvasWidth, canvasHeight) {
    var side = HelperFunctions.randInt(3);
    var angle = HelperFunctions.randUniform(PI * 0.5);
    var x, y;

    // 0: Left, 1: Right
    if (side === 0 || side === 1) {
      y = HelperFunctions.randUniform(
        canvasHeight + ASTEROID_MAX_SIZE,
        -ASTEROID_MAX_SIZE
      );
      x = side === 0 ? -ASTEROID_MAX_SIZE : canvasWidth + ASTEROID_MAX_SIZE;
      angle = side === 0 ? angle - PI * 0.25 : angle + PI * 0.75;
    }
    // 2: Top, 3: Bottom
    else {
      x = HelperFunctions.randUniform(
        canvasWidth + ASTEROID_MAX_SIZE,
        -ASTEROID_MAX_SIZE
      );
      y = side === 2 ? -ASTEROID_MAX_SIZE : canvasHeight + ASTEROID_MAX_SIZE;
      angle = side === 2 ? angle + PI * 0.25 : angle - PI * 0.75;
    }

    // Asteroid.MIN_SIZE ~ ASTEROID_MAX_SIZE
    var radius = HelperFunctions.randUniform(
      ASTEROID_MAX_SIZE,
      ASTEROID_MIN_SIZE
    );
    return new Asteroid(x, y, radius, angle);
  }

  public make() {
    this.v = Point.polar(1, this.angleValue);
    this.v.normalize((1 - this.radius / ASTEROID_MAX_SIZE) * 1.75 + 0.25);

    this.path = new Path();
    for (var i = 0, num = 12, radius; i < num; i++) {
      radius = HelperFunctions.randUniform(this.radius, this.radius * 0.5);
      this.path.push(Point.polar(radius, (TWO_PI * i) / num).add(this));
    }
  }

  // Decrease radius by given damage, disappear if it falls below ASTEROID_MIN_SIZE
  // damage is specified as a ratio up to 1, and the damage ratio is expressed as a coefficient of ASTEROID_MAX_SIZE
  // Add a Splinter that reflects the size of the asteroid to the Collection passed as an argument
  public damage(damage, splinters) {
    if (damage <= 0) return;
    if (damage > 1) damage = 1;

    var radiusTemp = this.radius;
    var debrisNum = Math.round(32 * damage);
    var score = SCORE.ASTEROID_DAMAGE;

    this.radius -= ASTEROID_MAX_SIZE * damage;

    if (this.radius < ASTEROID_MIN_SIZE) {
      // ASTEROID_MIN_SIZE
      this.vanished = true;
      score = SCORE.ASTEROID_DESTROY;
    } else {
      this.angleValue =
        this.angleValue + DEG_TO_RAD * HelperFunctions.randUniform(30, -30);
      this.make();
    }

    splinters.push(new Splinter(this.x, this.y, radiusTemp, debrisNum));

    return score;
  }

  public update(fieldRange) {
    if (this.vanished) {
      return;
    }

    if (!fieldRange.contains(this.x, this.y, ASTEROID_MAX_SIZE + 10)) {
      this.vanished = true;
      return;
    }

    var v = this.v;
    this.add(v);
    this.path.eachPoints(function (p, i) {
      p.add(v);
    });
  }

  public draw(ctx) {
    this.path.draw(ctx);
  }
}
