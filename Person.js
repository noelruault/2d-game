class Person extends GameObject {
  constructor(config) {
    super(config); // constructor of GameObject

    this.movingProgressRemaining = 0;
    this.isPlayerControlled = config.isPlayerControlled || false;
    this.directionUpdate = {
      "up": ["y", -1],
      "down": ["y", 1],
      "left": ["x", -1],
      "right": ["x", 1],
    }
  }

  updatePosition() {
    if (this.movingProgressRemaining > 0) {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemaining -= 1;
    }
  }

  update(state) {
    this.updatePosition();

    // only if the player has finished the previous movement
    if (this.isPlayerControlled && this.movingProgressRemaining === 0) {
      // detect when an movement is coming in
      if (state.arrow) {
        this.direction = state.arrow;      // move
        this.movingProgressRemaining = 16; // reset counter
      }
    }
  }
}
