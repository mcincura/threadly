import './dashboard.css'
import { Sidebar, SidebarBody, SidebarLink } from '../../components/sidebar/sidebar';
import { useState } from 'react';
import { IconBrandTabler, IconUserBolt, IconSettings, IconArrowLeft } from '@tabler/icons-react';
import { motion } from 'framer-motion';

const Dashboard = () => {

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('dash')

  const links = [
    {
      label: "Dashboard",
      view: "dash",  // Changed from href to view
      icon: (
        <IconBrandTabler className="sidebar-link-icon" />
      ),
    },
    {
      label: "Profile",
      view: "profile",
      icon: (
        <IconUserBolt className="sidebar-link-icon" />
      ),
    },
    {
      label: "Settings",
      view: "settings",
      icon: (
        <IconSettings className="sidebar-link-icon" />
      ),
    },
    {
      label: "Logout",
      view: "logout",
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
              <SidebarLink
                key={idx}
                link={link}
                active={active === link.view}
                onClick={() => setActive(link.view)}
              />
            ))}
          </div>
        </SidebarBody>
      </Sidebar>
      <div className='dashboard-content-wrapper'>
        <div className="dashboard-content">
          <h1>kokocina</h1>
          <h2>kokocina 2</h2>
          <div className="div">

          </div>
        </div>
      </div>
    </div>
  )
}

export const Logo = () => {
  return (
    <a href="#" class="custom-link-big">
      <div class="custom-link-big-icon"></div>
      <motion.span
        class="custom-link-big-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Threadly
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="custom-link"
    >
      <div />
    </a>
  );
};

export default Dashboard;