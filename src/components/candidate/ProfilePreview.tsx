import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, User, Briefcase } from 'lucide-react';
import { CandidateProfile } from '@/types/candidate';

interface ProfilePreviewProps {
  profile: CandidateProfile;
}

export function ProfilePreview({ profile }: ProfilePreviewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">
              {profile.name || 'Your Name'}
            </h3>
            <p className="text-lg text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {profile.role || 'Your Role'}
            </p>
            <p className="text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {profile.email || 'your.email@example.com'}
            </p>
          </div>

          {/* Skills */}
          {profile.skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {profile.bio && (
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">About</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Projects */}
          {profile.projects.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Projects</h4>
              <div className="space-y-3">
                {profile.projects.map((project) => (
                  <Card key={project.id} className="border-border/50">
                    <CardContent className="p-4">
                      <h5 className="font-medium text-foreground mb-1">
                        {project.title || 'Project Title'}
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {project.description || 'Project description will appear here...'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}