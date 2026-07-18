import { useState } from 'react';

interface QuizQuestion {
  question: string;
  choices: string[];
  answer: string;
}

interface QuizProps {
  questions: QuizQuestion[];
}

const Quiz = ({ questions }: QuizProps) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce((total, question, index) => {
    return total + (answers[index] === question.answer ? 1 : 0);
  }, 0);

  return (
    <div className="rounded-[40px] border border-slate-800/70 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-rose-300/80">Interactive Quiz</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">Test Your Knowledge</h2>
        </div>
        <div className="rounded-3xl bg-slate-900/75 px-4 py-3 text-sm text-slate-200">Score {submitted ? `${score}/${questions.length}` : '—'}</div>
      </div>
      <div className="mt-6 space-y-5">
        {questions.map((question, index) => (
          <div key={question.question} className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-5">
            <p className="text-sm font-semibold text-slate-100">{question.question}</p>
            <div className="mt-4 grid gap-3">
              {question.choices.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [index]: choice }))}
                  className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                    answers[index] === choice
                      ? 'border-cyan-400/80 bg-cyan-400/10 text-cyan-100'
                      : 'border-slate-800/70 bg-slate-950/70 text-slate-300 hover:border-slate-600/80 hover:bg-slate-900'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setSubmitted(true)}
        className="mt-6 inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:brightness-110"
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default Quiz;
