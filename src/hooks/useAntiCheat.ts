import { useState, useEffect, useCallback, useRef } from 'react';

interface AntiCheatState {
  strikes: number;
  isFullscreen: boolean;
  isTabActive: boolean;
  lastViolation: string | null;
}

export const useAntiCheat = (maxStrikes: number = 2, onAutoSubmit: () => void) => {
  const [state, setState] = useState<AntiCheatState>({
    strikes: 0,
    isFullscreen: false,
    isTabActive: true,
    lastViolation: null,
  });

  // Use a ref for the callback to prevent effect re-runs when the parent component re-renders
  const onAutoSubmitRef = useRef(onAutoSubmit);
  useEffect(() => {
    onAutoSubmitRef.current = onAutoSubmit;
  }, [onAutoSubmit]);

  const addStrike = useCallback((type: 'FULLSCREEN_EXIT' | 'TAB_SWITCH') => {
    setState(prev => {
      const newStrikes = prev.strikes + 1;
      if (newStrikes >= maxStrikes) {
        onAutoSubmitRef.current();
      }
      return {
        ...prev,
        strikes: newStrikes,
        lastViolation: type,
      };
    });
  }, [maxStrikes]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setState(prev => ({ ...prev, isTabActive: false }));
        addStrike('TAB_SWITCH');
      } else {
        setState(prev => ({ ...prev, isTabActive: true }));
      }
    };

    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setState(prev => ({ ...prev, isFullscreen: isFs }));
      if (!isFs) {
        addStrike('FULLSCREEN_EXIT');
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      // Silently block context menu attempts
      console.warn("SECURITY: Context menu access blocked.");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === 'F12') {
        e.preventDefault();
        console.warn("SECURITY: F12 blocked.");
      }
      // Block Ctrl+Shift+I, J, C (Inspect, Console, Components)
      if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) {
        e.preventDefault();
        console.warn("SECURITY: DevTools shortcut blocked.");
      }
      // Block Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        console.warn("SECURITY: View source blocked.");
      }
      // Block Ctrl+S (Save Page)
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        console.warn("SECURITY: Save page blocked.");
      }
    };

    // Listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Initial state check
    setState(prev => ({ 
      ...prev, 
      isFullscreen: !!document.fullscreenElement,
      isTabActive: !document.hidden
    }));

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [addStrike]);

  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error("Error entering fullscreen:", err);
    }
  };

  return {
    ...state,
    enterFullscreen,
    resetStrikes: () => setState(prev => ({ ...prev, strikes: 0, lastViolation: null }))
  };
};
