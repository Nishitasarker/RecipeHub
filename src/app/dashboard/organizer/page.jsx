'use client'
import { useSession } from '@/lib/auth-client';
import React from 'react';
import { Briefcase, Persons,  CircleCheck } from "@gravity-ui/icons";
import StatsDashboard from "../../../components/dashboard/StatsDashboard"

const  OrganizerDashboardPage= () => {

    const{data: session, isPending} = useSession()

    if(isPending){
        return <div>Loading...</div>
    }



    const organizerStats = [
    { title: "Total Job Posts", value: "48", icon:  Briefcase },
    { title: "Total Applicants", value: "1,284", icon: Persons },
    { title: "Active Jobs", value: "18", icon: Persons },
    { title: "Jobs Closed", value: "32", icon: CircleCheck },
  ];


    const user = session?.user;
    console.log("Session data in OrganizerDashboardPage:", session);
    return (
        <div>
            <h2 className='text-2xl font-bold'>Welcome back, {user?.name}</h2>
           <StatsDashboard statsData={organizerStats} />
            
        </div>
    );
};

export default OrganizerDashboardPage;