"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

export interface MusicPlayerHandle {
  play: () => void;
  pause: () => void;
}

const MusicPlayer = forwardRef<MusicPlayerHandle>((_, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<{ play: () => void; pause: () => void; setVolume: (v: number) => void; bind: (e: string, cb: () => void) => void } | null>(null);
  const isReadyRef = useRef(false);
  const pendingPlay = useRef(false);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (widgetRef.current && isReadyRef.current) {
        widgetRef.current.play();
      } else {
        pendingPlay.current = true;
      }
    },
    pause: () => {
      if (widgetRef.current && isReadyRef.current) {
        widgetRef.current.pause();
      }
    },
  }));

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;

    script.onload = () => {
      if (!iframeRef.current) return;
      const SC = (window as unknown as { SC?: { Widget: ((el: HTMLIFrameElement) => typeof widgetRef.current) & { Events: { READY: string } } } }).SC;
      if (!SC) return;

      const widget = SC.Widget(iframeRef.current);
      widgetRef.current = widget;

      widget?.bind(SC.Widget.Events.READY, () => {
        isReadyRef.current = true;
        widget?.setVolume(80);
        if (pendingPlay.current) {
          widget?.play();
          pendingPlay.current = false;
        }
      });
    };

    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // SoundCloud embed for "Crew" by GoldLink
  const embedUrl =
    "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/goldlink/crew-ft-brent-faiyaz-shy-glizzy&color=%23d4a843&auto_play=false&buying=false&liking=false&download=false&sharing=false&show_artwork=false&show_comments=false&show_playcount=false&show_user=false&hide_related=true&visual=false";

  return (
    <div className="absolute bottom-0 right-0 w-0 h-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        width="1"
        height="1"
        allow="autoplay"
        title="Music player"
      />
    </div>
  );
});

MusicPlayer.displayName = "MusicPlayer";
export default MusicPlayer;
