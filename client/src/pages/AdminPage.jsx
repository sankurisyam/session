import React, { useState, useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import '../App.css';

const API_BASE = 'http://localhost:5000';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(null);
  const fileInputRef = useRef();

  function onPickFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function onDragOver(e) { e.preventDefault(); }

  async function startSession() {
    setLoading(true);
    setProgress(null);
    try {
      const form = new FormData();
      if (file) form.append('video', file);

      // Use fetch with FormData — server's /api/sessions accepts upload.single('video')
      const res = await fetch(`${API_BASE}/api/sessions`, {
        method: 'POST',
        body: form,
      });

      // server returns created session object
      const data = await res.json();

      // server might store path as videoPath or videoUrl — handle both
      const videoUrl = data.videoUrl || data.videoPath || (data.videoPath && `${API_BASE}${data.videoPath}`) || null;
      const sess = {
        ...data,
        videoUrl: videoUrl || (preview || null),
      };
      setSession(sess);
      setProgress(100);
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-card">
        <h1>Admin — Create Session</h1>

        {!session && (
          <>
            <div
              className="upload-dropzone"
              onDrop={onDrop}
              onDragOver={onDragOver}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              {!preview ? (
                <div className="upload-hint">
                  <strong>Drag & drop</strong> a video here or <button className="linkish" onClick={() => fileInputRef.current && fileInputRef.current.click()}>browse</button>
                  <div className="muted">MP4, WebM — up to server limits</div>
                </div>
              ) : (
                <div className="preview-wrap">
                  <VideoPlayer src={preview} controls className="preview-player" />
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={onPickFile} />
            </div>

            <div style={{ marginTop: 12 }}>
              <button className="btn primary" onClick={startSession} disabled={loading}>
                {loading ? 'Creating...' : 'START SESSION (upload)'}
              </button>
              <button className="btn" style={{ marginLeft: 8 }} onClick={() => { setFile(null); setPreview(null); }}>
                Clear
              </button>
            </div>

            {progress !== null && (
              <div className="progress">Progress: {progress}%</div>
            )}
          </>
        )}

        {session && (
          <div style={{ marginTop: 20 }}>
            <p><strong>Session ID:</strong> {session.unique_id}</p>
            <p><strong>Shareable link:</strong> <a href={session.userurl} target="_blank" rel="noreferrer">{session.userurl}</a></p>

            <h3>Video Player (Admin)</h3>
            <VideoPlayer src={(session.videoUrl && session.videoUrl.startsWith('/')) ? `${API_BASE}${session.videoUrl}` : session.videoUrl} controls />

            <p className="muted" style={{ marginTop: 8 }}>
              Anyone visiting the link will see the same player (same unique_id).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
