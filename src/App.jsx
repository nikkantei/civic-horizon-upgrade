import { useState } from 'react';

export default function App() {
  const [theme, setTheme] = useState([]);
  const [answers, setAnswers] = useState({});
  const [vision, setVision] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const questions = {
    politics: [
      'What values should guide political leadership in 2050?',
      'What should participation look like in a future democracy?',
      'What power should citizens hold?'
    ],
    economy: [
      'What does a fair economy look like in 2050?',
      'How is wealth distributed?',
      'What role does work play in society?'
    ],
    society: [
      'How do communities support each other in 2050?',
      'What inequalities have been solved?',
      'What does social justice look like?'
    ],
    technology: [
      'What technologies are essential in 2050?',
      'How is technology governed?',
      'What is the relationship between AI and society?'
    ],
    law: [
      'What rights are most important in 2050?',
      'How is justice maintained?',
      'What laws protect future generations?'
    ],
    environment: [
      'What does sustainability mean in 2050?',
      'How are natural resources managed?',
      'What environmental challenges have we overcome?'
    ]
  };

  const handleThemeSelect = (t) => {
    setTheme(prev =>
      prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]
    );
  };

  const handleAnswer = (q, a) => {
    setAnswers(prev => ({ ...prev, [q]: a }));
  };

  const generate = async () => {
    const res = await fetch('/api/generateManifesto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    const data = await res.json();
    setVision(data.manifesto || '⚠️ No vision generated.');

    const imagePrompt = `A long-term, hopeful future UK in 2050 based on these visions: ${Object.values(answers).join(', ')}. Minimalist illustration.`;

    const imgRes = await fetch('/api/generateImage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: imagePrompt })
    });

    const imgData = await imgRes.json();
    setImageUrl(imgData.url || '');
  };

  const selectedQuestions = theme.flatMap(t => questions[t]);

  return (
    <div className="app">
      <h1>CivicHorizon: Envision Your Future UK (2050)</h1>

      {theme.length === 0 && (
        <div>
          <p>Select 1–5 themes to begin:</p>
          {Object.keys(questions).map(t => (
            <button key={t} onClick={() => handleThemeSelect(t)}>
              {theme.includes(t) ? `✅ ${t}` : t}
            </button>
          ))}
        </div>
      )}

      {theme.length > 0 && (
        <div>
          {selectedQuestions.map((q, idx) => (
            <div key={idx}>
              <p><strong>{q}</strong></p>
              <textarea
                onChange={(e) => handleAnswer(q, e.target.value)}
                placeholder="Your answer..."
              />
            </div>
          ))}
          <button onClick={generate}>Generate Vision</button>
        </div>
      )}

      {vision && (
        <div>
          <h2>📜 Draft Vision</h2>
          <pre>{vision}</pre>
        </div>
      )}

      {imageUrl && (
        <div>
          <h2>🎨 Future Vision Image</h2>
          <img src={imageUrl} alt="Future vision of UK in 2050" />
        </div>
      )}
    </div>
  );
}
