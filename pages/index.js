import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', scores: Array(10).fill(0) });
  const [isEditing, setIsEditing] = useState(false);

  const criteria = [
    { text: "Is the change above the fold?", score: 1 },
    { text: "Is the change noticeable within 5 seconds?", score: 2 },
    { text: "Is the change adding or removing an element?", score: 2 },
    { text: "Is the change designed to increase user motivation?", score: 1 },
    { text: "Is the change running on high traffic page(s)?", score: 1 },
    { text: "Is the change addressing an issue discovered via user testing?", score: 1 },
    { text: "Is the change addressing an issue discovered via qualitative feedback?", score: 1 },
    { text: "Is the change addressing insights found via digital analytics?", score: 1 },
    { text: "Is the change supported by mouse tracking, heat maps, or eye tracking?", score: 1 },
    { text: "Is the change easy to implement?", scores: [3, 2, 1, 0], options: ["<4 hrs", "Up to 8 hrs", "Under 2 days", "More than 2 days"] }
  ];

  useEffect(() => {
    const savedIdeas = JSON.parse(localStorage.getItem('ideas')) || [];
    setIdeas(savedIdeas);
  }, []);

  useEffect(() => {
    localStorage.setItem('ideas', JSON.stringify(ideas));
  }, [ideas]);

  const calculateScore = (scores) => scores.reduce((sum, num) => sum + num, 0);

  const addOrUpdateIdea = () => {
    if (isEditing) {
      const updatedIdeas = ideas.map((idea) => (idea.id === form.id ? { ...form, total: calculateScore(form.scores) } : idea));
      setIdeas(updatedIdeas.sort((a, b) => b.total - a.total));
      setIsEditing(false);
    } else {
      const newIdea = { ...form, id: Date.now(), total: calculateScore(form.scores) };
      setIdeas([...ideas, newIdea].sort((a, b) => b.total - a.total));
    }
    setForm({ id: null, name: '', scores: Array(10).fill(0) });
  };

  const editIdea = (idea) => {
    setForm(idea);
    setIsEditing(true);
  };

  const deleteIdea = (id) => setIdeas(ideas.filter((idea) => idea.id !== id));

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(ideas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ideas");
    XLSX.writeFile(workbook, "PXL_Scoring_Ideas.xlsx");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">PXL Scoring Tool</h1>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Enter idea"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded w-full mb-3 bg-gray-700 text-white"
        />

        {criteria.map((criterion, index) => (
          <div key={index} className="flex items-center mb-2">
            <label className="mr-2 w-80">{criterion.text}</label>
            {criterion.options ? (
              <select
                value={form.scores[index]}
                onChange={(e) => {
                  const newScores = [...form.scores];
                  newScores[index] = Number(e.target.value);
                  setForm({ ...form, scores: newScores });
                }}
                className="p-2 border rounded bg-gray-700 text-white"
              >
                {criterion.options.map((option, i) => (
                  <option key={i} value={criterion.scores[i]}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type="checkbox"
                checked={form.scores[index] > 0}
                onChange={(e) => {
                  const newScores = [...form.scores];
                  newScores[index] = e.target.checked ? criterion.score : 0;
                  setForm({ ...form, scores: newScores });
                }}
                className="w-5 h-5"
              />
            )}
          </div>
        ))}

        <button onClick={addOrUpdateIdea} className="bg-blue-500 text-white p-2 rounded w-full mt-2">
          {isEditing ? 'Update Idea' : 'Add Idea'}
        </button>

        <button onClick={exportToExcel} className="bg-green-500 text-white p-2 rounded w-full mt-2">Export to Excel</button>
      </div>

      <h2 className="text-2xl font-bold mt-6 text-center">Ranked Ideas</h2>

      <div className="max-w-2xl mx-auto">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-gray-800 p-4 rounded shadow mt-2 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{idea.name}</h3>
              <p>Score: {idea.total}</p>
            </div>
            <div>
              <button onClick={() => editIdea(idea)} className="bg-yellow-500 text-black p-2 rounded mr-2">Edit</button>
              <button onClick={() => deleteIdea(idea.id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}