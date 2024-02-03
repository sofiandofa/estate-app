import { Link, useNavigate } from "react-router-dom"
import {FaSearch} from "react-icons/fa"
import {useSelector} from "react-redux"
import { useEffect, useState } from "react"
function Header() {
    const{currentUser}=useSelector(state=>state.user)
    const [searchTerm,setSearchTerm]=useState("")
    const navigate=useNavigate()
    
    const submitHandler=(e)=>{
        e.preventDefault();
        const urlParams=new URLSearchParams(window.location.search)
        urlParams.set('searchTerm',searchTerm)
        const searchQuery=urlParams.toString()
        navigate(`search?${searchQuery}`)
    }
    useEffect(()=>{
        const urlParams=new URLSearchParams(location.search)
        const searchTermFromUrl=urlParams.get("searchTerm")
        if(searchTermFromUrl) return setSearchTerm(searchTermFromUrl)
        
    },[location.search])
    return (
        <div className=" bg-slate-200">
                <div className="container mx-auto flex  justify-between items-center h-11" >
                    <Link to="/" className=" font-semibold text-slate-800"> 
                        Soufiyan
                        <span className="text-slate-500">Estate</span> 
                    </Link>
                    <form onSubmit={submitHandler} className=" flex items-center justify-center bg-white rounded-lg p-1">
                        <input type="text" name="" id="" className=" bg-transparent outline-none" placeholder="search" 
                            onChange={(e)=>setSearchTerm(e.target.value)} value={searchTerm} />
                        <button>
                            <FaSearch></FaSearch>
                        </button>
                    </form>
                    <div className="flex gap-3 font-medium text-gray-600">
                        <Link to="home">Home </Link>
                        <Link to="about" >About </Link>
                        {
                            currentUser
                            ?
                            (<Link to={"/profile"}>
                                <img src={currentUser.avatar} alt="" className="rounded-full h-7 w-7 object-cover" />
                            </Link>)
                            :
                            (<Link to="sign-in" >sign in </Link>)
                        }
                    </div>
                </div>   
        </div>
    )
}

export default Header