'use client'

import { Loader } from '@/components/Loader';
import ViewHistory from '@/components/ViewHistory'
import { UserContext } from '@/wrappers/UserWrapper';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react'


const page = () => {

   const router = useRouter();
    const context = useContext(UserContext);
    const user = context?.user;
    const loading = context?.loading;
  
  
    useEffect(() => {
      if (loading) return;
      if(!user){
        router.push('/sign-in')
      }
    }, [user, loading, router]);
  
    if (loading) return <Loader />;
  return (
    <div>
        <ViewHistory/>
    </div>
  )
}

export default page
