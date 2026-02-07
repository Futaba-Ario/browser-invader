const CONTROL_KEYS = new Set(["ArrowLeft", "ArrowRight", "Space", "Enter"]);

export function createInput() {
  return {
    down: new Set(),
    pressed: new Set()
  };
}

export function attachInputListeners(input, target = window) {
  function onKeyDown(event) {
    if (!CONTROL_KEYS.has(event.code)) {
      return;
    }

    if (!input.down.has(event.code) && !event.repeat) {
      input.pressed.add(event.code);
    }
    input.down.add(event.code);
    event.preventDefault();
  }

  function onKeyUp(event) {
    if (!CONTROL_KEYS.has(event.code)) {
      return;
    }

    input.down.delete(event.code);
    event.preventDefault();
  }

  target.addEventListener("keydown", onKeyDown);
  target.addEventListener("keyup", onKeyUp);

  return () => {
    target.removeEventListener("keydown", onKeyDown);
    target.removeEventListener("keyup", onKeyUp);
  };
}

export function isDown(input, code) {
  return input.down.has(code);
}

export function wasPressed(input, code) {
  return input.pressed.has(code);
}

export function clearPressed(input) {
  input.pressed.clear();
}
