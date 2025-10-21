// src/App.js
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './logIn/login';
import Home from './home/home';
import Header from './components/header';
import Footer from './components/footer';

function App() {
  return (
    <>
      <Header />
      <main className="App-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;


// Pantalla inicial comentada, se mantiene por si se desea recuperar
/*
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <header className="App-header">
                <p className="text-5xl font-semibold mb-4">
                  Bienvenido al control de asistencia.
                </p>

                <button
                  className="App-link custom-button"
                  onClick={() => (window.location.href = '/login')}
                >
                  Iniciar Sesión
                </button>
              </header>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
*/