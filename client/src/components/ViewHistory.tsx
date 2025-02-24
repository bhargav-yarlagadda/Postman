'use client'
import React, { useEffect, useState } from 'react'
import { getSavedRequests } from '../../utils'
import RequestViewer from './RequestViewer'
import { Loader } from './Loader';
import Link from 'next/link';
// Define the correct type for a request object
interface RequestData {
    id: string;
    method: string;
    url: string;
    headers: Record<string, string> | null;
    body: string;
    timestamp:string
}

const ViewHistory: React.FC = () => {
    const [requests, setRequests] = useState<RequestData[] | null>(null)

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await getSavedRequests()
                const parsedData: RequestData[] = data.data // Ensure API response matches RequestData[]
                console.log(parsedData, "is the data")
                setRequests(parsedData)
            } catch (error) {
                console.error("Error fetching history:", error)
            }
        }
        fetchRequests()
    }, [])

    return (
        <div className='bg-black flex flex-col items-center gap-3 py-5 min-h-screen'>
            <div className='flex w-[90%] my-5 justify-between '>
            <h1 className='text-white font-bold text-3xl'>History</h1>
                <Link
                className='bg-blue-500 text-center rounded-md hover:bg-blue-700 transition-all ease-in duration-150 hover:text-white flex items-center justify-center px-4'
                href={'/'}
                >Home</Link>
            </div>
            {requests ? (
                requests.map((request) => (
                    <RequestViewer key={request.id} request={request} />
                ))
            ) : (
                <Loader/>
            )}
        </div>
    )
}

export default ViewHistory
