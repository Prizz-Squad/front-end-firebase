import { KanbanBoard } from "@/components/board/KanbanBoard"
import KanbanHeader from "@/components/header/kanban-header"
import { ProjectTabs } from "@/components/tabs/project-tabs"

export default function ProjectBoardPage() {
  return (
    <div className="ms-2">
      <KanbanHeader />
      <ProjectTabs />
      <KanbanBoard />
    </div>
  )
}
