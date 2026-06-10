"use client"

import { useState } from "react"
import { DashboardLayout } from "../components/layout/DashboardLayout"
import { DashboardOverview } from "../components/dashboard/DashboardOverview"
import { Projects } from "./Projects"
import { Inventory } from "./Inventory"
import { Maintenance } from "./Maintenance"
import { Reports } from "./Reports"
import { Clients } from "./Clients"
import { Employees } from "./Employees"
import { Invoices } from "./Invoices.tsx"
import { Documents } from "./Documents"
import { AdminSettingsPage } from "./Settings"

export function MainDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardOverview />
      case "projects":
        return <Projects />
      case "inventory":
        return <Inventory />
      case "maintenance":
        return <Maintenance />
      case "reports":
        return <Reports />
      case "clients":
        return <Clients />
      case "employees":
        return <Employees />
      case "invoices":
        return <Invoices />
      case "documents":
        return <Documents />
      case "settings":
        return <AdminSettingsPage />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <DashboardLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}
    </DashboardLayout>
  )
}
