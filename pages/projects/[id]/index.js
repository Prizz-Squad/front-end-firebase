import { ProjectTabs } from "@/components/tabs/project-tabs";
import { useRouter } from "next/router";

export default function ProjectIdPage() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div>
      <ProjectTabs />
      {id}
    </div>
  );
}
