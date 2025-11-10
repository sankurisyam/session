import React, { useRef, useState, useEffect } from 'react';
import '../App.css';

export default function VideoPlayer({ src, controls = true, poster, className }) {
  const vidRef = useRef();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
  }, [src]);

  function handleFullscreen() {
    const el = vidRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  }

  return (
    <div className={`video-card ${className || ''}`}>
      <div className="video-wrapper">
        <video
          ref={vidRef}
          src={src}
          poster={poster}
          controls={controls}
          onLoadedData={() => setIsReady(true)}
          className="video-element"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="video-controls-row">
        <div className="video-state">{isReady ? 'Ready to play' : 'Loading...'}</div>
        <div className="video-actions">
          <button className="btn" onClick={() => vidRef.current && vidRef.current.play()}>Play</button>
          <button className="btn" onClick={() => vidRef.current && vidRef.current.pause()}>Pause</button>
          <button className="btn" onClick={() => { if (vidRef.current) vidRef.current.muted = !vidRef.current.muted; }}>
            Mute
          </button>
          <button className="btn primary" onClick={handleFullscreen}>Fullscreen</button>
        </div>
      </div>
    </div>
  );
}
