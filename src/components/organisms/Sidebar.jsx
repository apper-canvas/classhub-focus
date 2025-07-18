import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/students", label: "Students", icon: "Users" },
    { path: "/classes", label: "Classes", icon: "BookOpen" },
    { path: "/grades", label: "Grades", icon: "FileText" },
    { path: "/attendance", label: "Attendance", icon: "Calendar" },
  ];

  const SidebarContent = () => (
    <div className="sidebar-gradient h-full flex flex-col">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white">ClassHub</h1>
            <p className="text-sm text-white/70">Student Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10",
                    isActive && "bg-white/20 text-white shadow-lg"
                  )
                }
                onClick={() => onClose && onClose()}
              >
                <ApperIcon name={item.icon} className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 border-t border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Teacher</p>
            <p className="text-xs text-white/70">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-30">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {isOpen && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="relative w-64 h-full bg-white"
            >
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;