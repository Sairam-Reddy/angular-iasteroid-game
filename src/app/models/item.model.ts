import { HelperFunctions } from '../helpers/helper-functions';
import { Path } from './path.model';
import { Point } from './point.model';

const PI = Math.PI;
const TWO_PI = PI * 2;
const ITEM_SPEED = 0.5;

// Special weapon array, Randomly appear when you destroy a UFO
const WEPON_SPECIAL = [
  {
    name: 'TINY BEAM',
    power: 0.1,
    speed: 10,
    length: 5,
    width: 1,
    color: 'rgb(131, 224, 8)',
    shootingInterval: 1000 * 0.1,
    through: false,
    explosion: false,
  },
  {
    name: 'BLASTER',
    power: 1,
    speed: 3,
    length: 15,
    width: 3,
    color: 'rgb(244, 0, 122)',
    shootingInterval: 1000 * 0.3,
    through: false,
    explosion: false,
  },
  {
    name: 'LASER',
    power: 0.2,
    speed: 35,
    length: 200,
    width: 2,
    color: 'rgb(138, 227, 252)',
    shootingInterval: 1000 * 0.6,
    through: true,
    explosion: false,
  },
  {
    name: 'EXPLOSION BEAM',
    power: 0.15,
    speed: 15,
    length: 10,
    width: 2,
    color: 'rgb(255, 153, 0)',
    shootingInterval: 1000 * 0.5,
    through: false,
    explosion: {
      range: 100,
      speed: 4.5,
    },
  } /*
,{
  name: 'INSANE BEAM',
  power: 0.035,
  speed: 7.5,
  length: 5,
  color: 'rgb(255, 246, 0)',
  width: 2,
  shootingInterval: 1000 * 0.015,
  through: true,
  explosion: false,
  explosion: {
    range: 75,
    speed: 2
  }
}//*/,
];

/**
 * Item
 *
 * @super Point
 */
export class Item extends Point {
  public path;
  public wepon;
  public v;
  public vanished;

  public constructor(x, y) {
    super(x, y);

    var path = (this.path = new Path());

    var d = TWO_PI / 6;
    for (var i = 0; i < 6; i++) {
      path.push(Point.polar(10, d * i).add(this));
    }

    this.wepon =
      WEPON_SPECIAL[HelperFunctions.randInt(WEPON_SPECIAL.length - 1)];

    this.v = Point.polar(ITEM_SPEED, HelperFunctions.randUniform(TWO_PI));
  }

  public update(fieldRange) {
    var v = this.v;
    this.add(v);
    this.path.eachPoints(function (p, i) {
      p.add(v);
    });

    // 画面外に出たら消失
    if (!fieldRange.contains(this.x, this.y, 20)) {
      this.vanished = true;
      return;
    }
  }

  public draw(ctx) {
    this.path.draw(ctx);
    // 対角線を描画
    this.path.eachPoints(function (p, i) {
      if (i === 3) return false;
      ctx.moveTo(p.x, p.y);
      var p2 = this[i + 3];
      ctx.lineTo(p2.x, p2.y);
    });
  }
}
