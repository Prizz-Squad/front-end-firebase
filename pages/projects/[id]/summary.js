import { CardsStats } from "@/components/charts/chart"
import { ProjectTabs } from "@/components/tabs/project-tabs"

export default function ProjectSummaryPage() {
  return (
    <div className="ms-2">
      <ProjectTabs />

      <CardsStats />
    </div>
  )
}
