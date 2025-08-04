import { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/sidebar/sidebar";
import { motion } from "framer-motion";
import './dashboard.css'
import { IconBrandTabler, IconAffiliate, IconSettings, IconCreditCardPay, IconUserCircle } from "@tabler/icons-react";
import { SiTaketwointeractivesoftware } from "react-icons/si";

const Dashboard = () => {

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('dash');

  const links = [
    {
      label: "Dashboard",
      view: "dash",
      icon: (
        <IconBrandTabler className="sidebar-link-icon" />
      )
    },
    {
      label: "Payment",
      view: "pay",
      icon: (
        <IconCreditCardPay className="sidebar-link-icon" />
      )
    },
    {
      label: "Affiliate",
      view: "aff",
      icon: (
        <IconAffiliate className="sidebar-link-icon" />
      )
    }
  ]

  const linksBottom = [
    {
      label: "Profile",
      view: "prof",
      icon: (
        <IconUserCircle className="sidebar-link-icon" />
      )
    },
    {
      label: "Settings",
      view: "settings",
      icon: (
        <IconSettings className="sidebar-link-icon" />
      )
    }
  ]

  return (
    <div className="dashboard-main">
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
            <div className="sidebar-links-divider"></div>
          </div>
          <div className="sidebar-links-wrapper-bottom">
            {linksBottom.map((link, idx) => (
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
      <div className="dashboard-content-wrapper">
        <div className="dashboard-content">

        </div>
      </div>
    </div>
  )
}

export default Dashboard;