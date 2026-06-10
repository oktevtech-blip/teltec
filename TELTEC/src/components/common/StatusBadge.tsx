interface StatusBadgeProps {
  status: string
  variant?: "default" | "project" | "maintenance" | "inventory"
  className?: string
}

export function StatusBadge({ status, variant = "default", className = "" }: StatusBadgeProps) {
  const getStatusColor = () => {
    if (variant === "project") {
      switch (status) {
        case "In Progress":
          return "bg-blue-100 text-blue-800"
        case "Pending":
          return "bg-yellow-100 text-yellow-800"
        case "Completed":
          return "bg-green-100 text-green-800"
        case "Delayed":
          return "bg-red-100 text-red-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }

    if (variant === "maintenance") {
      switch (status) {
        case "Scheduled":
          return "bg-blue-100 text-blue-800"
        case "In Progress":
          return "bg-yellow-100 text-yellow-800"
        case "Completed":
          return "bg-green-100 text-green-800"
        case "Overdue":
          return "bg-red-100 text-red-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }

    if (variant === "inventory") {
      switch (status) {
        case "In Stock":
          return "bg-green-100 text-green-800"
        case "Low Stock":
          return "bg-yellow-100 text-yellow-800"
        case "Out of Stock":
          return "bg-red-100 text-red-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    }

    // Default colors
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
      case "success":
        return "bg-green-100 text-green-800"
      case "pending":
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
      case "failed":
      case "overdue":
        return "bg-red-100 text-red-800"
      case "info":
      case "in progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()} ${className}`}
    >
      {status}
    </span>
  )
}
