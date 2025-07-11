import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { useAuth } from '../context/AuthContext';
import DynamicTitle from '../components/DynamicTitle';

function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const isValid = await invoke('verify_password', { input: password });
      if (isValid) {
        login();
        navigate("/");
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred while trying to log in. Please try again later.');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <DynamicTitle title={"Login"} />
      <h1 className="text-3xl font-bold mb-6">
        Masukkan Password
      </h1>
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 rounded p-2 mb-3 w-[300px]"
      />
      { error && <p className="text-red-500 mb-2">{error}</p>}
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleLogin}>
        Masuk
      </button>
    </main>
  );
}

export default Login;