import './dashboard.css'
import { Sidebar, SidebarBody } from '../../components/sidebar/sidebar';
import { useState } from 'react';

const Dashboard = () => {

  const [open, setOpen] = useState(false);

  return (
    <div className='dashboard-main'>
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody>

        </SidebarBody>
      </Sidebar>
      <div className='dashboard-content-wrapper'>
        <div className="dashboard-content">
          <h1>kokocina</h1>
          <h2>kokocina 2</h2>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;