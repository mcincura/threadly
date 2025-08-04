import { useState, useContext, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import './sidebar.css'

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }

    return context;
}

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true
}) => {
    const [openState, setOpenState] = useState(false);

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const Sidebar = ({
    children,
    open,
    setOpen,
    animate
}) => {
    return (
        <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
            {children}
        </SidebarProvider>
    );
};

export const SidebarBody = (props) => {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileSidebar {...props} />
        </>
    )
}

export const DesktopSidebar = ({
    children,
    ...props
}) => {

    const { open, setOpen, animate } = useSidebar();
    return (
        <>
            <motion.div
                className={`sidebar-desktop ${open ? "open" : ""}`}
                animate={{
                    width: animate ? (open ? "200px" : "30px") : "200px",
                }}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                {...props}
            >
                {children}
            </motion.div >
        </>
    );

}

export const MobileSidebar = ({
    className,
    children,
    ...props
}) => {
    const { open, setOpen } = useSidebar();

    return (
        <>
            <div className="sidebar-mobile-trigger" {...props}>
                <div className="sidebar-mobile-menu-icon">
                    <IconMenu2
                        className="icon-toggle"
                        onClick={() => setOpen(!open)}
                    />
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "-100%", opacity: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                            }}
                            className={`sidebar-mobile-overlay ${className || ""}`}
                        >
                            <div
                                className="sidebar-mobile-close"
                                onClick={() => setOpen(!open)}
                            >
                                <IconX />
                            </div>
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};


export const SidebarLink = ({
    link,
    active,
    onClick,
    ...props
}) => {
    const { open, animate } = useSidebar();
    return (
        <div className={`sidebar-link ${active ? 'active' : ''}`}
            onClick={onClick}
            {...props}
        >
            {link.icon}
            <motion.span
                animate={{
                    display: animate ? (open ? "inline-block" : "none") : "inline-block",
                    opacity: animate ? (open ? 1 : 0) : 1
                }}
                className="sidebar-link-text"
            >
                {link.label}
            </motion.span>
        </div>
    )
}