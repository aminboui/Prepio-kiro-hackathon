"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Code, Zap, Target, ArrowLeft } from "lucide-react"
import type { ChallengeRequest } from "@/lib/ai"
import NavBar from "./NavBar"
import Footer from "./Footer"

interface ChallengeSetupProps {
  onStartChallenge: (request: ChallengeRequest) => void
  isLoading: boolean
  onBack?: () => void
}

const languages = ["JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Kotlin", "Swift", "Dart"]

const skillLevels = [
  { value: "beginner", label: "Beginner", description: "Basic syntax and concepts" },
  { value: "intermediate", label: "Intermediate", description: "Data structures and algorithms" },
  { value: "advanced", label: "Advanced", description: "Complex problems and optimization" },
] as const

const challengeTypes = [
  {
    value: "bug-fix",
    label: "Bug Fix",
    description: "Find and fix bugs in existing code",
    icon: Target,
  },
  {
    value: "code-completion",
    label: "Code Completion",
    description: "Complete incomplete code snippets",
    icon: Code,
  },
] as const

export default function ChallengeSetup({ onStartChallenge, isLoading, onBack }: ChallengeSetupProps) {
  const [language, setLanguage] = useState<string>("")
  const [skillLevel, setSkillLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [challengeType, setChallengeType] = useState<"bug-fix" | "code-completion">("bug-fix")

  const handleStartChallenge = () => {
    if (!language) return

    onStartChallenge({
      language,
      skillLevel,
      challengeType,
    })
  }

  return (
    <div className="relative z-0 min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Blue glow background layer (non-interactive, behind content) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* Top-center glow */}
        <div className="absolute left-1/2 -top-40 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-orange-500/10 blur-[180px]" />
        {/* Bottom-left subtle glow */}
        <div className="absolute bottom-16 -left-16 h-[360px] w-[360px] rounded-full bg-orange-900/10 blur-[90px]" />
      </div>

      <NavBar onGetStarted={onBack} showGetStarted={!!onBack} />

      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            )}

            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Zap className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Prepio</h1>
              </div>
              <p className="text-muted-foreground text-lg">AI-powered coding challenges tailored to your skill level</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Setup Your Challenge</CardTitle>
                <CardDescription>Choose your preferences to get a personalized coding challenge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Programming Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a programming language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Skill Level</label>
                  <div className="grid grid-cols-1 gap-3">
                    {skillLevels.map((level) => (
                      <Card
                        key={level.value}
                        className={`cursor-pointer transition-colors ${
                          skillLevel === level.value ? "border-primary bg-primary/5" : "hover:border-primary/50"
                        }`}
                        onClick={() => setSkillLevel(level.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">{level.label}</h3>
                                {skillLevel === level.value && <Badge variant="default">Selected</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">{level.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Challenge Type</label>
                  <div className="grid grid-cols-1 gap-3">
                    {challengeTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <Card
                          key={type.value}
                          className={`cursor-pointer transition-colors ${
                            challengeType === type.value ? "border-primary bg-primary/5" : "hover:border-primary/50"
                          }`}
                          onClick={() => setChallengeType(type.value)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Icon className="h-5 w-5 text-primary" />
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h3 className="font-medium">{type.label}</h3>
                                    {challengeType === type.value && <Badge variant="default">Selected</Badge>}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{type.description}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                <Button onClick={handleStartChallenge} disabled={!language || isLoading} className="w-full" size="lg">
                  {isLoading ? "Generating Challenge..." : "Start Challenge"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
