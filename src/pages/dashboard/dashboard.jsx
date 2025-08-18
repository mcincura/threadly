import { useEffect, useState, useRef } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar/sidebar";
import { motion } from "framer-motion";
import { IconAffiliate, IconBrandTabler, IconCreditCardPay, IconArrowLeftToArc, IconUserCircle } from "@tabler/icons-react";
import axios from "axios";

import Dash from "../../components/dashboard/dash/dash";
import Affiliate from "../../components/dashboard/affiliate/affiliate";
import Payment from "../../components/dashboard/payment/payment";
import Profile from "../../components/dashboard/profile/profile";

import Login from "../../components/login/login";
import { useContext } from "react";
import { UserContext } from "../../app/context/userContext";

import './dashboard.css'
import './sidebarDashboard.css'

const Dashboard = () => {

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('dash');
  const [isMobile, setIsMobile] = useState(false);
  const prevActiveRef = useRef(active);
  const { loggedIn } = useContext(UserContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (prevActiveRef.current !== active && isMobile) {
      setOpen(false);
    }
    prevActiveRef.current = active;
  }, [active, isMobile]);

  //_______HELPER: MOBILE DEVICE DETECTION
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/auth/logout", {}, { withCredentials: true });
      window.location.href = "/";
    } catch (error) {
      window.location.href = "/";
    }
  };

  const links = [
    {
      label: 'Dashboard',
      view: 'dash',
      icon:
        <IconBrandTabler className="sidebar-link-icon" />
    },
    {
      label: 'Payment',
      view: 'pay',
      icon:
        <IconCreditCardPay className="sidebar-link-icon" />
    },
    {
      label: 'Affiliate',
      view: 'aff',
      icon:
        <IconAffiliate className="sidebar-link-icon" />
    }
  ]

  const linksBottom = [
    {
      label: 'Profile',
      view: 'prof',
      icon:
        <IconUserCircle className="sidebar-link-icon" />
    },
    {
      label: 'Sign Out',
      view: 'logout',
      icon:
        <IconArrowLeftToArc className="sidebar-link-icon" />
    }
  ]

  return (
    <div className="dashboard-main">
      {!loggedIn && <Login />}
      {/* DASHBOARD SIDEBAR */}
      <div className="dashboard-sidebar-wrapper">
        <Sidebar open={open} setOpen={setOpen} animate={true}>
          <SidebarBody>
            <div className="sidebar-logo-wrapper">
              {open ? (
                <div className="sidebar-logo-big">
                  <img src="./assets/images/logo.png" />
                  <motion.span
                    className="sidebar-logo-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Threadly
                  </motion.span>
                </div>
              ) : (
                <div className="sidebar-logo-icon">
                  <img src="./assets/images/logo.png" />
                </div>
              )}
            </div>
            <div className="sidebar-links-wrapper">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  active={active === link.view}
                  onClick={() => setActive(link.view)}
                />
              ))}
            </div>
            <div className="sidebar-links-divider-wrapper">
              <div className="sidebar-links-divider">
              </div>
            </div>
            <div className="sidebar-link-bottom-wrapper">
              {linksBottom.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  active={active === link.view}
                  onClick={
                    link.view === "logout"
                      ? handleLogout
                      : () => setActive(link.view)
                  }
                />
              ))}
            </div>
          </SidebarBody>
        </Sidebar>
      </div>

      {/* DASHBOARD CONTENT */}
      <div className="dashboard-content-wrapper">
        <motion.div className={`dashboard-content`}
          animate={{
            marginLeft: !isMobile ? (open ? '224px' : '54px') : ''
          }}
        >
          {active === 'dash' && (
            <div className={`dashboard-content-dash-wrapper ${open && isMobile ? 'blur' : ''}`}>
              <Dash setActive={setActive} open={open} user={user} loggedIn={loggedIn} />
            </div>
          )}
          {active === 'aff' && (
            <div className={`dashboard-content-affiliate-wrapper ${open && isMobile ? 'blur' : ''} `}>
              <Affiliate user={user} loggedIn={loggedIn} />
            </div>
          )}
          {active === 'pay' && (
            <div className={`dashboard-content-payment-wrapper ${open && isMobile ? 'blur' : ''} `}>
              <Payment />
            </div>
          )}
          {active === 'prof' && (
            <div className={`dashboard-content-profile-wrapper ${open && isMobile ? 'blur' : ''} `}>
              <Profile />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard;