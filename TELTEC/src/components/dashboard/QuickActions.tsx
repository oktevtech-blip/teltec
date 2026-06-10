"use client"
import { PlusIcon, CalendarIcon, PackageIcon, FileTextIcon, UsersIcon } from "lucide-react"

interface QuickActionsProps {
  onAddProject: () => void
  onScheduleMaintenance: () => void
  onAddInventory: () => void
  onCreateInvoice: () => void
  onAddClient: () => void
}

export function QuickActions({
  onAddProject,
  onScheduleMaintenance,
  onAddInventory,
  onCreateInvoice,
  onAddClient,
}: QuickActionsProps) {
  const actions = [
    {
      label: "New Project",
      icon: PlusIcon,
      onClick: onAddProject,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      label: "Schedule Maintenance",
      icon: CalendarIcon,
      onClick: onScheduleMaintenance,
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      label: "Add Inventory",
      icon: PackageIcon,
      onClick: onAddInventory,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      label: "Create Invoice",
      icon: FileTextIcon,
      onClick: onCreateInvoice,
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      label: "Add Client",
      icon: UsersIcon,
      onClick: onAddClient,
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-white p-3 rounded-lg flex flex-col items-center space-y-2 transition-colors`}
          >
            <action.icon className="h-6 w-6" />
            <span className="text-sm font-medium text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
