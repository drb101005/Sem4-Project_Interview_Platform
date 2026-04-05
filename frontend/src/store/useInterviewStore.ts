import { create } from 'zustand';

export type QuestionItem = {
  id: string;
  question_text: string;
  order_index: number;
};

type InterviewState = {
  interviewId: string | null;
  questions: QuestionItem[];
  currentIndex: number;
  skipsUsed: number;
  setInterview: (id: string, questions: QuestionItem[]) => void;
  nextQuestion: () => void;
  skipQuestion: () => void;
  reset: () => void;
};

export const useInterviewStore = create<InterviewState>((set, get) => ({
  interviewId: null,
  questions: [],
  currentIndex: 0,
  skipsUsed: 0,
  setInterview: (id, questions) => set({ interviewId: id, questions, currentIndex: 0, skipsUsed: 0 }),
  nextQuestion: () => {
    const { currentIndex, questions } = get();
    const next = Math.min(currentIndex + 1, questions.length - 1);
    set({ currentIndex: next });
  },
  skipQuestion: () => {
    const { skipsUsed } = get();
    set({ skipsUsed: skipsUsed + 1 });
    get().nextQuestion();
  },
  reset: () => set({ interviewId: null, questions: [], currentIndex: 0, skipsUsed: 0 }),
}));
