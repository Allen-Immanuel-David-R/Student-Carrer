import { useEffect, useState } from 'react';

function Header() {
  return <h1 className="header">Student Management System</h1>;
}

function StudentProfile({ name, department, year, practiceCount, onComplete, onReset }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `Practice Sessions: ${practiceCount}`;

    return () => {
      document.title = previousTitle;
    };
  }, [practiceCount]);

  return (
    <article className="student-profile">
      <p>
        <strong>Name:</strong> {name}
      </p>
      <p>
        <strong>Department:</strong> {department}
      </p>
      <p>
        <strong>Year:</strong> {year}
      </p>
      <p className="practice-count">
        <strong>Practice Sessions:</strong> {practiceCount}
      </p>
      <div className="profile-actions">
        <button type="button" onClick={onComplete}>
          Complete Practice
        </button>
        <button type="button" onClick={onReset}>
          Reset
        </button>
      </div>
    </article>
  );
}

function Footer() {
  return <footer>© 2026 Student Management System</footer>;
}

export default function App() {
  const [practiceCount, setPracticeCount] = useState(0);
  const [showProfile, setShowProfile] = useState(true);

  return (
    <div className="app">
      <Header />

      <main>
        <section>
          <h2>Student Practice Tracker</h2>
          <button
            className="toggle-button"
            type="button"
            onClick={() => setShowProfile((isVisible) => !isVisible)}
          >
            {showProfile ? 'Hide Profile' : 'Show Profile'}
          </button>
          {showProfile && (
            <StudentProfile
              name="Anu"
              department="CSE"
              year="3rd Year"
              practiceCount={practiceCount}
              onComplete={() => setPracticeCount((count) => count + 1)}
              onReset={() => setPracticeCount(0)}
            />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
