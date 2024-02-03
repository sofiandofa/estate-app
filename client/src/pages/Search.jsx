import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'
import ListingItem from "../components/ListingItem"
const Search = () => {
    const navigate=useNavigate()
    const [sidebardata,setSidebardata]=useState({
        searchTerm:"",
        offer:false,
        furnished:false,
        parking:false,
        type:"all",
        order:"desc",
        sort:'createdAt'
    })
    const[listings,setListings]=useState([])
    const[loading,setLoading]=useState(false)
    const[showMore,setShowMore]=useState(false)
    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');
        if(searchTermFromUrl||typeFromUrl||parkingFromUrl||furnishedFromUrl||offerFromUrl||sortFromUrl||orderFromUrl){
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',//createdAt
                order: orderFromUrl || 'desc',
            })
        }
        const fetchListings=async()=>{
            setLoading(true)
            setShowMore(false);
            const searchQuery=urlParams.toString()
            const res=await fetch(`/api/listing/get?${searchQuery}`)
            const data =await res.json()
            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data)
            setLoading(false)
        }
        fetchListings()

    },[location.search])

    const handleChange=(e)=>{
        if(e.target.id==="all"||e.target.id==="rent"||e.target.id==="sale"){
            setSidebardata({...sidebardata,type:e.target.id})
        }
        if(e.target.id==="offer"||e.target.id==='parking'||e.target.id==="furnished"){
            setSidebardata({...sidebardata,[e.target.id]: e.target.checked ||e.target.checked==='true' ? true:false})
        }
        if(e.target.id==="searchTerm"){
            setSidebardata({...sidebardata,searchTerm:e.target.value})
        }
        if(e.target.id==="sort_order"){
            const sort=e.target.value.split('_')[0]||"createdAt"
            const order=e.target.value.split('_')[1]||"desc"
            setSidebardata({...sidebardata,order,sort})
        }
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        
        const urlParams=new URLSearchParams()
        urlParams.set("searchTerm",sidebardata.searchTerm)
        urlParams.set("offer",sidebardata.offer)
        urlParams.set("furnished",sidebardata.furnished)
        urlParams.set("type",sidebardata.type)
        urlParams.set("parking",sidebardata.parking)
        const urlQuery=urlParams.toString()
        navigate(`/search?${urlQuery}`)
    }


    const onShowMoreClick=async()=>{
        const urlParams=new URLSearchParams(location.search)
        const listinglength=listings.length
        urlParams.set("startIndex",listinglength)
        const urlQuery=urlParams.toString()
        const res = await fetch(`/listing/get/${urlQuery}`)
        const data = await res.json()
        if(length.data<9){
            setShowMore(false) 
        }
        setListings({...listings,...data})
    }
    return (
        <div className=" flex flex-col sm:flex-row">
            {/*  */}
            <form onSubmit={handleSubmit} className=" bg-slate-100 flex flex-col  gap-2 h-fit sm:h-screen p-3 shadow-md border border-r-2">
                <div className="flex items-center  gap-1 w-fit border border-slate-300 rounded-md px-2 py-1 hover:bg-slate-200  transition-colors">
                    <label htmlFor="">search:</label>
                    <input type="text" 
                        className="border border-gray-300 rounded-lg py-1 px-1 font-medium text-gray-500 text-sm"  
                        onChange={handleChange}
                        value={sidebardata.searchTerm}
                        placeholder='search...'
                        id="searchTerm"
                    />
                </div>
                <div className="flex items-center  flex-wrap justify-center gap-1 border shadow-sm border-slate-300 rounded-md w-fit px-2 py-1 bg-white sm:w-[300px] ">
                    <span className="flex items-center gap-1 border border-slate-300 rounded-md px-2 py-1 hover:bg-slate-200  transition-colors">
                        <label htmlFor="" className='w-20 whitespace-nowrap'>Rent & Sale</label>
                        <input type="checkbox"  
                            id="all" className="w-4 h-4 flex-1 cursor-pointer" 
                            onChange={handleChange}
                            checked={sidebardata.type === 'all'}
                            />
                    </span>
                    <span className="flex items-center gap-1 border border-slate-300 rounded-md px-2 py-1 hover:bg-slate-200  transition-colors">
                        <label htmlFor="" className=' w-20'>Rent</label>
                        <input type="checkbox"  
                            id="rent" 
                            className="w-4 h-4 flex-1 cursor-pointer" 
                            onChange={handleChange}
                            checked={sidebardata.type === 'rent'}
                            />
                    </span>
                    <span className="flex items-center gap-1 border border-slate-300 rounded-md px-2 py-1 hover:bg-slate-200  transition-colors">
                        <label htmlFor="" className=' w-20'>Sale</label>
                        <input type="checkbox"  
                            id="sale" className="w-4 h-4 flex-1 cursor-pointer" 
                            onChange={handleChange}
                            checked={sidebardata.type === 'sale'}
                            />
                    </span>
                </div>
                <div  className="flex items-center gap-1 w-fit border border-slate-300 rounded-md px-2 py-1 hover:bg-slate-200  transition-colors">
                    <label htmlFor="">Parking</label>
                    <input type="checkbox"  
                        id="parking" className="w-4 h-4 flex-1 cursor-pointer" 
                        onChange={handleChange}
                        checked={sidebardata.parking}
                        />
                </div>
                <div className="flex items-center gap-1 border w-fit border-slate-300 rounded-md px-2 py-1 hover:bg-slate-200  transition-colors">
                    <label htmlFor="">Offer</label>
                    <input type="checkbox"  
                        id="offer" className="w-4 h-4 flex-1 cursor-pointer"
                        checked={sidebardata.offer}
                        onChange={handleChange}
                        />
                </div>
                <div>
                    <select  
                        id="" className="border border-slate-400/50 outline-none p-1 rounded-md"
                        onChange={handleChange}
                        
                        >
                        <option value='createdAt_desc'>latest</option>
                        <option value="createdAt_asc">oldest</option>
                        <option value="regularPrice_desc">price hight to low</option>
                        <option value="regularPrice_asc">price low to hight</option>
                    </select>
                </div>
                <button className=' bg-slate-600 hover:opacity-80 text-white font-medium rounded-md py-1'>
                    search
                </button>
            </form>
            {/*  */}
            <div className='p-8 bg-slate-100/60 flex-1'>
                <h1 className='text-3xl  font-semibold text-slate-700'> Listings:  </h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-slate-700'>No listing found!</p>
                    )}
                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>
                        Loading...
                        </p>
                    )}
                <div className='flex-1 cards-container mt-5'>
                    {!loading &&
                        listings &&
                        listings.map((listing) => <ListingItem key={listing._id} listing={listing} />)
                    }
                </div>
                {showMore && (
                        <button
                        onClick={onShowMoreClick}
                        className='text-green-700 hover:underline p-7 text-center w-full'
                        >
                        Show more
                        </button>
                    )}
            </div>
            </div>
    </div>
    )
}

export default Search