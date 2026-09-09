import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppShell from "@/components/AppShell";
import { apiGet } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type { ParticipantProgress, TrainingModule } from "@/lib/types";

export default function Learning() {
  const user = getSessionUser();

  const modules = useQuery({
    queryKey: ["modules"],
    queryFn: () => apiGet<TrainingModule[]>("/modules"),
  });

  const progress = useQuery({
    queryKey: ["progress", user?.id],
    queryFn: () => apiGet<ParticipantProgress[]>(`/participants/${user!.id}/progress`),
    enabled: Boolean(user && user.role === "participant"),
  });

  const list = modules.isError ? [] : (modules.data ?? []);
  const progressMap = new Map((progress.data ?? []).map((p) => [p.module_id, p]));
  const categories = Array.from(new Set(list.map((m) => m.category)));

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wider font-semibold text-primary font-mono">
          Learning Centre
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mt-1">
          Core Skills for Work training
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Short, practical modules built around Australian workplace expectations. Score 80% or more on
          the quiz to earn your certificate.
        </p>
      </header>

      {list.length === 0 ? (
        <p className="text-muted-foreground" data-testid="modules-empty">
          Modules will appear here once the training catalogue loads.
        </p>
      ) : (
        categories.map((category) => (
          <section key={category} className="mb-10">
            <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
              {category}
            </h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {list
                .filter((m) => m.category === category)
                .map((module) => {
                  const p = progressMap.get(module.id);
                  const done = p?.status === "completed";
                  return (
                    <Card
                      key={module.id}
                      className="hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col"
                      data-testid={`module-card-${module.id}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base leading-snug">{module.title}</CardTitle>
                          {done && (
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" aria-label="Completed" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-1">
                        <p className="text-sm text-muted-foreground flex-1">{module.description}</p>
                        <div className="flex items-center gap-2 mt-4 mb-4">
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {module.estimated_minutes} min
                          </Badge>
                          <Badge variant={done ? "default" : p ? "secondary" : "outline"}>
                            {done ? `Completed · ${p?.quiz_score ?? 0}%` : p ? "In progress" : "Not started"}
                          </Badge>
                        </div>
                        <Link to={`/participant/modules/${module.id}`}>
                          <Button
                            variant={done ? "outline" : "default"}
                            className="w-full"
                            data-testid={`open-module-${module.id}`}
                          >
                            {done ? "Revise module" : p ? "Continue" : "Start module"}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </section>
        ))
      )}
    </AppShell>
  );
}
