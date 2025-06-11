import { useEffect, useRef } from 'react';

/**
 * Hook to manage focus within a modal or dialog
 */
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown);
    firstFocusable?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Hook to manage focus when a component mounts/unmounts
 */
export function useFocusOnMount(isActive: boolean = true) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isActive && elementRef.current) {
      elementRef.current.focus();
    }
  }, [isActive]);

  return elementRef;
}

/**
 * Hook to manage focus when a component's visibility changes
 */
export function useFocusOnVisibilityChange(isVisible: boolean) {
  const elementRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isVisible) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      elementRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isVisible]);

  return elementRef;
}

/**
 * Utility to generate ARIA labels
 */
export function generateAriaLabel(
  action: string,
  element: string,
  context?: string
): string {
  return `${action} ${element}${context ? ` ${context}` : ''}`;
}

/**
 * Utility to check if an element is visible in the viewport
 */
export function isElementVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

/**
 * Utility to scroll an element into view with smooth behavior
 */
export function scrollIntoView(element: HTMLElement): void {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
  });
}

/**
 * Utility to check if an element is keyboard focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const tag = element.tagName.toLowerCase();
  const type = element.getAttribute('type')?.toLowerCase();
  
  if (tag === 'a' || tag === 'button') return true;
  if (tag === 'input' && type !== 'hidden') return true;
  if (tag === 'select' || tag === 'textarea') return true;
  if (element.getAttribute('tabindex') !== null) return true;
  
  return false;
} 