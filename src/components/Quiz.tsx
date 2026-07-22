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
    <div className="rounded-[40px] border border-fuchsia-500/10 bg-gradient-to-br from-slate-950/85 via-[#081c35]/95 to-[#150828]/95 p-6 shadow-2xl shadow-fuchsia-900/20 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-fuchsia-200/80">Interactive Quiz</p>
          <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Test Your Knowledge</h2>
        </div>
        <div className="rounded-3xl bg-[#07182c]/75 px-4 py-3 text-sm text-cyan-200">Score {submitted ? `${score}/${questions.length}` : '—'}</div>
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
                      ? 'border-fuchsia-400/80 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 text-fuchsia-100'
                      : 'border-cyan-500/15 bg-slate-950/70 text-cyan-100/90 hover:border-cyan-400/40 hover:bg-slate-900'
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
        className="mt-6 inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-500/25 transition hover:brightness-110"
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default Quiz;
