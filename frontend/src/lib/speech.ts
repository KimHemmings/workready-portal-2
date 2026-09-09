// Minimal typed wrapper over the browser Web Speech API (webkitSpeechRecognition).
// The API is not in TS's DOM lib, so the shapes we use are declared by hand here.
import { useCallback, useEffect, useRef, useState } from "react";

type SpeechAlternative = { transcript: string };
type SpeechResult = { isFinal: boolean; 0: SpeechAlternative; length: number };
type SpeechResultList = { length: number; [index: number]: SpeechResult };
type SpeechEvent = { resultIndex: number; results: SpeechResultList };

interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechEvent) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
}

type RecognitionCtor = new () => Recognition;

function ctor(): RecognitionCtor | null {
  const w = window as unknown as {
    webkitSpeechRecognition?: RecognitionCtor;
    SpeechRecognition?: RecognitionCtor;
  };
  return w.webkitSpeechRecognition ?? w.SpeechRecognition ?? null;
}

export const speechSupported = () => ctor() !== null;

/**
 * Dictation hook: while listening, every recognised phrase is appended to the caller's text
 * through `onText`, so the participant sees their words appear in the box and can still edit them.
 */
export function useDictation(onText: (chunk: string) => void) {
  const [listening, setListening] = useState(false);
  const ref = useRef<Recognition | null>(null);
  const handler = useRef(onText);
  handler.current = onText;

  const stop = useCallback(() => {
    ref.current?.stop();
    ref.current = null;
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const Ctor = ctor();
    if (!Ctor) return false;
    const rec = new Ctor();
    rec.lang = "en-AU";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const result = e.results[i];
        if (result.isFinal) handler.current(result[0].transcript.trim());
      }
    };
    rec.onerror = () => {
      ref.current = null;
      setListening(false);
    };
    rec.onend = () => {
      ref.current = null;
      setListening(false);
    };
    ref.current = rec;
    rec.start();
    setListening(true);
    return true;
  }, []);

  useEffect(() => () => ref.current?.stop(), []);

  return { listening, start, stop, supported: speechSupported() };
}
