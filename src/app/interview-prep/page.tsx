"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Zap,
  Clock,
  Code,
  MessageSquare,
  Users,
  FileText,
  Target,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ChevronLeft,
} from "lucide-react"
import Link from "next/link"
import Footer from "@/components/Footer"

export default function InterviewPrepPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedCompanyType, setSelectedCompanyType] = useState<string>("")
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [selectedExperience, setSelectedExperience] = useState<string>("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")

  const companyTypes = [
    { id: "faang", name: "FAANG/Big Tech", description: "Google, Meta, Amazon, Apple, Netflix" },
    { id: "startup", name: "Startup", description: "Fast-paced, innovative companies" },
    { id: "enterprise", name: "Enterprise", description: "Large corporations, banks, consulting" },
    { id: "general", name: "General Tech", description: "Mid-size tech companies" },
  ]

  const roles = [
    { id: "frontend", name: "Frontend Developer", tech: "React, Vue, Angular" },
    { id: "backend", name: "Backend Developer", tech: "Node.js, Python, Java" },
    { id: "fullstack", name: "Full Stack Developer", tech: "Frontend + Backend" },
    { id: "mobile", name: "Mobile Developer", tech: "React Native, Flutter, iOS, Android" },
    { id: "devops", name: "DevOps Engineer", tech: "AWS, Docker, Kubernetes" },
    { id: "data", name: "Data Engineer", tech: "Python, SQL, Spark" },
  ]

  const experienceLevels = [
    { id: "entry", name: "Entry Level", years: "0-2 years", description: "New grad, junior positions" },
    { id: "mid", name: "Mid Level", years: "2-5 years", description: "Experienced developer roles" },
    { id: "senior", name: "Senior Level", years: "5+ years", description: "Senior, lead, principal roles" },
  ]

  const languages = [
    { id: "javascript", name: "JavaScript", description: "ES6+, Node.js, React" },
    { id: "typescript", name: "TypeScript", description: "Typed JavaScript" },
    { id: "python", name: "Python", description: "Django, Flask, FastAPI" },
    { id: "java", name: "Java", description: "Spring, Spring Boot" },
    { id: "csharp", name: "C#", description: ".NET, ASP.NET Core" },
    { id: "cpp", name: "C++", description: "Modern C++, STL" },
    { id: "go", name: "Go", description: "Goroutines, Gin, Echo" },
    { id: "rust", name: "Rust", description: "Memory safety, performance" },
    { id: "php", name: "PHP", description: "Laravel, Symfony" },
    { id: "ruby", name: "Ruby", description: "Ruby on Rails" },
    { id: "htmlcss", name: "HTML/CSS", description: "Tailwind, Bootstrap, Sass" },
    { id: "kotlin", name: "Kotlin", description: "Ktor, Spring, Android development" },
    { id: "swift", name: "Swift", description: "SwiftUI, Vapor, iOS/macOS apps" },
    { id: "dart", name: "Dart", description: "Flutter (cross-platform apps)" },
    { id: "sql", name: "SQL", description: "Databases, PostgreSQL, MySQL" },
  ]

  const steps = [
    {
      title: "Company Type",
      description: "What type of company are you interviewing for?",
      icon: Briefcase,
      options: companyTypes,
      selected: selectedCompanyType,
      setSelected: setSelectedCompanyType,
    },
    {
      title: "Role",
      description: "What position are you applying for?",
      icon: Code,
      options: roles,
      selected: selectedRole,
      setSelected: setSelectedRole,
    },
    {
      title: "Experience Level",
      description: "What's your experience level?",
      icon: Clock,
      options: experienceLevels,
      selected: selectedExperience,
      setSelected: setSelectedExperience,
    },
    {
      title: "Programming Language",
      description: "What's your preferred programming language?",
      icon: Code,
      options: languages,
      selected: selectedLanguage,
      setSelected: setSelectedLanguage,
    },
  ]

  const canStartInterview = selectedCompanyType && selectedRole && selectedExperience && selectedLanguage
  const canContinue = steps[currentStep]?.selected

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const startInterview = () => {
    if (!canStartInterview) return

    const params = new URLSearchParams({
      companyType: selectedCompanyType,
      role: selectedRole,
      experience: selectedExperience,
      language: selectedLanguage,
    })

    router.push(`/interview-prep/session?${params.toString()}`)
  }

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="relative z-0 min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Blue glow background layer (non-interactive, behind content) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* Top-center glow */}
        <div className="absolute left-1/2 -top-40 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-orange-500/10 blur-[180px]" />
        {/* Bottom-left subtle glow */}
        <div className="absolute bottom-16 -left-16 h-[360px] w-[360px] rounded-full bg-orange-900/10 blur-[90px]" />
      </div>

      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      <div className="flex items-start justify-center min-h-screen p-6 pt-20">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="relative">
                <Zap className="h-8 w-8 text-primary" />
                <Sparkles className="h-3 w-3 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-orange-700 to-primary bg-clip-text text-transparent">
                Interview Prep Mode
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete 4-stage AI-powered interview simulation designed to prepare you for real technical interviews
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>~95 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>4 stages</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>AI-powered</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 mb-8">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                      index < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {currentStep < steps.length ? (
            <div className="space-y-6">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 backdrop-blur-sm shadow-xl">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <currentStepData.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
                  </div>
                  <CardDescription className="text-lg">{currentStepData.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentStepData.options.map((option: any) => (
                      <div
                        key={option.id}
                        onClick={() => currentStepData.setSelected(option.id)}
                        className={`p-6 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                          currentStepData.selected === option.id
                            ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{option.name}</h4>
                            {currentStepData.selected === option.id && (
                              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{option.description || option.tech}</p>
                          {option.years && <p className="text-sm font-medium text-primary">{option.years}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation buttons moved outside the card */}
              <div className="flex items-center justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>

                <Button onClick={handleNext} disabled={!canContinue} className="flex items-center space-x-2 px-8">
                  <span>{isLastStep ? "Review Selections" : "Continue"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 backdrop-blur-sm shadow-xl">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-3xl flex items-center justify-center space-x-3 mb-2">
                    <Target className="h-8 w-8 text-primary" />
                    <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                      Ready to Start Your Interview!
                    </span>
                  </CardTitle>
                  <CardDescription className="text-base">
                    Review your selections and begin your comprehensive interview simulation
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  {/* User Selections Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="h-1 w-8 bg-gradient-to-r from-primary to-orange-700 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-foreground">Your Interview Configuration</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="group text-center space-y-3 p-5 rounded-xl bg-background/60 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                        <div className="p-2 rounded-lg bg-primary/10 w-fit mx-auto group-hover:bg-primary/20 transition-colors">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">Company Type</h4>
                          <p className="text-sm text-muted-foreground font-medium">
                            {companyTypes.find((c) => c.id === selectedCompanyType)?.name}
                          </p>
                        </div>
                      </div>

                      <div className="group text-center space-y-3 p-5 rounded-xl bg-background/60 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg">
                        <div className="p-2 rounded-lg bg-blue-500/10 w-fit mx-auto group-hover:bg-blue-500/20 transition-colors">
                          <Code className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">Role</h4>
                          <p className="text-sm text-muted-foreground font-medium">
                            {roles.find((r) => r.id === selectedRole)?.name}
                          </p>
                        </div>
                      </div>

                      <div className="group text-center space-y-3 p-5 rounded-xl bg-background/60 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg">
                        <div className="p-2 rounded-lg bg-green-500/10 w-fit mx-auto group-hover:bg-green-500/20 transition-colors">
                          <Clock className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">Experience</h4>
                          <p className="text-sm text-muted-foreground font-medium">
                            {experienceLevels.find((e) => e.id === selectedExperience)?.name}
                          </p>
                        </div>
                      </div>

                      <div className="group text-center space-y-3 p-5 rounded-xl bg-background/60 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg">
                        <div className="p-2 rounded-lg bg-purple-500/10 w-fit mx-auto group-hover:bg-purple-500/20 transition-colors">
                          <Code className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">Language</h4>
                          <p className="text-sm text-muted-foreground font-medium">
                            {languages.find((l) => l.id === selectedLanguage)?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/50"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Interview Process</span>
                    </div>
                  </div>

                  {/* Interview Process Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="h-1 w-8 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-foreground">4-Stage Interview Process</h3>
                    </div>

                    <p className="text-muted-foreground text-center mb-6">
                      Experience a complete technical interview simulation with instant feedback and detailed analysis
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="group relative text-center space-y-4 p-6 rounded-xl bg-background/60 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          1
                        </div>
                        <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto group-hover:bg-primary/20 transition-colors">
                          <Code className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-base text-foreground">Coding Challenge</h4>
                          <p className="text-sm text-muted-foreground mb-2">Solve real-world problems</p>
                          <Badge variant="secondary" className="text-xs font-medium">
                            45 min
                          </Badge>
                        </div>
                      </div>

                      <div className="group relative text-center space-y-4 p-6 rounded-xl bg-background/60 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg">
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          2
                        </div>
                        <div className="p-3 rounded-lg bg-blue-500/10 w-fit mx-auto group-hover:bg-blue-500/20 transition-colors">
                          <MessageSquare className="h-7 w-7 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-base text-foreground">Technical Q&A</h4>
                          <p className="text-sm text-muted-foreground mb-2">Deep technical discussion</p>
                          <Badge variant="secondary" className="text-xs font-medium">
                            30 min
                          </Badge>
                        </div>
                      </div>

                      <div className="group relative text-center space-y-4 p-6 rounded-xl bg-background/60 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg">
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          3
                        </div>
                        <div className="p-3 rounded-lg bg-green-500/10 w-fit mx-auto group-hover:bg-green-500/20 transition-colors">
                          <Users className="h-7 w-7 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-base text-foreground">Behavioral Simulation</h4>
                          <p className="text-sm text-muted-foreground mb-2">Soft skills assessment</p>
                          <Badge variant="secondary" className="text-xs font-medium">
                            20 min
                          </Badge>
                        </div>
                      </div>

                      <div className="group relative text-center space-y-4 p-6 rounded-xl bg-background/60 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg">
                        <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          4
                        </div>
                        <div className="p-3 rounded-lg bg-purple-500/10 w-fit mx-auto group-hover:bg-purple-500/20 transition-colors">
                          <FileText className="h-7 w-7 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-base text-foreground">Feedback & Report</h4>
                          <p className="text-sm text-muted-foreground mb-2">Detailed performance analysis</p>
                          <Badge variant="secondary" className="text-xs font-medium">
                            Instant
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Final navigation buttons moved outside the card */}
              <div className="flex items-center justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center space-x-2 bg-background/50 hover:bg-background/80 border-border/50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Edit</span>
                </Button>

                <Button
                  size="lg"
                  onClick={startInterview}
                  className="px-8 py-4 font-semibold rounded-xl transition-all duration-300 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-700/90 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Start Interview Simulation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === steps.length && (
            <div className="space-y-2 pb-8">
              <p className="text-sm text-muted-foreground text-center">
                Total time: ~95 minutes • Save your progress anytime
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Instant feedback</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Detailed report</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Progress tracking</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}