import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import DinamycDiary from "./pages/DinamycDiary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page/:title" element={<DinamycDiary />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;