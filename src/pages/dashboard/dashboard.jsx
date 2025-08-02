import './dashboard.css'
import { Sidebar, SidebarBody, SidebarLink } from '../../components/sidebar/sidebar';
import { useState } from 'react';
import { IconBrandTabler, IconUserBolt, IconSettings, IconArrowLeft } from '@tabler/icons-react';
import { motion } from 'framer-motion';

const Dashboard = () => {

  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="sidebar-link-icon" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="sidebar-link-icon" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="sidebar-link-icon" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="sidebar-link-icon" />
      ),
    },
  ];

  return (
    <div className='dashboard-main'>
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody>
          <div className="sidebar-logo">
            {open ? <Logo /> : <LogoIcon />}
          </div>
          <div className="sidebar-links">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
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

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

export default Dashboard;