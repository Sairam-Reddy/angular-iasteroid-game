export class HelperFunctions {
  public static extend(...args: Array<any>) {
    var target = args[0] || {},
      o,
      p;

    for (var i = 1, len = args.length; i < len; i++) {
      o = args[i];

      if ((!this.isObject(o) || this, this.isNull(o))) {
        continue;
      }

      for (p in o) {
        target[p] = o[p];
      }
    }

    return target;
  }

  public static randUniform(max, min = undefined): number {
    if (min === undefined) {
      min = 0;
    }
    return Math.random() * (max - min) + min;
  }

  public static randInt(max, min = undefined) {
    if (min === undefined) {
      min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public static isObject(value) {
    return typeof value === 'object' && value !== null;
  }

  public static isNumber(value) {
    return typeof value === 'number';
  }

  public static isNumeric(value) {
    return !isNaN(value) && isFinite(value);
  }

  public static isString(value) {
    return typeof value === 'string';
  }

  private isFunction(value) {
    return typeof value === 'function';
  }

  public static isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  public static isNull(value) {
    return value === null;
  }

  public static isUndefined(value) {
    return typeof value === 'undefined';
  }
}
