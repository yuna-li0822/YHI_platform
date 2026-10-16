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
    <div className="rounded-[40px] border border-rose-200 bg-gradient-to-br from-white via-rose-50 to-pink-50 p-6 shadow-2xl shadow-rose-200/50 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-rose-700">Interactive Quiz</p>
          <h2 className="mt-2 text-2xl font-semibold text-rose-950">Test Your Knowledge</h2>
        </div>
        <div className="rounded-3xl bg-rose-50/80 px-4 py-3 text-sm text-rose-900">Score {submitted ? `${score}/${questions.length}` : '—'}</div>
      </div>
      <div className="mt-6 space-y-5">
        {questions.map((question, index) => (
          <div key={question.question} className="rounded-3xl border border-rose-200 bg-rose-50/80 p-5">
            <p className="text-sm font-semibold text-rose-900">{question.question}</p>
            <div className="mt-4 grid gap-3">
              {question.choices.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [index]: choice }))}
                  className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                    answers[index] === choice
                      ? 'border-rose-400/80 bg-gradient-to-r from-rose-100 to-white text-rose-900'
                      : 'border-rose-200 bg-rose-50/80 text-rose-900 hover:border-rose-400/40 hover:bg-rose-100'
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
        className="mt-6 inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:brightness-110"
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default Quiz;
