import { CardsStats } from "@/components/charts/chart"
import KanbanHeader from "@/components/header/kanban-header"
import { ProjectTabs } from "@/components/tabs/project-tabs"

export default function ProjectSummaryPage() {
  return (
    <div className="ms-2">
      <KanbanHeader />
      <ProjectTabs />

      <CardsStats />
    </div>
  )
}
