'use client';

import { useEffect, useRef, useState } from 'react';
import { API_URL } from '@/lib/api';

export default function TestLabPage() {
  const [ttsText, setTtsText] = useState('Hello! This is a test.');
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [whisperLoading, setWhisperLoading] = useState(false);
  const [whisperError, setWhisperError] = useState<string | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
    };
  }, [audioPreviewUrl]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setCameraError(null);
      } catch (err) {
        setCameraError('Camera access denied or unavailable.');
        setCameraActive(false);
      }
    };

    initCamera();

    return () => {
      cancelled = true;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const updateAudioPreview = (nextUrl: string | null) => {
    setAudioPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });
  };

  const handleGenerateSpeech = async () => {
    setTtsLoading(true);
    setTtsError(null);
    try {
      const res = await fetch(`${API_URL}/test/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ttsText }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTtsAudioUrl(data.audioUrl || data.url || null);
    } catch (err) {
      setTtsError('Failed to generate audio.');
    } finally {
      setTtsLoading(false);
    }
  };

  const startRecording = async () => {
    if (isRecording) return;
    setWhisperError(null);
    setTranscript(null);
    setAudioBlob(null);
    updateAudioPreview(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        updateAudioPreview(URL.createObjectURL(blob));
        setIsRecording(false);
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop());
          audioStreamRef.current = null;
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setWhisperError('Microphone access denied or unavailable.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    mediaRecorderRef.current?.stop();
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;
    setWhisperLoading(true);
    setWhisperError(null);
    try {
      const formData = new FormData();
      formData.append(
        'file',
        new File([audioBlob], 'recording.webm', {
          type: audioBlob.type || 'audio/webm',
        }),
      );
      const res = await fetch(`${API_URL}/test/whisper`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTranscript(data.transcript || '');
    } catch (err) {
      setWhisperError('Transcription failed.');
    } finally {
      setWhisperLoading(false);
    }
  };

  const faceDetected = cameraActive;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">
          Test Lab
        </p>
        <h1 className="text-3xl font-bold text-ink">Experimental Feature Playground</h1>
        <p className="max-w-3xl text-slate">
          This isolated space lets you test audio, transcription, and camera detection
          without touching the main interview flow.
        </p>
      </header>

      <section className="card space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">1. TTS Test</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
            POST /test/tts
          </span>
        </div>
        <div className="space-y-3">
          <textarea
            className="input min-h-[120px]"
            value={ttsText}
            onChange={(event) => setTtsText(event.target.value)}
            placeholder="Type text for TTS..."
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="btn btn-primary"
              onClick={handleGenerateSpeech}
              disabled={ttsLoading}
            >
              {ttsLoading ? 'Generating...' : 'Generate Speech'}
            </button>
            {ttsError ? <span className="text-sm text-red-600">{ttsError}</span> : null}
          </div>
          {ttsAudioUrl ? (
            <audio className="w-full" controls src={ttsAudioUrl} />
          ) : (
            <p className="text-sm text-slate">Audio output will appear here.</p>
          )}
        </div>
      </section>

      <section className="card space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">2. Whisper Test</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
            POST /test/whisper
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="btn btn-primary"
            onClick={startRecording}
            disabled={isRecording}
          >
            Record
          </button>
          <button
            className="btn btn-ghost"
            onClick={stopRecording}
            disabled={!isRecording}
          >
            Stop
          </button>
          <button
            className="btn btn-ghost"
            onClick={handleTranscribe}
            disabled={!audioBlob || whisperLoading}
          >
            {whisperLoading ? 'Transcribing...' : 'Transcribe'}
          </button>
          {isRecording ? (
            <span className="text-sm font-semibold text-accent">Recording…</span>
          ) : null}
          {whisperError ? (
            <span className="text-sm text-red-600">{whisperError}</span>
          ) : null}
        </div>
        {audioPreviewUrl ? (
          <audio className="w-full" controls src={audioPreviewUrl} />
        ) : (
          <p className="text-sm text-slate">Record audio to preview it here.</p>
        )}
        <div className="rounded-xl border border-mist bg-white/70 px-4 py-3 text-sm text-slate">
          Transcript:{' '}
          <span className="font-semibold text-ink">
            {transcript || 'Waiting for transcription...'}
          </span>
        </div>
      </section>

      <section className="card space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">3. Camera + Face Detection</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
            getUserMedia
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
          <div className="overflow-hidden rounded-xl border border-mist bg-black/5">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-[280px] w-full object-cover"
            />
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-mist bg-white/80 px-4 py-3">
              <p className="text-sm uppercase tracking-[0.2em] text-slate">Status</p>
              <p className="mt-2 text-lg font-semibold text-ink">
                {faceDetected ? 'Face Detected ✅' : 'No Face ❌'}
              </p>
              <p className="mt-2 text-sm text-slate">
                Simple detection: we treat an active video stream as a detected face.
              </p>
            </div>
            {cameraError ? (
              <p className="text-sm text-red-600">{cameraError}</p>
            ) : (
              <p className="text-sm text-slate">
                Allow camera access to enable the live preview.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
