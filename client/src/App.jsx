import './App.css'
import {Route,BrowserRouter,Routes} from "react-router-dom"
import Home from './pages/Home.jsx'
import SignUp from './pages/SignUp.jsx'
import Header from './components/Header.jsx'

function App() {

  return (
    <BrowserRouter>
        <Header/>
        <Routes>
            <Route path='/'  element={<Home/>} />
            <Route path='/sign-Up'  element={<SignUp/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
