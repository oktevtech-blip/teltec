import { ProjectsCard } from "./ProjectsCard"
import { InventoryCard } from "./InventoryCard"
import { MaintenanceCard } from "./MaintenanceCard"
import { QuickActions } from "./QuickActions"
import { FolderIcon, PackageIcon, CalendarIcon, TrendingUpIcon } from "lucide-react"
import { useAppContext } from "../../Context/AppContext"
import { useNavigate } from "react-router-dom"

export function DashboardOverview() {
  const { state } = useAppContext()
  const navigate = useNavigate()

  // Calculate metrics
  const activeProjects = state.projects.filter((p) => p.status !== "Completed").length
  const totalInventoryItems = state.inventory.reduce((sum, item) => sum + item.quantity, 0)
  const pendingMaintenance = state.maintenance.filter((m) => m.status !== "Completed").length
  const completionRate =
    Math.round((state.projects.filter((p) => p.status === "Completed").length / state.projects.length) * 100) || 0

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "add-project":
        navigate("/projects")
        break
      case "schedule-maintenance":
        navigate("/maintenance")
        break
      case "add-inventory":
        navigate("/inventory")
        break
      case "create-invoice":
        navigate("/invoices")
        break
      case "add-client":
        navigate("/clients")
        break
      default:
        console.log(`Unknown action: ${action}`)
    }
  }

  return (
    <div>
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin. Here's what's happening today.</p>
      </div> */}

      {/* Quick Actions */}
      <div className="mb-6">
        <QuickActions
          onAddProject={() => handleQuickAction("add-project")}
          onScheduleMaintenance={() => handleQuickAction("schedule-maintenance")}
          onAddInventory={() => handleQuickAction("add-inventory")}
          onCreateInvoice={() => handleQuickAction("create-invoice")}
          onAddClient={() => handleQuickAction("add-client")}
        />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
              <FolderIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Active Projects</h2>
              <p className="text-2xl font-semibold text-gray-900">{activeProjects}</p>
              <p className="text-xs text-blue-600">+2 this week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
              <PackageIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Inventory Items</h2>
              <p className="text-2xl font-semibold text-gray-900">{totalInventoryItems}</p>
              <p className="text-xs text-green-600">Well stocked</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
              <CalendarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Pending Maintenance</h2>
              <p className="text-2xl font-semibold text-gray-900">{pendingMaintenance}</p>
              <p className="text-xs text-yellow-600">Needs attention</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-purple-100">
              <TrendingUpIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Completion Rate</h2>
              <p className="text-2xl font-semibold text-gray-900">{completionRate}%</p>
              <p className="text-xs text-purple-600">+5% this month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ProjectsCard />
        <InventoryCard />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <MaintenanceCard />
      </div>
    </div>
  )
}
