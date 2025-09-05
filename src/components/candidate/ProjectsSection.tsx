import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ImageIcon } from 'lucide-react';
import { Project } from '@/types/candidate';

interface ProjectsSectionProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export function ProjectsSection({ projects, onChange }: ProjectsSectionProps) {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
    };
    onChange([...projects, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    onChange(
      projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  const removeProject = (id: string) => {
    onChange(projects.filter(project => project.id !== id));
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Project</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeProject(project.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Project title"
              value={project.title}
              onChange={(e) => updateProject(project.id, 'title', e.target.value)}
            />
            <Textarea
              placeholder="Project description and technologies used"
              value={project.description}
              onChange={(e) => updateProject(project.id, 'description', e.target.value)}
              rows={3}
            />
            <div className="flex items-center gap-2 p-4 border-2 border-dashed border-border rounded-md">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                Image upload placeholder - Coming soon
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={addProject}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
}