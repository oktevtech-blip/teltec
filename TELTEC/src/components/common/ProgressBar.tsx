interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  color?: "blue" | "green" | "yellow" | "red" | "purple"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = "blue",
  size = "md",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
  }

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
