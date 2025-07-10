import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import ReadDiary from "./pages/ReadDiary";
import WriteDiary from './pages/WriteDiary';
import EditDiaryContent from './pages/EditDiaryContent';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import './styles/global.css';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>  
                <Home /> 
              </PrivateRoute>
            } 
          />
          <Route 
            path="/write" 
            element={
              <PrivateRoute>  
                <WriteDiary /> 
              </PrivateRoute>
            } 
          />
          <Route 
            path="/read/:id" 
            element={
              <PrivateRoute>  
                <ReadDiary /> 
              </PrivateRoute>
            } 
          />
          <Route 
            path="/edit/:id" 
            element={
              <PrivateRoute>  
                <EditDiaryContent /> 
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;