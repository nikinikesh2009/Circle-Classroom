"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as AttendanceIcon,
  Assessment as ReportsIcon,
  Menu as MenuIcon,
  AccountCircle,
  Logout,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "@/lib/auth"
import BottomNav from "./bottom-nav"

const drawerWidth = 260

interface DashboardLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Students", icon: <PeopleIcon />, path: "/dashboard/students" },
  { text: "Attendance", icon: <AttendanceIcon />, path: "/dashboard/attendance" },
  { text: "Reports", icon: <ReportsIcon />, path: "/dashboard/reports" },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  const drawer = (
    <Box>
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1976d2 0%, #4caf50 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: "1.25rem",
          }}
        >
          C
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976d2" }}>
          Circle Classroom
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? "rgba(25, 118, 210, 0.08)" : "transparent",
                  color: isActive ? "primary.main" : "text.primary",
                  "&:hover": {
                    backgroundColor: isActive ? "rgba(25, 118, 210, 0.12)" : "rgba(0, 0, 0, 0.04)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "primary.main" : "text.secondary", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "background.default" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "white",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {menuItems.find((item) => item.path === pathname)?.text || "Dashboard"}
          </Typography>
          <IconButton onClick={handleMenuOpen} size="large">
            <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <Box sx={{ height: { xs: 80, sm: 0 } }} />
      </Box>
      <BottomNav />
    </Box>
  )
}
