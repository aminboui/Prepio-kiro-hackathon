'use client';

import {
    Target,
    Code,
    MessageSquare,
    Users,
    FileText,
    Briefcase,
    Brain,
    TrendingUp,
    Clock,
    Award,
    ArrowRight,
    CheckCircle,
  } from "lucide-react"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
  
  // Assuming these components exist in your codebase
  const GridBackground = ({ className }: { className?: string }) => (
    <div className={`absolute inset-0 bg-grid-pattern ${className}`} />
  )
  
  const CodeBackdrop = ({ className, codeSet }: { className?: string; codeSet?: string }) => (
    <div className={`absolute inset-0 bg-code-pattern ${className}`} />
  )
  
  const Orb = ({ className }: { className?: string }) => (
    <div className={`absolute rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 blur-3xl ${className}`} />
  )
  
  const SectionHeading = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) => (
    <div className="text-center mb-16">
      <Badge variant="outline" className="mb-4 text-primary border-primary/20">
        {eyebrow}
      </Badge>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
    </div>
  )
  
  export default function InterviewPrepSection() {
    const stages = [
      {
        number: "01",
        icon: Code,
        title: "Coding Challenge",
        description: "Solve algorithmic problems with real-time code evaluation",
        duration: "45 min",
        color: "gray-300",
      },
      {
        number: "02",
        icon: MessageSquare,
        title: "Technical Q&A",
        description: "Deep-dive technical discussions and system design",
        duration: "30 min",
        color: "gray-300",
      },
      {
        number: "03",
        icon: Users,
        title: "Behavioral Simulation",
        description: "Leadership scenarios and team collaboration assessment",
        duration: "20 min",
        color: "gray-300",
      },
      {
        number: "04",
        icon: FileText,
        title: "Feedback & Report",
        description: "Comprehensive analysis with actionable improvement areas",
        duration: "Instant",
        color: "gray-300",
      },
    ]
  
    const features = [
      {
        icon: Briefcase,
        title: "Company-Specific Prep",
        description:
          "Customize your interview for FAANG, startups, enterprise, or general tech companies with role-specific questions.",
        color: "gray-300",
      },
      {
        icon: Brain,
        title: "AI Interview Simulation",
        description:
          "Experience realistic interview scenarios with AI that adapts to your responses and provides human-like interaction.",
        color: "gray-300",
      },
      {
        icon: TrendingUp,
        title: "Detailed Performance Report",
        description:
          "Get comprehensive feedback on technical skills, communication, problem-solving approach, and areas for improvement.",
        color: "gray-300",
      },
      {
        icon: Clock,
        title: "Real-Time Evaluation",
        description:
          "Receive instant feedback during each stage, helping you understand your performance as you progress through the interview.",
        color: "gray-300",
      },
      {
        icon: Award,
        title: "Experience-Level Matching",
        description:
          "Questions and expectations tailored to entry-level, mid-level, or senior positions to match your career stage.",
        color: "gray-300",
      },
      {
        icon: Code,
        title: "Multi-Language Support",
        description:
          "Practice in your preferred programming language with language-specific best practices and interview patterns.",
        color: "gray-300",
      },
    ]
  
    return (
      <section id="roadmap" className="relative overflow-hidden py-24">
      {/* Blue glow background layer (non-interactive, behind content) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* Top-center glow */}
        <div className="absolute left-1/2 -top-40 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-blue-500/20 blur-[120px]" />
        {/* Bottom-left subtle glow */}
        <div className="absolute bottom-16 -left-16 h-[360px] w-[360px] rounded-full bg-sky-500/15 blur-[90px]" />
        {/* Gentle radial wash to blend glows */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgb(59_130_246/0.08),transparent_60%)] dark:bg-[radial-gradient(60%_40%_at_50%_0%,rgb(59_130_246/0.10),transparent_60%)]" />
      </div>
        <GridBackground className="opacity-80 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
        <CodeBackdrop className="opacity-[0.06] -rotate-1" codeSet="comments" />
        <Orb className="left-[-70px] top-[-50px] h-40 w-40 opacity-25" />
        <Orb className="right-[-60px] bottom-[-60px] h-48 w-48 opacity-25" />
  
        <div className="container relative mx-auto px-4">
          <SectionHeading
            eyebrow="Interview Prep Mode"
            title="Complete Technical Interview Simulation"
            subtitle="We're continuously improving the learning experience with new evaluators and languages."
          />
  
          <div className="mx-auto max-w-7xl space-y-20">
            {/* Enhanced 4-Stage Process with Flow */}
            <div className="relative">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">4-Stage Interview Process</span>
                </div>
                <p className="text-muted-foreground">Complete technical interview simulation with instant feedback</p>
              </div>
  
              {/* Desktop Flow Layout */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* Connection Lines */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-blue-500/20 via-green-500/20 to-purple-500/20 -translate-y-1/2 z-0" />
  
                  <div className="grid grid-cols-4 gap-8 relative z-10">
                    {stages.map((stage, index) => (
                      <div key={stage.number} className="relative">
                        <Card
                          className={`border-${stage.color}/20 bg-gradient-to-br from-${stage.color}/5 to-background hover:from-${stage.color}/10 transition-all duration-300 hover:-translate-y-1`}
                        >
                          <CardContent className="p-6 text-center">
                            <div
                              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-${stage.color}/10 border border-${stage.color}/20 mb-4`}
                            >
                              <stage.icon className={`h-7 w-7 text-${stage.color}`} />
                            </div>
                            <div className={`text-xs font-bold text-${stage.color} mb-2`}>STAGE {stage.number}</div>
                            <h3 className="font-semibold text-lg mb-2">{stage.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{stage.description}</p>
                            <Badge variant="secondary" className="text-xs">
                              {stage.duration}
                            </Badge>
                          </CardContent>
                        </Card>
  
                        {/* Arrow between stages */}
                        {index < stages.length - 1 && (
                          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                            <div
                              className={`w-8 h-8 rounded-full bg-${stage.color}/10 border border-${stage.color}/20 flex items-center justify-center`}
                            >
                              <ArrowRight className={`h-4 w-4 text-${stage.color}`} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
  
              {/* Mobile Stack Layout */}
              <div className="lg:hidden space-y-4">
                {stages.map((stage, index) => (
                  <div key={stage.number} className="relative">
                    <Card className={`border-${stage.color}/20 bg-gradient-to-r from-${stage.color}/5 to-background`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex-shrink-0 w-12 h-12 rounded-xl bg-${stage.color}/10 border border-${stage.color}/20 flex items-center justify-center`}
                          >
                            <stage.icon className={`h-5 w-5 text-${stage.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-bold text-${stage.color}`}>STAGE {stage.number}</span>
                              <Badge variant="secondary" className="text-xs">
                                {stage.duration}
                              </Badge>
                            </div>
                            <h3 className="font-semibold mb-1">{stage.title}</h3>
                            <p className="text-sm text-muted-foreground">{stage.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
  
                    {/* Mobile connector */}
                    {index < stages.length - 1 && (
                      <div className="flex justify-center py-2">
                        <div className="w-0.5 h-6 bg-gradient-to-b from-muted-foreground/20 to-transparent" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
  
            {/* Enhanced Features Grid */}
            <div>
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold mb-4">Why Choose Our Interview Prep?</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Comprehensive features designed to give you the confidence and skills needed to ace your next technical
                  interview.
                </p>
              </div>
  
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="group border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <CardHeader className="pb-4">
                      <div
                        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-${feature.color}/10 border border-${feature.color}/20 group-hover:bg-${feature.color}/15 transition-colors`}
                      >
                        <feature.icon className={`h-7 w-7 text-${feature.color}`} />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                      <div className="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span>Available now</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  