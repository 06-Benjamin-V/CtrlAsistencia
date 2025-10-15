import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './logIn/login';
import Header from './components/header';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={
          <div className="App">
            <header className="App-header">
              <p>
                Bienvenido al control de asistencia.
              </p>
              <button className="App-link" onClick={() => window.location.href = '/login'}>
                Iniciar Sesión
              </button>
            </header>
          </div>
        } />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
