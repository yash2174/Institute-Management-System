import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import api from "../../services/api";

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showFullPaper, setShowFullPaper] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      const res = await api.get(`/exams/${id}`);
      setExam(res.data.exam);
      setTimeLeft(res.data.exam.duration * 60);
      setLoading(false);
    };
    fetchExam();
  }, [id]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (questionId, selectedAnswer) => {
    const updated = answers.filter((a) => a.questionId !== questionId);
    updated.push({ questionId, selectedAnswer });
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    await api.post("/exams/submit", {
      examId: exam.id,
      answers,
    });

    navigate("/student/results");
  };

  if (loading) return <Loading />;

  const currentQuestion = exam.questions[currentIndex];

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">{exam.title}</h1>
        <div className="text-red-600 font-bold">
          ⏳ {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>

      <button
        onClick={() => setShowFullPaper(!showFullPaper)}
        className="bg-gray-700 text-white px-3 py-1 mb-4 rounded"
      >
        {showFullPaper ? "Hide Full Paper" : "See Full Question Paper"}
      </button>

      {/* FULL PAPER VIEW */}
      {showFullPaper ? (
        <div className="space-y-6">
          {exam.questions.map((q, index) => (
            <div key={q.id} className="card p-4">
              <p className="font-semibold">
                Q{index + 1}. {q.question_text}
              </p>
              {["A", "B", "C", "D"].map((opt) => (
                <div key={opt}>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    onChange={() => handleAnswer(q.id, opt)}
                  />{" "}
                  {q[`option_${opt.toLowerCase()}`]}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-6">
          <p className="font-semibold mb-3">
            Q{currentIndex + 1}. {currentQuestion.question_text}
          </p>

          {["A", "B", "C", "D"].map((opt) => (
            <div key={opt} className="mb-2">
              <input
                type="radio"
                name={`q-${currentQuestion.id}`}
                onChange={() =>
                  handleAnswer(currentQuestion.id, opt)
                }
              />{" "}
              {currentQuestion[`option_${opt.toLowerCase()}`]}
            </div>
          ))}

          <div className="flex justify-between mt-4">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="bg-gray-400 px-4 py-2 rounded"
            >
              Previous
            </button>

            <button
              disabled={currentIndex === exam.questions.length - 1}
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 mt-6 rounded"
      >
        Submit Exam
      </button>
    </div>
  );
}
