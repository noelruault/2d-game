class GameObject {
  constructor(config) {
    this.id = null; // id helps targeting game objects to give them specific interactions or behaviors
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "/images/characters/people/hero.png",
    });
    this.behavior = config.behavior || [];
    this.behaviorIndex = 0;
  }

  // doBehaviorEvent calls asynchronously all the behaviors associated to a certain character in
  // the game. This function calls itself recursively, keeping track of the behaviorIndex of any
  // specific event
  async doBehaviorEvent(map) {
    // Don't do anything if there is a more important cutscene or I don't have config to do anything anyway.
    if (map.isCutscenePlaying || this.behavior.length === 0 || this.isStanding) {
      return;
    }

    // Setting up our event with relevant info
    let eventConfig = this.behavior[this.behaviorIndex];
    eventConfig.who = this.id;

    // Create an event instance out of our next event config
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init(); // await blocks until init() is finished.

    // Setting the next event to fire
    this.behaviorIndex += 1;
    if (this.behaviorIndex === this.behavior.length) {
      this.behaviorIndex = 0;
    }

    // Recursive Do it again!
    this.doBehaviorEvent(map);
  }

  mount(map) {
    this.isMounted = true;
    map.addWall(this.x, this.y);

    // If we have a behavior, kick off after a short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10)
  }

  update() {}
}
