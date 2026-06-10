"use client"
import { MenuIcon, UserIcon, SearchIcon } from "lucide-react"
import { NotificationSystem } from "../../Notifications/NotificationSystem"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <div className="hidden sm:ml-6 sm:flex">
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-1">
                <SearchIcon className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="ml-2 block w-full text-sm border-0 focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationSystem />
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <UserIcon className="h-5 w-5" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">Admin User</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
