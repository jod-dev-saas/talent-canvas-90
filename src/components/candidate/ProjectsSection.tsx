import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Project } from '@/types/candidate';

interface ProjectsSectionProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export function ProjectsSection({ projects, onChange }: ProjectsSectionProps) {
  const addProject = () => {
    const newProject: Project & { url?: string } = {
      id: Date.now().toString(),
      title: '',
      description: '',
      url: '',
    };
    onChange([...projects, newProject as Project]);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    onChange(
      projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  const updateProjectUrl = (id: string, value: string) => {
    onChange(
      projects.map(project =>
        project.id === id ? { ...(project as any), url: value } : project
      )
    );
  };

  const removeProject = (id: string) => {
    onChange(projects.filter(project => project.id !== id));
  };

  // Validator: require https://, no spaces, reasonable length
  const isValidProjectUrl = (url: string) => {
    if (!url) return true; // empty is allowed (optional)
    if (url.length > 2000) return false;
    // must start with https:// and be a valid-ish URL (no spaces)
    const httpsUrlRegex = /^https:\/\/[^\s/$.?#].[^\s]*$/i;
    return httpsUrlRegex.test(url);
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => {
        const urlValue = (project as any).url || '';
        const urlValid = isValidProjectUrl(urlValue);

        return (
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

              {/* NEW: URL input */}
              <div>
                <Input
                  placeholder="Project URL (https://example.com or repo URL)"
                  value={urlValue}
                  onChange={(e) => updateProjectUrl(project.id, e.target.value)}
                />
                {!urlValid && (
                  <p className="mt-1 text-sm text-destructive">
                    Please enter a valid URL that starts with <code>https://</code> and contains no spaces. Max length 2000 chars.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

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
