import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import ReadDiary from "./pages/ReadDiary";
import WriteDiary from './pages/WriteDiary';
import EditDiary from './pages/EditDiary';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/write" element={<WriteDiary />} />
        <Route path="/read/:id" element={<ReadDiary />} />
        <Route path="/edit/:id" element={<EditDiary />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;