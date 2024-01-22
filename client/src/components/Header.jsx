import { Link } from "react-router-dom"
import {FaSearch} from "react-icons/fa"
import {useSelector} from "react-redux"
function Header() {
    const{currentUser}=useSelector(state=>state.user)


    return (
        <div className=" bg-slate-200">
                <div className="container mx-auto flex  justify-between items-center h-11" >
                    <Link to="/" className=" font-semibold text-slate-800"> 
                        Soufiyan
                        <span className="text-slate-500">Estate</span> 
                    </Link>
                    <div className=" flex items-center justify-center bg-white rounded-lg p-1">
                        <input type="text" name="" id="" className=" bg-transparent outline-none" placeholder="search" />
                        <Link className="p-1">
                            <FaSearch></FaSearch>
                        </Link>
                    </div>
                    <div className="flex gap-3 font-medium text-gray-600">
                        <Link to="home">Home </Link>
                        <Link to="about" >About </Link>
                        {
                            currentUser
                            ?
                            (<img src={currentUser.avatar} alt="" className="rounded-full h-7 w-7 object-cover" />)
                            :
                            (<Link to="sign-in" >sign in </Link>)
                        }
                    </div>
                </div>   
        </div>
    )
}

export default Header