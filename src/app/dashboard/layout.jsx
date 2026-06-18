import React from 'react';
import {DashboardSidebar} from "../../components/dashboard/DashboardSidebar"

const Dashboardlayout = ({children}) => {
    return (
        <div className='flex min-h-screen'>
            <DashboardSidebar></DashboardSidebar>
            <div className='flex-1'>{children}</div>
            
        </div>
    );
};

export default Dashboardlayout;