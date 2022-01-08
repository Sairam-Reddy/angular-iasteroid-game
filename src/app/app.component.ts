import {
  AfterViewInit,
  Component,
  ElementRef,
  VERSION,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('graphCanvas') graphCanvas: ElementRef;

  private ctx: CanvasRenderingContext2D;
  private canvasElement: HTMLCanvasElement;

  //------------------------------------
  // CONFIG
  //------------------------------------

  // Default weapon
  public WEPON_DEFAULT = {
    // Weapon name
    name: 'NORMAL BEAM',
    // Damage dealt 0 ~ 1
    power: 0.3,
    // Bullet speed
    speed: 3,
    // Bullet length
    length: 10,
    // Bullet width
    width: 1,
    // The color of the bullet, in the case of special weapons, reflected in the color of the item, specified by CSS color
    color: 'white',
    // Fire rate
    shootingInterval: 1000 * 0.35,
    // true
    // explosion
    // Indicates whether the bullet
    // If true, will not disappear even if it lands
    // If explosion is specified, it takes precedence.
    through: false,
    // Range attack after landing due to explosion
    // Specify with an object that has the following properties:
    // { range: Explosion range, speed: Explosion speed }
    // * The power of range attacks is half the basic power of weapons
    explosion: false,
  };

  // Special weapon array, Randomly appear when you destroy a UFO
  public WEPON_SPECIAL = [
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
  public ASTEROID_MAX_SIZE = 80;
  public ASTEROID_MIN_SIZE = 5;
  public ASTEROID_MAX_NUM = 75;
  public ASTEROID_SPAWN_TIME = 350;
  public SHIP_SPEED = 1.5;
  public UFO_SPEED = 2;
  public ITEM_SPEED = 0.5;

  public UFO_INCIDENCE = 0.0035;

  public SPECIAL_WEPON_TIME = 1000 * 20;

  public SCORE = {
    ASTEROID_DAMAGE: 10,
    ASTEROID_DESTROY: 50,
    UFO_DAMAGE: 0,
    UFO_DESTROY: 300,
  };

  //------------------------------------
  // CONSTANTS
  //------------------------------------

  public PI = Math.PI;
  public TWO_PI = this.PI * 2;
  public DEG_TO_RAD = this.PI / 180;
  public FPS = 60;

  //------------------------------------
  // Variables
  //------------------------------------

  // private canvas;
  private canvasWidth;
  private canvasHeight;
  // private context;
  private mouse;
  private isMouseDown = false;
  private ship; // Ship
  private beams; // Collection of Beam
  private asteroids; // Collection of Asteroid
  private splinters; // Collection of Splinter
  private debris; // Collection of Debri
  private ufo; // Ufo
  private item; // Item
  private asteroidLastSpawn = 0;
  private ufoLastSpawn = 0;
  private debriLastSpawn = 0;
  private fieldRange;
  private score = 0;
  private isPlay = false;
  private dom = {
    menu: null,
    title: null,
    message: null,
    tweet: null,
    start: null,
    score: null,
    wepon: null,
  };

  public ngAfterViewInit(): void {
    this.canvasElement = this.graphCanvas.nativeElement;
    this.ctx = this.canvasElement.getContext('2d');

    this.fieldRange = new Range();

    window.addEventListener('resize', resize, false);
    this.resize();

    this.mouse = new Point();

    this.dom.menu = document.getElementById('menu');
    this.dom.title = document.getElementById('title');
    this.dom.message = document.getElementById('message');
    this.dom.start = document.getElementById('start');
    this.dom.score = document.getElementById('score');
    this.dom.wepon = document.getElementById('wepon');

    this.dom.start.addEventListener('click', start, false);
    this.canvasElement.addEventListener('mousemove', mouseMove, false);
    this.canvasElement.addEventListener('mousedown', mouseDown, false);
    this.canvasElement.addEventListener('mouseup', mouseUp, false);
    this.canvasElement.addEventListener('click', click, false);

    this.canvasElement.addEventListener('touchmove', touchMove, false);
    this.canvasElement.addEventListener('touchstart', mouseDown, false);
    this.canvasElement.addEventListener('touchend', mouseUp, false);

    this.debris = new Collection();
    for (var i = 0; i < 30; i++) {
      this.debris.push(new Debri(randInt(canvasWidth)));
    }

    setInterval(loop, 1000 / this.FPS);
  }

  //------------------------------------
  // EVENT HANDLERS
  //------------------------------------

  private resize(e) {
    this.canvasElement.width =
      this.canvasWidth =
      this.fieldRange.right =
        window.innerWidth;
    this.canvasElement.height =
      this.canvasHeight =
      this.fieldRange.bottom =
        window.innerHeight;

    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 1;
  }

  private start(e) {
    this.play();
    this.dom.menu.style.display = 'none';
    e.preventDefault();
  }

  private mouseMove(e) {
    this.mouse.set(e.clientX, e.clientY);
  }

  private touchMove(e) {
    this.mouse.set(e.touches[0].clientX, e.touches[0].clientY);
    console.log(e.touches[0].clientX, e.touches[0].clientY);
  }

  private mouseDown(e) {
    this.isMouseDown = true;
  }

  private mouseUp(e) {
    this.isMouseDown = false;
  }

  private click(e) {
    if (this.ship) {
      this.ship.fire(this.beams);
    }
  }

  //------------------------------------
  // FRAME LOOP
  //------------------------------------

  private loop() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    var now = new Date().getTime();

    // Spawn Debri
    if (now - this.debriLastSpawn > 300) {
      this.debris.push(new Debri(this.canvasWidth));
      this.debriLastSpawn = now;
    }

    // Debri update
    this.debris.eachUpdate();

    if (this.isPlay) {
      // Spawn

      if (
        now - this.asteroidLastSpawn > this.ASTEROID_SPAWN_TIME &&
        this.asteroids.length < this.ASTEROID_MAX_NUM
      ) {
        this.asteroids.push(Asteroid.spawn());
        this.asteroidLastSpawn = now;
      }

      if (!this.ufo && !this.item && Math.random() < this.UFO_INCIDENCE) {
        this.ufo = Ufo.spawn();
      }

      // Update

      if (this.ship) {
        if (this.isMouseDown) {
          this.ship.fire(this.beams);
        }
        this.ship.update(this.mouse);
      }

      if (this.ufo) {
        this.ufo.update();
        if (this.ufo.vanished) {
          this.item = new Item(this.ufo.x, this.ufo.y);
          this.ufo = null;
        } else if (this.hitDetection(this.ufo, this.ship)) {
          this.gameOver();
        }
      }

      if (this.item) {
        this.item.update();
        if (this.item.vanished) {
          this.item = null;
        } else if (this.hitDetection(this.item, this.ship)) {
          this.ship.setSpecialWepon(this.item.wepon);
          this.item = null;
        }
      }

      this.beams.eachUpdate(function (index, beam) {
        for (var i = 0; i < this.asteroids.length; i++) {
          this.asteroid = this.asteroids[i];
          if (this.hitDetection(beam, this.asteroid)) {
            this.score += this.asteroid.damage(beam.power, this.splinters);
            beam.notifyHit();
          }
        }

        if (this.ufo && this.hitDetection(beam, this.ufo)) {
          this.score += this.ufo.damage(beam.power, this.splinters);
          beam.notifyHit();
        }
      });

      this.asteroids.eachUpdate(function (index, asteroid) {
        if (this.hitDetection(asteroid, this.ship)) {
          this.gameOver();
        }
      });

      this.splinters.eachUpdate();

      // Display

      this.dom.wepon.innerHTML = this.ship.currentWepon.name;
      this.dom.score.innerHTML = this.score;
    }

    // Draw

    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgb(255, 255, 255)';
    this.ctx.lineWidth = 1;
    if (this.ship) {
      this.ship.draw(this.ctx);
    }
    if (this.ufo) {
      this.ufo.draw(this.ctx);
    }
    if (this.asteroids) {
      this.asteroids.eachDraw(this.ctx);
    }
    this.ctx.stroke();

    // Beam
    if (this.beams) {
      this.beams.eachDraw(this.ctx);
    }

    if (this.item) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.item.wepon.color;
      this.ctx.lineWidth = 1;
      this.item.draw(this.ctx);
      this.ctx.stroke();
    }

    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgb(255, 255, 255)';
    if (this.splinters) {
      this.splinters.eachDraw(this.ctx);
    }
    if (this.debris) {
      this.debris.eachDraw(this.ctx);
    }
    // Game over
    if (this.ship && this.ship.died) {
      this.ship.update();
      this.ship.splinter.draw(this.ctx);
    }
    this.ctx.fill();
  }

  //------------------------------------
  // FUNCTIONS
  //------------------------------------

  private play() {
    this.ship = new Ship(this.canvasWidth / 2, this.canvasHeight / 2, 8);
    this.mouse.set(this.ship.x, this.ship.y);
    this.beams = new Collection();
    this.asteroids = new Collection();
    this.splinters = new Collection();
    this.ufo = null;
    this.item = null;
    this.score = 0;
    this.isMouseDown = false;
    this.isPlay = true;
  }

  private gameOver() {
    this.ship.destroy();
    this.isPlay = false;
    this.dom.title.innerHTML = 'GAME OVER!';
    this.dom.message.innerHTML = 'YOUR SCORE ' + this.score + ' POINTS<br />';
    this.dom.message.appendChild(this.tweetLink());
    this.dom.menu.style.display = 'block';
  }

  private tweetLink() {
    var exc = this.score < 1000 ? '...' : this.score > 3000 ? '!!!' : '!';
    if (!this.dom.tweet) {
      this.dom.tweet = document.createElement('a');
      this.dom.tweet.id = 'tweet';
      this.dom.tweet.innerHTML = 'TWEET YOUR SCORE';
    }
    this.dom.tweet.href =
      'https://twitter.com/intent/tweet?url=https://codepen.io/akm2/pen/eYYyELr&text=SCORE ' +
      this.score +
      ' PTS' +
      exc +
      ' - ASTEROIDS';
    this.dom.tweet.target = '_blank';
    return this.dom.tweet;
  }

  // Perform path collision detection
  // The object specified in the argument can be referenced from the path property.
  private hitDetection(a, b) {
    var ap = a.path,
      bp = b.path;
    var as, bs; // Segments
    var a1, a2, b1, b2; // Points

    for (let i = 0, ilen = ap.segmentNum(); i < ilen; i++) {
      as = ap.segment(i);
      a1 = as[0];
      a2 = as[1];
      for (let j = 0, jlen = bp.segmentNum(); j < jlen; j++) {
        bs = bp.segment(j);
        b1 = bs[0];
        b2 = bs[1];
        if (this.intersection(a1, a2, b1, b2)) {
          return true;
        }
      }
    }

    return false;
  }

  // Straight line intersection detection used in hitDetection
  // True if they intersect
  private intersection(a1, a2, b1, b2) {
    var ax = a2.x - a1.x,
      ay = a2.y - a1.y;
    var bx = b2.x - b1.x,
      by = b2.y - b1.y;
    return (
      (ax * (b1.y - a1.y) - ay * (b1.x - a1.x)) *
        (ax * (b2.y - a1.y) - ay * (b2.x - a1.x)) <=
        0 &&
      (bx * (a1.y - b1.y) - by * (a1.x - b1.x)) *
        (bx * (a2.y - b1.y) - by * (a2.x - b1.x)) <=
        0
    );
  }

  //------------------------------------
  // UTILS
  //------------------------------------

  private extend() {
    var target = arguments[0] || {},
      o,
      p;

    for (var i = 1, len = arguments.length; i < len; i++) {
      o = arguments[i];

      if ((!this.isObject(o) || this, isNull(o))) continue;

      for (p in o) {
        target[p] = o[p];
      }
    }

    return target;
  }

  private randUniform(max, min) {
    if (min === undefined) {
      min = 0;
    }
    return Math.random() * (max - min) + min;
  }

  private randInt(max, min) {
    if (min === undefined) {
      min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private isObject(value) {
    return typeof value === 'object' && value !== null;
  }

  private isNumber(value) {
    return typeof value === 'number';
  }

  private isNumeric(value) {
    return !isNaN(value) && isFinite(value);
  }

  private isString(value) {
    return typeof value === 'string';
  }

  private isFunction(value) {
    return typeof value === 'function';
  }

  private isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  private isNull(value) {
    return value === null;
  }

  private isUndefined(value) {
    return typeof value === 'undefined';
  }
}
