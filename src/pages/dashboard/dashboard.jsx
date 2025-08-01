"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/sidebar/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import "./dashboard.css";

export function SidebarDemo() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="icon" />,
    },
    {
      label: "Subscriptions",
      href: "#",
      icon: <IconUserBolt className="icon" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="icon" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <IconArrowLeft className="icon" />,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="sidebar-demo-container">
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="sidebar-body">
          <div className="sidebar-links-container">
            <Logo />
            <div className="sidebar-links">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "user name",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="avatar"
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

export const Logo = () => {
  return (
    <a href="#" className="logo">
      <div className="logo-icon" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="logo-text"
      >
        Threadly
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a href="#" className="logo">
      <div className="logo-icon" />
    </a>
  );
};

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-content">
        <div className="dashboard-row">
          {[...new Array(4)].map((_, idx) => (
            <div key={"first-" + idx} className="dashboard-card" />
          ))}
        </div>
        <div className="dashboard-row fill">
          {[...new Array(2)].map((_, idx) => (
            <div key={"second-" + idx} className="dashboard-card" />
          ))}
        </div>
      </div>
    </div>
  );
};
