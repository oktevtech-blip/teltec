"use client"
import {
  HomeIcon,
  FolderIcon,
  PackageIcon,
  UsersIcon,
  FileTextIcon,
  CalendarIcon,
  BarChartIcon,
  FileIcon,
  SettingsIcon,
  // LogOutIcon,
} from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  currentPage?: string
  onNavigate?: (page: string) => void
}

export function Sidebar({ isOpen, currentPage = "dashboard", onNavigate }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, key: "dashboard" },
    { name: "Projects", icon: FolderIcon, key: "projects" },
    { name: "Inventory", icon: PackageIcon, key: "inventory" },
    { name: "Clients", icon: UsersIcon, key: "clients" },
    { name: "Employees", icon: UsersIcon, key: "employees" },
    { name: "Invoices", icon: FileTextIcon, key: "invoices" },
    { name: "Maintenance", icon: CalendarIcon, key: "maintenance" },
    { name: "Reports", icon: BarChartIcon, key: "reports" },
    { name: "Documents", icon: FileIcon, key: "documents" },
    { name: "Settings", icon: SettingsIcon, key: "settings" },
  ]

  const handleNavigation = (key: string) => {
    if (onNavigate) {
      onNavigate(key)
    }
  }

  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 transform bg-blue-800 text-white w-64 transition duration-200 ease-in-out z-20 md:relative md:translate-x-0`}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold">Teltec</h1>
        <p className="text-blue-200 text-sm">Management System</p>
      </div>
      <nav className="px-2 pt-2 pb-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.key)}
              className={`${
                currentPage === item.key ? "bg-blue-700 text-white" : "text-blue-200 hover:bg-blue-700 hover:text-white"
              } group flex items-center px-4 py-2 text-base font-medium rounded-md w-full text-left transition-colors`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  currentPage === item.key ? "text-white" : "text-blue-300 group-hover:text-white"
                }`}
              />
              {item.name}
            </button>
          ))}
        </div>
      </nav>
      {/* <div className="absolute bottom-0 w-full p-4">
        <button className="flex items-center px-4 py-2 text-blue-200 hover:bg-blue-700 hover:text-white rounded-md w-full text-left">
          <LogOutIcon className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div> */}
    </div>
  )
}
