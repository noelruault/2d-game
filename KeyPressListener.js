// KeyPressListener is an abstraction to achieve a "classic gamepad press", where you must release a
// key and press it again if you want to get repeated presses to occur.
class KeyPressListener {
   constructor(keyCode, callback) {
      let keySafe = true;

      this.keyDown = function (event) {
         if (event.code === keyCode) {
            if (keySafe) {
               keySafe = false;
               callback(); // callback is triggered the first time the key is pressed
            }
         }
      };

      this.keyUp = function (event) {
         if (event.code === keyCode) {
            keySafe = true;
         }
      };

      document.addEventListener("keydown", this.keyDown);
      document.addEventListener("keyup", this.keyUp);
   }

   // unbind can be triggered to stop listening to KeyPressListener events
   unbind() {
      document.removeEventListener("keydown", this.keyDown);
      document.removeEventListener("keyup", this.keyUp);
   }
}
