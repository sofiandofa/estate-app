import './App.css'
import {Route,BrowserRouter,Routes} from "react-router-dom"
import Home from './pages/Home.jsx'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'

import Header from './components/Header.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Profile from './pages/Profile.jsx'

function App() {

  return (
    <BrowserRouter>
        <Header/>
        <Routes>
            <Route path='/'  element={<Home/>} />
            <Route path='/sign-up'  element={<SignUp/>} />
            <Route path='/sign-in'  element={<SignIn/>} />
            <Route element={<PrivateRoute/>} >
              <Route path='/profile' element={<Profile/>} />
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
