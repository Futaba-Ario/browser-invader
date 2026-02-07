const CONTROL_KEYS = new Set(["ArrowLeft", "ArrowRight", "Space", "Enter"]);

export function createInput() {
  return {
    down: new Set(),
    pressed: new Set(),
    activeSources: new Map()
  };
}

export function attachInputListeners(input, target = window) {
  function onKeyDown(event) {
    if (!CONTROL_KEYS.has(event.code)) {
      return;
    }

    if (!event.repeat) {
      pressControl(input, event.code, "keyboard");
    }
    event.preventDefault();
  }

  function onKeyUp(event) {
    if (!CONTROL_KEYS.has(event.code)) {
      return;
    }

    releaseControl(input, event.code, "keyboard");
    event.preventDefault();
  }

  target.addEventListener("keydown", onKeyDown);
  target.addEventListener("keyup", onKeyUp);

  return () => {
    target.removeEventListener("keydown", onKeyDown);
    target.removeEventListener("keyup", onKeyUp);
  };
}

export function attachVirtualButtonListeners(input, elements = {}) {
  const bindings = [
    [elements.left, "ArrowLeft"],
    [elements.right, "ArrowRight"],
    [elements.shoot, "Space"],
    [elements.action, "Enter"]
  ];
  const supportsPointerEvents = typeof window !== "undefined" && "PointerEvent" in window;
  const cleanups = [];

  for (const [index, entry] of bindings.entries()) {
    const [element, code] = entry;
    if (!(element instanceof HTMLElement)) {
      continue;
    }

    const sourceId = `virtual:${code}:${index}`;
    const onContextMenu = (event) => {
      event.preventDefault();
    };

    if (supportsPointerEvents) {
      const activePointers = new Set();

      const onPointerDown = (event) => {
        if (event.button !== undefined && event.button !== 0) {
          return;
        }

        activePointers.add(event.pointerId);
        if (activePointers.size === 1) {
          pressControl(input, code, sourceId);
        }
        element.classList.add("is-active");
        capturePointer(element, event.pointerId);
        event.preventDefault();
      };

      const onPointerRelease = (event) => {
        if (!activePointers.has(event.pointerId)) {
          return;
        }

        activePointers.delete(event.pointerId);
        if (activePointers.size === 0) {
          releaseControl(input, code, sourceId);
          element.classList.remove("is-active");
        }
        releasePointer(element, event.pointerId);
        event.preventDefault();
      };

      element.addEventListener("pointerdown", onPointerDown);
      element.addEventListener("pointerup", onPointerRelease);
      element.addEventListener("pointercancel", onPointerRelease);
      element.addEventListener("lostpointercapture", onPointerRelease);
      element.addEventListener("contextmenu", onContextMenu);

      cleanups.push(() => {
        element.removeEventListener("pointerdown", onPointerDown);
        element.removeEventListener("pointerup", onPointerRelease);
        element.removeEventListener("pointercancel", onPointerRelease);
        element.removeEventListener("lostpointercapture", onPointerRelease);
        element.removeEventListener("contextmenu", onContextMenu);
        element.classList.remove("is-active");
        releaseControl(input, code, sourceId);
      });
      continue;
    }

    let active = false;

    const onPress = (event) => {
      if (event instanceof MouseEvent && event.button !== 0) {
        return;
      }

      if (active) {
        return;
      }

      active = true;
      pressControl(input, code, sourceId);
      element.classList.add("is-active");
      event.preventDefault();
    };

    const onRelease = (event) => {
      if (!active) {
        return;
      }

      active = false;
      releaseControl(input, code, sourceId);
      element.classList.remove("is-active");
      event.preventDefault();
    };

    element.addEventListener("mousedown", onPress);
    element.addEventListener("mouseup", onRelease);
    element.addEventListener("mouseleave", onRelease);
    element.addEventListener("touchstart", onPress, { passive: false });
    element.addEventListener("touchend", onRelease, { passive: false });
    element.addEventListener("touchcancel", onRelease, { passive: false });
    element.addEventListener("contextmenu", onContextMenu);

    cleanups.push(() => {
      element.removeEventListener("mousedown", onPress);
      element.removeEventListener("mouseup", onRelease);
      element.removeEventListener("mouseleave", onRelease);
      element.removeEventListener("touchstart", onPress);
      element.removeEventListener("touchend", onRelease);
      element.removeEventListener("touchcancel", onRelease);
      element.removeEventListener("contextmenu", onContextMenu);
      element.classList.remove("is-active");
      releaseControl(input, code, sourceId);
    });
  }

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
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

function pressControl(input, code, sourceId) {
  if (!CONTROL_KEYS.has(code)) {
    return;
  }

  const sources = getOrCreateSources(input, code);
  const wasDown = sources.size > 0;
  sources.add(sourceId);

  if (!wasDown) {
    input.pressed.add(code);
  }
  input.down.add(code);
}

function releaseControl(input, code, sourceId) {
  if (!CONTROL_KEYS.has(code)) {
    return;
  }

  const sources = input.activeSources.get(code);
  if (!sources) {
    return;
  }

  sources.delete(sourceId);
  if (sources.size === 0) {
    input.activeSources.delete(code);
    input.down.delete(code);
  }
}

function getOrCreateSources(input, code) {
  let sources = input.activeSources.get(code);
  if (sources) {
    return sources;
  }

  sources = new Set();
  input.activeSources.set(code, sources);
  return sources;
}

function capturePointer(element, pointerId) {
  if (typeof element.setPointerCapture !== "function") {
    return;
  }

  try {
    element.setPointerCapture(pointerId);
  } catch {
    // Ignore capture errors from browsers that reject this pointer.
  }
}

function releasePointer(element, pointerId) {
  if (typeof element.releasePointerCapture !== "function") {
    return;
  }

  try {
    if (element.hasPointerCapture(pointerId)) {
      element.releasePointerCapture(pointerId);
    }
  } catch {
    // Ignore release failures from browsers that already dropped capture.
  }
}
