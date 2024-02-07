import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

function Home() {
    const[offerListings,setOfferListings]=useState([])
    const[saleListings,setSaleListings]=useState([])
    const[rentListings,setRentListings]=useState([])
    SwiperCore.use([Navigation])
    useEffect(()=>{
        const fetchOfferListings=async()=>{
            const res=await fetch("/api/listing/get?offer=true&limit=4")
            const data=await res.json()
            setOfferListings(data)
            fetchRentListings()
        }
        const fetchRentListings=async()=>{
            const res=await fetch("/api/listing/get?type=rent&limit=4")
            const data=await res.json()
            fetchSaleListings()
            setRentListings(data)
        }
        const fetchSaleListings=async()=>{
            const res=await fetch("/api/listing/get?type=rent&limit=4")
            const data=await res.json()
            setSaleListings(data)
            
        }
        fetchOfferListings()
    },[])
    return (
        <>
        <div className='home-bg'>
      {/* top */}
            <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
                <h1 className='text-slate-800/90 font-bold text-4xl lg:text-6xl'>
                Find your next <span className='text-slate-200'>perfect</span>
                <br />
                place with easy way
                </h1>
                <div className='text-gray-200 text-sm sm:text-sm'>
                Soufiyan Estate is the best place to find your next perfect place to
                live.
                <br />
                We have a wide range of properties for you to choose from.
                </div>
                <Link
                to={'/search'}
                className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
                >
                Let s get started...
                </Link>
            </div>
        </div>
            <Swiper navigation>
                {offerListings &&
                offerListings.length > 0 &&
                offerListings.map((listing) => (
                    <SwiperSlide key={listing._id}>
                    <div
                        style={{
                        background: `url(${listing.imageUrls[0]}) center no-repeat`,
                        backgroundSize: 'cover',
                        }}
                        className='h-[500px]'
                        key={listing._id}
                    ></div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* swiper */}

            {/* listing results for offer, sale and rent */}

            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
                {offerListings && offerListings.length > 0 && (
                <div className=''>
                    <div className='my-3'>
                    <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                    <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                    {offerListings.map((listing) => (
                        <ListingItem listing={listing} key={listing._id} />
                    ))}
                    </div>
                </div>
                )}
                {rentListings && rentListings.length > 0 && (
                <div className=''>
                    <div className='my-3'>
                    <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                    <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                    {rentListings.map((listing) => (
                        <ListingItem listing={listing} key={listing._id} />
                    ))}
                    </div>
                </div>
                )}
                {saleListings && saleListings.length > 0 && (
                <div className=''>
                    <div className='my-3'>
                    <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                    <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                    {saleListings.map((listing) => (
                        <ListingItem listing={listing} key={listing._id} />
                    ))}
                    </div>
                </div>
                )}
            </div>
    </>
    )
}

export default Home