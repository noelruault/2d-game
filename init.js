(function () { // function that executes itself

  const overworld = new Overworld({
    element: document.querySelector(".game-container")
  });

  overworld.init();
})();
