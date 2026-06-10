"use client"

import { useEffect, useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import { useAppContext } from "../Context/AppContext"
import { BellIcon, XIcon, AlertTriangleIcon, CalendarIcon } from "lucide-react"
import type { InventoryItem, MaintenanceTask, Project } from "../Context/AppContext"

interface Notification {
  id: string
  type: "warning" | "error" | "info" | "success"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export function NotificationSystem() {
  const { state } = useAppContext()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  // Helper functions for date operations
  const isBefore = (date1: Date, date2: Date) => date1.getTime() < date2.getTime()
  const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  // Generate notifications based on app state
  useEffect(() => {
    const newNotifications: Notification[] = []
    const today = new Date()

    // Check for overdue maintenance tasks
    state.maintenance.forEach((task: MaintenanceTask) => {
      const scheduledDate = new Date(task.scheduledDate)
      if (task.status !== "Completed" && isBefore(scheduledDate, today)) {
        newNotifications.push({
          id: `maintenance-overdue-${task.id}`,
          type: "error",
          title: "Overdue Maintenance Task",
          message: `${task.equipment} maintenance was scheduled for ${formatDate(scheduledDate)}`,
          timestamp: new Date(),
          read: false,
          actionUrl: "/maintenance",
        })
      }
    })

    // Check for upcoming maintenance tasks (next 3 days)
    state.maintenance.forEach((task: MaintenanceTask) => {
      const scheduledDate = new Date(task.scheduledDate)
      const threeDaysFromNow = addDays(today, 3)
      if (task.status === "Scheduled" && scheduledDate <= threeDaysFromNow && !isBefore(scheduledDate, today)) {
        newNotifications.push({
          id: `maintenance-upcoming-${task.id}`,
          type: "warning",
          title: "Upcoming Maintenance",
          message: `${task.equipment} maintenance scheduled for ${formatDate(scheduledDate)}`,
          timestamp: new Date(),
          read: false,
          actionUrl: "/maintenance",
        })
      }
    })

    // Check for low stock items
    state.inventory.forEach((item: InventoryItem) => {
      if (item.quantity <= 5) {
        newNotifications.push({
          id: `inventory-low-${item.id}`,
          type: item.quantity === 0 ? "error" : "warning",
          title: item.quantity === 0 ? "Out of Stock" : "Low Stock Alert",
          message: `${item.name}: ${item.quantity} ${item.unit} remaining`,
          timestamp: new Date(),
          read: false,
          actionUrl: "/inventory",
        })
      }
    })

    // Check for project deadlines (next 7 days)
    state.projects.forEach((project: Project) => {
      const deadline = new Date(project.deadline)
      const sevenDaysFromNow = addDays(today, 7)
      if (project.status !== "Completed" && deadline <= sevenDaysFromNow && !isBefore(deadline, today)) {
        newNotifications.push({
          id: `project-deadline-${project.id}`,
          type: "info",
          title: "Project Deadline Approaching",
          message: `${project.name} is due ${formatDate(deadline)}`,
          timestamp: new Date(),
          read: false,
          actionUrl: "/projects",
        })
      }
    })

    // Check for overdue projects
    state.projects.forEach((project: Project) => {
      const deadline = new Date(project.deadline)
      if (project.status !== "Completed" && isBefore(deadline, today)) {
        newNotifications.push({
          id: `project-overdue-${project.id}`,
          type: "error",
          title: "Overdue Project",
          message: `${project.name} was due ${formatDate(deadline)}`,
          timestamp: new Date(),
          read: false,
          actionUrl: "/projects",
        })
      }
    })

    setNotifications(newNotifications)

    // Show toast notifications for critical items
    newNotifications.forEach((notification) => {
      if (notification.type === "error") {
        toast.error(notification.message, {
          duration: 5000,
          position: "top-right",
        })
      } else if (notification.type === "warning") {
        toast(notification.message, {
          duration: 4000,
          position: "top-right",
          icon: "⚠️",
        })
      }
    })
  }, [state.maintenance, state.inventory, state.projects])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangleIcon className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />
      case "info":
        return <CalendarIcon className="h-5 w-5 text-blue-500" />
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case "error":
        return "border-l-red-500"
      case "warning":
        return "border-l-yellow-500"
      case "info":
        return "border-l-blue-500"
      default:
        return "border-l-gray-500"
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <>
      <Toaster />
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
        >
          <BellIcon className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No notifications</p>
                  <p className="text-sm">You're all caught up!</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 ${getNotificationBorderColor(notification.type)} ${
                      notification.read ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${notification.read ? "text-gray-600" : "text-gray-900"}`}>
                          {notification.title}
                        </p>
                        <p className={`text-sm ${notification.read ? "text-gray-500" : "text-gray-700"} mt-1`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">{formatDate(notification.timestamp)}</p>
                      </div>
                      <div className="flex-shrink-0 flex space-x-1">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button onClick={() => setNotifications([])} className="text-sm text-gray-600 hover:text-gray-800">
                  Clear all notifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
