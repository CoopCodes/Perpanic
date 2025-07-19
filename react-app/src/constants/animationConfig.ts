export const TICKER_ANIMATION_CONFIG = {
  duration: 60000,
  iterations: Infinity,
  easing: 'linear',
  lerp: 50,
  speedDivisor: 55,
  keyframes: {
    forward: [
      { transform: 'translateX(0%)' },
      { transform: 'translateX(-50%)' }
    ] as Keyframe[],
    reverse: [
      { transform: 'translateX(-50%)' },
      { transform: 'translateX(0%)' }
    ] as Keyframe[]
  }
} as const;

export interface TickerAnimationConfig {
  duration: number;
  iterations: number;
  easing: string;
  lerp: number;
  speedDivisor: number;
  keyframes: {
    forward: Keyframe[];
    reverse: Keyframe[];
  };
} 