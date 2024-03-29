import './App.css'
import {Route,BrowserRouter,Routes} from "react-router-dom"
import Home from './pages/Home.jsx'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'

import Header from './components/Header.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Profile from './pages/Profile.jsx'
import CreateListing from './pages/CreateListing.jsx'
import UpdateListing from './pages/UpdateListing.jsx'
import Listing from './pages/Listing.jsx'
import Search from './pages/Search.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'

function App() {

  return (
    <BrowserRouter>
        <Header/>
        <Routes>
            <Route path='/'  element={<Home/>} />
            <Route path='/sign-up'  element={<SignUp/>} />
            <Route path='/sign-in'  element={<SignIn/>} />
            <Route path='/search'  element={<Search/>} />
            <Route path='/sign-up/verify-email' element={<VerifyEmail/>} />

            <Route element={<PrivateRoute/>} >
                <Route path='/profile' element={<Profile/>} />
                <Route path='/create-listing' element={<CreateListing/>} />
                <Route path='/update-listing/:listingId' element={<UpdateListing/>} />
                <Route path='/listing/:listingId' element={<Listing/>} />

            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
