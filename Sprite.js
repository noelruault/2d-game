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
      idleDown: [ // default
        [0, 0]
      ]
    }
    this.currentAnimation = config.currentAnimation || "idleDown";
    this.currentAnimationFrame = 0;

    // Reference the game object
    this.gameObject = config.gameObject;
  }

  draw(ctx) {
    // position of the character on the map. (16 = grid; 8, 18 = nudge)
    const x = this.gameObject.x * 16 - 8;
    const y = this.gameObject.y * 16 - 18;

    // Prints shadow first...
    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    // ...and then the characters on top of it.
    this.isLoaded && ctx.drawImage(this.image,
      0, 0,   // left, top cut
      32, 32, // width, height cut
      x, y,   // position of the character on the map
      32, 32  // size of the character
    )
  }
}
