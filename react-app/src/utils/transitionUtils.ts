type EasingFunction = (t: number) => number;
type SetterFunction = (value: number) => void;

export function animate(
  start: number,
  end: number,
  duration: number,
  setValue: SetterFunction,
  easing: EasingFunction = t => t // default: linear
): Promise<void> {
  return new Promise<void>((resolve) => {
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easing(t);
      const currentValue = start + (end - start) * easedT;
      setValue(currentValue);

      if (t < 1) {
        requestAnimationFrame(update);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(update);
  });
}
