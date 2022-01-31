class Person extends GameObject {
  constructor(config) {
    super(config) // constructor of GameObject

    this.movingProgressRemaining = 0
    this.isStanding = false
    this.isPlayerControlled = config.isPlayerControlled || false
    this.directionUpdate = {
      up:    ["y", -1],
      down:  ["y", 1],
      left:  ["x", -1],
      right: ["x", 1],
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction]
    this[property] += change
    this.movingProgressRemaining -= 1

    if (this.movingProgressRemaining === 0) {
      // when the moving action is finished
      utils.emitEvent("PersonWalkingComplete", { whoId: this.id })
    }
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction)
      return
    }
    this.sprite.setAnimation("idle-" + this.direction)
  }

  // startBehavior sets the character state to whatever behavior has
  startBehavior(state, behavior) {
    this.direction = behavior.direction // move
    if (behavior.type === "walk") {

      // Stop here if space is not free and retry
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        behavior.retry && setTimeout(() => {
          this.startBehavior(state, behavior)
        }, 10)

        return
      }

      // Ready to walk!
      state.map.moveWall(this.x, this.y, this.direction)
      this.movingProgressRemaining = 16 // reset
      this.updateSprite(state)
    }

    if (behavior.type === "stand") {
      this.isStanding = true
      setTimeout(() => {
        utils.emitEvent("PersonStandComplete", {
          whoId: this.id,
        })
        this.isStanding = false
      }, behavior.time)
    }
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition()
    } else {
      // More cases for starting to walk will come here
      // ...

      // Case: We're keyboard ready and have an arrow pressed
      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow,
        })
      }
      this.updateSprite(state)
    }
  }

}
