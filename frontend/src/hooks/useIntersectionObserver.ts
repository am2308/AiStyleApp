import { useEffect, useState, useRef, RefObject } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
}

export function useIntersectionObserver<T extends Element>(
  options: IntersectionObserverOptions = {}
): [RefObject<T>, boolean] {
  const { 
    root = null, 
    rootMargin = '0px', 
    threshold = 0,
    triggerOnce = false
  } = options;
  
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    
    // If the element doesn't exist or IntersectionObserver is not supported, return
    if (!element || typeof IntersectionObserver === 'undefined') {
      return;
    }
    
    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Create a new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
        
        // If triggerOnce is true and the element is intersecting, disconnect the observer
        if (triggerOnce && entry.isIntersecting && observerRef.current) {
          observerRef.current.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );
    
    // Start observing the element
    observerRef.current.observe(element);
    
    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [root, rootMargin, threshold, triggerOnce]);
  
  return [elementRef, isIntersecting];
}
