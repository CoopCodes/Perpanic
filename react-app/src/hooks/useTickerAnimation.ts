import { useRef, useEffect, useMemo } from 'react';
import { ScrollDirection } from '../App';
import { animate } from '../utils/transitionUtils';
import { TICKER_ANIMATION_CONFIG } from '../constants/animationConfig';

interface UseTickerAnimationOptions {
  lerp?: number;
  easing?: string;
  speedDivisor?: number;
}

export function useTickerAnimation(
  animation: Animation | null,
  scrollSpeed: number,
  scrollDirection: ScrollDirection,
  options: UseTickerAnimationOptions = {}
) {
  const prevScrollDirection = useRef<ScrollDirection>(ScrollDirection.Down);
  const animationActive = useRef<boolean>(false);

  const {
    lerp = TICKER_ANIMATION_CONFIG.lerp,
    easing = TICKER_ANIMATION_CONFIG.easing,
    speedDivisor = TICKER_ANIMATION_CONFIG.speedDivisor
  } = options;

  console.log(easing);

  const speedMultiplier = useMemo(() => {
    return 1 + (scrollSpeed / speedDivisor);
  }, [scrollSpeed, speedDivisor]);

  useEffect(() => {
    if (!animation || animationActive.current) return;

    if (scrollDirection !== prevScrollDirection.current) {
      animationActive.current = true;
      
      animate(
        animation.playbackRate,
        0,
        lerp,
        (value: number) => {
          animation.playbackRate = value;
        }
      ).then(() => {
        const rawCurrentTime = Number(animation.currentTime) || 0;
        const duration = animation.effect?.getComputedTiming().duration as number || TICKER_ANIMATION_CONFIG.duration;
        
        const currentProgress = rawCurrentTime % duration;
                  
        const keyframeEffect = animation.effect as KeyframeEffect;

        if (scrollDirection === ScrollDirection.Up) {
          keyframeEffect.setKeyframes(TICKER_ANIMATION_CONFIG.keyframes.reverse);
          animation.currentTime = duration - currentProgress;
        } else {
          keyframeEffect.setKeyframes(TICKER_ANIMATION_CONFIG.keyframes.forward);
          animation.currentTime = duration - currentProgress;
        }
        
        prevScrollDirection.current = scrollDirection;
      }).then(() => {
        animationActive.current = false;
      }).catch((error) => {
        console.error('Ticker animation error:', error);
        animationActive.current = false;
      });
    } else {
      animation.playbackRate = speedMultiplier;
    }
  }, [scrollSpeed, scrollDirection, animation, speedMultiplier, lerp]);
} 