'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInterviewStore } from '@/store/useInterviewStore';
import { getSocket } from '@/lib/socket';
import { apiFetch } from '@/lib/api';

const TIMER_SECONDS = 30;
const MAX_SKIPS = 5;

export default function InterviewPage() {
  const router = useRouter();
  const { interviewId, questions, currentIndex, nextQuestion, skipQuestion, skipsUsed } = useInterviewStore();
  const current = questions[currentIndex];
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [status, setStatus] = useState<'idle' | 'recording' | 'saving'>('idle');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const socket = useMemo(() => getSocket(), []);

  useEffect(() => {
    if (!interviewId || !current) {
      router.push('/setup');
    }
  }, [interviewId, current, router]);

  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => null);
  }, []);

  useEffect(() => {
    async function initMedia() {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
        }

        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const recorder = new MediaRecorder(audioStream);
        recorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
            event.data.arrayBuffer().then((buffer) => {
              socket.emit('audio_chunk', {
                interviewId,
                questionId: current?.id,
                chunk: new Uint8Array(buffer),
              });
            });
          }
        };

        recorder.onstop = () => {
          socket.emit('answer_complete', {
            interviewId,
            questionId: current?.id,
          });
        };
      } catch (err) {
        console.error(err);
      }
    }

    initMedia();
  }, [interviewId, current?.id, socket]);

  useEffect(() => {
    if (!current) return;
    setTimeLeft(TIMER_SECONDS);
    setStatus('idle');

    const startTimeout = setTimeout(() => {
      recorderRef.current?.start(1000);
      setStatus('recording');
    }, 1000);

    return () => clearTimeout(startTimeout);
  }, [current?.id]);

  useEffect(() => {
    if (status !== 'recording') return;
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (timeLeft <= 0 && status === 'recording') {
      handleDone();
    }
  }, [timeLeft, status]);

  function handleDone() {
    if (status !== 'recording') return;
    setStatus('saving');
    recorderRef.current?.stop();
    setTimeout(() => {
      setStatus('idle');
      nextQuestion();
    }, 1200);
  }

  function handleSkip() {
    if (skipsUsed >= MAX_SKIPS) return;
    if (status === 'recording') {
      recorderRef.current?.stop();
    }
    skipQuestion();
  }

  async function handleEnd() {
    if (!interviewId) return;
    await apiFetch(`/interviews/${interviewId}/end`, { method: 'POST' });
    router.push(`/results/${interviewId}`);
  }

  if (!current) return null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate">Question {currentIndex + 1} of {questions.length}</p>
            <h1 className="text-2xl font-semibold text-ink">{current.question_text}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate">Time left</p>
            <p className="text-3xl font-bold text-ink">{timeLeft}s</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="btn btn-primary" onClick={handleDone} disabled={status !== 'recording'}>
            Done Answering
          </button>
          <button
            className="btn btn-ghost"
            onClick={handleSkip}
            disabled={skipsUsed >= MAX_SKIPS}
          >
            Skip Question ({MAX_SKIPS - skipsUsed} left)
          </button>
          <button className="btn btn-ghost" onClick={handleEnd}>
            End Interview
          </button>
        </div>

        <div className="mt-6 text-sm text-slate">
          {status === 'recording' ? 'Recording in progress...' : status === 'saving' ? 'Saving response...' : 'Get ready to answer.'}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 w-48 rounded-2xl overflow-hidden shadow-lg border border-mist">
        <video ref={videoRef} autoPlay muted playsInline className="h-32 w-full object-cover" />
        <div className="bg-white px-3 py-2 text-xs text-slate">Camera Preview</div>
      </div>
    </main>
  );
}
