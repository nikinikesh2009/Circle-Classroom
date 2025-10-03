"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { Paper, BottomNavigation, BottomNavigationAction, Box } from "@mui/material"
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as AttendanceIcon,
  Assessment as ReportsIcon,
} from "@mui/icons-material"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const menuItems = [
  { text: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
  { text: "Students", icon: PeopleIcon, path: "/dashboard/students" },
  { text: "Attendance", icon: AttendanceIcon, path: "/dashboard/attendance" },
  { text: "Reports", icon: ReportsIcon, path: "/dashboard/reports" },
]

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState(0)

  useEffect(() => {
    const index = menuItems.findIndex((item) => item.path === pathname)
    if (index !== -1) setValue(index)
  }, [pathname])

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    router.push(menuItems[newValue].path)
  }

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: "block", sm: "none" },
        zIndex: 1200,
        borderRadius: "24px 24px 0 0",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
      elevation={8}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, #1976d2 0%, #4caf50 100%)",
        }}
      />

      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          height: 70,
          backgroundColor: "white",
          pt: 1,
          "& .MuiBottomNavigationAction-root": {
            minWidth: "auto",
            padding: "6px 12px 8px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.7rem",
            fontWeight: 500,
            transition: "all 0.3s ease",
            marginTop: "4px",
          },
          "& .Mui-selected": {
            "& .MuiBottomNavigationAction-label": {
              fontSize: "0.75rem",
              fontWeight: 700,
            },
          },
        }}
      >
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = value === index

          return (
            <BottomNavigationAction
              key={item.text}
              label={item.text}
              icon={
                <Box sx={{ position: "relative" }}>
                  {isActive && (
                    <motion.div
                      layoutId="activeBlob"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(76, 175, 80, 0.15) 100%)",
                        zIndex: 0,
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    />
                  )}

                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 17,
                    }}
                    style={{ position: "relative", zIndex: 1 }}
                  >
                    <Icon
                      sx={{
                        fontSize: 26,
                        color: isActive ? "primary.main" : "text.secondary",
                        filter: isActive ? "drop-shadow(0 2px 4px rgba(25, 118, 210, 0.3))" : "none",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </motion.div>
                </Box>
              }
              sx={{
                color: isActive ? "primary.main" : "text.secondary",
              }}
            />
          )
        })}
      </BottomNavigation>
    </Paper>
  )
}
