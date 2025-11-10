import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import '../App.css';

const API_BASE = 'https://sessio-rr3v.onrender.com';

export default function StudentPage() {
  const { uniqueId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/sessions/${uniqueId}`);
        if (!res.ok) {
          setSession(null);
          return;
        }
        const data = await res.json();
        // server may return videoPath or videoUrl
        const videoUrl = data.videoUrl || data.videoPath || (data.videoPath && `${API_BASE}${data.videoPath}`) || null;
        setSession({ ...data, videoUrl: videoUrl || data.videoUrl });
      } catch (err) {
        console.error(err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [uniqueId]);

  if (loading) return <div className="page-wrap"><div className="page-card">Loading session...</div></div>;
  if (!session) return <div className="page-wrap"><div className="page-card">Session not found.</div></div>;

  return (
    <div className="page-wrap">
      <div className="page-card">
        <h1>Student View</h1>
        <p><strong>Session:</strong> {session.unique_id}</p>
        <VideoPlayer src={(session.videoUrl && session.videoUrl.startsWith('/')) ? `${API_BASE}${session.videoUrl}` : session.videoUrl} controls />
      </div>
    </div>
  );
}
