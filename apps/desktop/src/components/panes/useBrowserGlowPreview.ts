import { useEffect, useState } from "react";

const BROWSER_GLOW_PREVIEW_EVENT = "hitechcloud:browser-glow-preview-change";

declare global {
  interface Window {
    __hitechcloudBrowserGlowPreviewEnabled?: boolean;
    __hitechcloudDevBrowserGlowPreview?: {
      on: () => void;
      off: () => void;
      toggle: () => void;
      set: (next: boolean) => void;
      get: () => boolean;
    };
  }
}

function setBrowserGlowPreviewEnabled(next: boolean) {
  window.__hitechcloudBrowserGlowPreviewEnabled = next;
  window.dispatchEvent(
    new CustomEvent(BROWSER_GLOW_PREVIEW_EVENT, {
      detail: next,
    }),
  );
}

export function useBrowserGlowPreview() {
  const [enabled, setEnabled] = useState(
    () => window.__hitechcloudBrowserGlowPreviewEnabled === true,
  );

  useEffect(() => {
    const applyCurrentState = () => {
      setEnabled(window.__hitechcloudBrowserGlowPreviewEnabled === true);
    };

    const handlePreviewChange = () => {
      applyCurrentState();
    };

    applyCurrentState();
    window.addEventListener(
      BROWSER_GLOW_PREVIEW_EVENT,
      handlePreviewChange as EventListener,
    );
    window.__hitechcloudDevBrowserGlowPreview = {
      on: () => setBrowserGlowPreviewEnabled(true),
      off: () => setBrowserGlowPreviewEnabled(false),
      toggle: () =>
        setBrowserGlowPreviewEnabled(
          window.__hitechcloudBrowserGlowPreviewEnabled !== true,
        ),
      set: (next: boolean) => setBrowserGlowPreviewEnabled(next),
      get: () => window.__hitechcloudBrowserGlowPreviewEnabled === true,
    };

    return () => {
      window.removeEventListener(
        BROWSER_GLOW_PREVIEW_EVENT,
        handlePreviewChange as EventListener,
      );
    };
  }, []);

  return enabled;
}
