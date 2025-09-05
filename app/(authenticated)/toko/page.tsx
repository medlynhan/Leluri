'use client'
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import { Star, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    rating: number;
    user: {
        username: string;
        role: string;
        image_url: string;
    };
}

const StarRating = ({ rating }: { rating: number }) => {
    const value = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));
    return (
        <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => {
                const filled = value >= i + 1; 
                return (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--medium-grey)]'}`}
                    />
                );
            })}
            <span className="ml-2 text-sm text-[var(--black)]">{value.toFixed(1)}</span>
        </div>
    );
};

const StorePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const fetchProducts = async (search = '') => {
        setLoading(true);
        let query = supabase
            .from('product')
            .select(`
                *,
                user:users (
                    username,
                    role,
                    image_url
                )
            `)
            .order('created_at', { ascending: false });

        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            setError(error.message);
        } else if (data) {
            setProducts(data as Product[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = () => {
        fetchProducts(searchTerm);
    };

    if (loading) {
        return (
            <div className="p-4">
                <div className="bg-[var(--white)] flex justify-between items-center mb-6 ">
                    <div className="relative w-full max-w-lg">
                        <div className="h-12 bg-[var(--light-grey)] rounded-full animate-pulse" />
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="h-12 w-32 bg-[var(--light-grey)] rounded-full animate-pulse" />
                        <div className="w-6 h-6 bg-[var(--light-grey)] rounded-full animate-pulse" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-[var(--white)] rounded-2xl  overflow-hidden border border-[var(--dark-grey)]">
                            <div className="relative h-72 bg-[var(--light-grey)] animate-pulse" />
                            <div className="p-4 w-64">
                                <div className="h-5 bg-[var(--light-grey)] rounded w-3/4 mb-2 animate-pulse" />
                                <div className="mt-2">
                                    <div className="h-5 bg-[var(--light-grey)] rounded w-1/2 mb-2 animate-pulse" />
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, s) => (
                                            <div key={s} className="w-4 h-4 bg-[var(--light-grey)] rounded animate-pulse" />
                                        ))}
                                        <div className="h-4 w-8 bg-[var(--light-grey)] rounded ml-2 animate-pulse" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-4 pt-4 border-r border-[var(--light-grey)]">
                                    <div className="w-8 h-8 bg-[var(--light-grey)] rounded-full animate-pulse" />
                                    <div className="ml-3 flex-1">
                                        <div className="h-4 bg-[var(--light-grey)] rounded w-24 mb-1 animate-pulse" />
                                        <div className="h-3 bg-[var(--light-grey)] rounded w-16 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="container mx-auto p-4">Error: {error}</div>;
    }

    return (
        
        <div className='flex min-h-screen bg-[var(--white)] overflow-x-hidden '>
            
            
            
            
            
            <div className="relative w-full h-full ">
                
                {/*Navbar*/}
                <div className='flex gap-4 justify-center bg-[var(--white)] w-full z-5 fixed  max-w-screen p-2  h-14'>
                    {/*Sidebar */}
                    <Sidebar />

                    {/*Search Bar */}
                    <div className="flex  justify-center items-center ml-10 lg:ml-64 flex relative flex-1 ">
                        <input
                            type="text"
                            placeholder="Apa yang ingin kamu temukan?"
                            className="w-full pl-12 pr-4 border border-gray-200 shadow-xs  rounded-full h-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--dark-grey)]" />
                    </div>

                    {/*Icon */}
                    <div className="w-30  lg:col-span-1  flex items-center justify-end  gap-6 mr-3">
                        <button onClick={handleSearch} className="bg-[var(--yellow)] text-white  h-full rounded-full flex-1 font-semibold hover:bg-transparent hover:border-[var(--yellow)] border border-transparent font-semibold hover:text-[var(--black)]  transition-colors">Cari</button>
                        <button onClick={() => router.push('/keranjang')} aria-label="Keranjang" className=" h-[80%] rounded-full  transition-colors">
                            <ShoppingCart className="w-6 h-6 hover:text-[var(--yellow)]" />
                        </button>
                    </div>
                    
                </div>



                {/*List of Products */}
                <div className="ml-3 mr-3 lg:ml-68 grid grid-cols-[repeat(auto-fill,minmax(15em,1fr))] p-3 gap-3 lg:gap-6 mt-15">
                    {products.map(product => (
                        <div key={product.id} className="bg-[var(--white)] w-full rounded-2xl overflow-hidden border border-[var(--medium-grey)] cursor-pointer transition-transform duration-300 hover:-translate-y-1" onClick={() => router.push(`/toko/${product.id}`)}>
                            <div className="relative aspect-square ">
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-t-2xl "
                                />
                            </div>
                            <div className="w-full grid p-4 w-64">
                                <h3 className=" w-full text-lg font-semibold truncate">
                                    {product.name}
                                </h3>

                                <div className="my-2 ">
                                    <p className="text-sm font-semibold ">
                                    Rp {product.price.toLocaleString('id-ID')}
                                    </p>
                                    <div className="mt-1">
                                    <StarRating rating={product.rating} />
                                    </div>
                                </div>

                                {/*Information Profile*/}
                                <div className="  flex items-center pt-4 border-t border-[var(--medium-grey)] ">
                                    <Image
                                    src={product.user.image_url || '/placeholder.svg'}
                                    alt={product.user.username}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="ml-3">
                                    <p className="text-xs font-semibold text-[var(--dark-grey)]text-[var(--dark-grey)]">
                                        {product.user.username}
                                    </p>
                                    <p className="text-xs  text-[var(--dark-grey)] capitalize">
                                        {product.user.role}
                                    </p>
                                    </div>
                                </div>


                                
                            </div>
                        </div>
                    ))}
                </div>
                {/* Empty / No Results */}
                {(!products || products.length === 0) && (
                    <div className="ml-3 mr-3 lg:ml-68 p-3 flex flex-col justify-center  items-center mt-10 max-w-[calc(100%-1rem)] mt-10 w-full lg:max-w-[calc(100%-18rem)]">
                    <Image src="/no_result.png" width={300} height={300} alt="NO" />
                    <p className="text-gray-500 text-base">Yah, produk tidak ditemukan</p>
                    </div>
                )}
            </div>
  
        </div>

        
    );
};

export default StorePage;
