import { Breakpoint, useScreenSize, type BreakpointType } from "../hooks/useScreenSize";

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

export function vw(value: number, viewWidth: number) {
  return (viewWidth * value) / 1000;
}

export function vh(value: number, viewHeight: number) {
  return (viewHeight * value) / 100;
}

export function getValueForBreakpoint(mobile: any, tablet: any, desktop: any, currBreakpoint: BreakpointType) {
  if (currBreakpoint >= Breakpoint.XS) return mobile;
  if (currBreakpoint >= Breakpoint.XS) return tablet;
  if (currBreakpoint >= Breakpoint.MD) return desktop;
  return desktop;
}