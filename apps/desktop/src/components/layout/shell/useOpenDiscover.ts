import { useSetAtom } from "jotai";
import { useCallback } from "react";

import {
  focusModeAtom,
  hitechhubPendingPathAtom,
  projectViewAtom,
  workspaceOverlayAtom,
} from "./state/ui";

/**
 * Open the Hitechhub workspace overlay, optionally navigated to a specific path
 * (e.g. `/threads/<postId>` to jump to a post an agent just published, or
 * `/marketplace?type=holaapp` for install). A bare open lands on the feed.
 */
export function useOpenDiscover() {
  const setProjectView = useSetAtom(projectViewAtom);
  const setWorkspaceOverlay = useSetAtom(workspaceOverlayAtom);
  const setFocusMode = useSetAtom(focusModeAtom);
  const setHolahubPath = useSetAtom(hitechhubPendingPathAtom);
  return useCallback(
    (path?: string) => {
      setProjectView(null);
      setFocusMode(false);
      setHolahubPath(path ?? null);
      setWorkspaceOverlay("hitechhub");
    },
    [setProjectView, setFocusMode, setHolahubPath, setWorkspaceOverlay]
  );
}
