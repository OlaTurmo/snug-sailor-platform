
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Project {
  id: string;
  name: string;
}

interface ProjectSelectProps {
  projects: Project[];
  selectedProject: string | null;
  onProjectChange: (value: string) => void;
}

export const ProjectSelect = ({ 
  projects, 
  selectedProject, 
  onProjectChange 
}: ProjectSelectProps) => {
  return (
    <Select
      value={selectedProject || ""}
      onValueChange={onProjectChange}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Velg prosjekt" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
