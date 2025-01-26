import { DashboardHeader } from '../../components/header'
import { DashboardMetrics } from '../../components/metrics'
import { ModelsTable } from '../../components/models-table'

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#0A0B1A]">
      <main className="flex-1 overflow-auto">
        <DashboardHeader />
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-white mb-6">Models Dashboard</h1>
          <DashboardMetrics />
          <ModelsTable />
        </div>
      </main>
    </div>
  )
}

