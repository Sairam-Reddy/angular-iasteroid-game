/**
 * Range
 */
export class Range {
  public left;
  public right;
  public top;
  public bottom;

  public Range(left, right, top, bottom) {
    this.left = left || 0;
    this.right = right || 0;
    this.top = top || 0;
    this.bottom = bottom || 0;
  }

  public contains(x, y, inflate) {
    if (!inflate) inflate = 0;
    return (
      x > this.left - inflate &&
      x < this.right + inflate &&
      y > this.top - inflate &&
      y < this.bottom + inflate
    );
  }
}
