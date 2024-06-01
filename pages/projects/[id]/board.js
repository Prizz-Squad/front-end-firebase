import { KanbanBoard } from "@/components/board/KanbanBoard"
import { ProjectTabs } from "@/components/tabs/project-tabs"

export default function ProjectBoardPage() {
  return (
    <div className="ms-2">
      <ProjectTabs />
      <KanbanBoard
        cols={[
          {
            id: "DESIGN",
            title: "Design",
          },
          {
            id: "CAPTION",
            title: "Caption",
          },
          {
            id: "SCHEDULE",
            title: "Schedule",
          },
        ]}
      />
    </div>
  )
}
