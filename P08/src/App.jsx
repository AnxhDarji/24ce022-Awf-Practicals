import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const TaskManager = lazy(() => import('./pages/TaskManager.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<main><p className="status" role="status">Loading page...</p></main>}>
        <Routes>
          <Route path="/" element={<TaskManager />} />
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
