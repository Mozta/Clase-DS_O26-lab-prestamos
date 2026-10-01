import './App.css'
import Catalogo from './components/Catalogo'
import { equipos } from './data/equipos'

function App() {
  return (
    <>
      <header>
        <h1>Laboratorio - préstamos</h1>
        <p>Autor: Rafael Pérez Aguirre</p>
      </header>

      <main>
        <Catalogo equipos={equipos} />
      </main>
    </>
  )
}

export default App
