class Sprite {
  constructor(config) {

    // Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true; // flags the asset as loaded
    }

    // Shadow
    this.shadow = new Image();
    this.useShadow = true; // config.useShadow || false
    if (this.useShadow) {
      this.shadow.src = "/images/characters/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    // Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-down":  [[0, 0]],
      "idle-right": [[0, 1]],
      "idle-up":    [[0, 2]],
      "idle-left":  [[0, 3]],
      "walk-down":  [[1, 0], [0, 0], [3, 0], [0, 0]],
      "walk-right": [[1, 1], [0, 1], [3, 1], [0, 1]],
      "walk-up":    [[1, 2], [0, 2], [3, 2], [0, 2]],
      "walk-left":  [[1, 3], [0, 3], [3, 3], [0, 3]]
    }
    this.currentAnimation = config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    // movement cadence a.k.a character speed
    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;

    // Reference the game object
    this.gameObject = config.gameObject;
  }

  // which animation is on?
  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  // setAnimation takes a (movement) key and changes the animation of the character
  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    // Downtick frame progress
    if (this.animationFrameProgress > 0) { // if there is still work to do...
      this.animationFrameProgress -= 1;
      return;
    }

    // Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) { // if the animation gets out of bonds, start from 0
      this.currentAnimationFrame = 0
    }
  }

  draw(ctx, cameraPerson) {
    // X and Y define the osition of the character on the map.
    // The grid are embedded inside the gameObject and the numbers 8 and 18 refer to the nudge
    const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
    const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;

    // Prints shadow first...
    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    const [frameX, frameY] = this.frame

    // ...and then the characters on top of it.
    this.isLoaded && ctx.drawImage(this.image,
      frameX * 32, frameY * 32,   // left, top cut
      32, 32, // width, height cut
      x, y,   // position of the character on the map
      32, 32  // size of the character
    )

    this.updateAnimationProgress();
  }
}
