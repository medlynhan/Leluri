"use client";
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useGetFollowers } from '../../../lib/client-queries/userfollowers';

export default function FollowersPage(){
  const router = useRouter();
  const [userId,setUserId] = useState<string|undefined>();
  const [page, setPage] = useState(0);
  const limit = 20;
  useEffect(()=>{ (async()=>{ const { data:{ user } } = await supabase.auth.getUser(); if(!user){ router.push('/login'); return;} setUserId(user.id); })(); },[router]);
  const { data: pageData = [], isLoading, isFetching } = useGetFollowers(userId, { page, limit });
  const [all, setAll] = useState<any[]>([]);

  useEffect(()=>{ setAll([]); setPage(0); }, [userId]);

  useEffect(()=>{
    if(!pageData) return;
    setAll(prev => {
      const prevIds = new Set(prev.map((u:any)=>u.id));
      const additions = pageData.filter((u:any)=> !prevIds.has(u.id));
      if (additions.length === 0) return prev; // no change -> no re-render loop
      return [...prev, ...additions];
    });
  }, [pageData]);

  const loadingSkeleton = (
    <ul className="space-y-3 animate-pulse">
      {Array.from({length:5}).map((_,i)=>(
        <li key={i} className="flex items-center gap-3 border border-[var(--medium-grey)] rounded-lg p-3">
          <div className="w-10 h-10 rounded-full bg-[var(--medium-grey)]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 bg-[var(--medium-grey)] rounded" />
            <div className="h-2 w-16 bg-[var(--medium-grey)] rounded" />
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold mb-4">Pengikut</h1>
      {isLoading && loadingSkeleton}
      {!isLoading && all.length === 0 && <p className="text-sm text-[var(--dark-grey)]">Belum ada pengikut.</p>}
      <ul className="space-y-3">
        {all.map(f => (
          <li key={f.id} className="flex items-center gap-3 border border-[var(--medium-grey)] rounded-lg p-3">
            <Image src={f.image_url || '/default-avatar.png'} alt={f.username} width={40} height={40} className="rounded-full object-cover w-10 h-10 bg-white" />
            <div className="flex-1">
              <p className="text-sm font-medium">{f.username}</p>
              <p className="text-xs text-[var(--dark-grey)]">{f.role}</p>
            </div>
            <Link href="/profile" className="text-xs underline">Lihat</Link>
          </li>
        ))}
      </ul>
      {all.length >= (page+1)*limit && (
        <button disabled={isFetching} onClick={()=>setPage(p=>p+1)} className="mt-4 px-4 py-2 border rounded-full text-sm hover:bg-[var(--light-grey)] disabled:opacity-50">{isFetching? 'Loading...' : 'Load more'}</button>
      )}
      <button onClick={()=>router.back()} className="mt-6 text-sm underline">Kembali</button>
    </div>
  );
}
