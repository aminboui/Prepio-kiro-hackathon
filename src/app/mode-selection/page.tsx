'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    ArrowRight,
    Sparkles,
    Play,
    BookOpen,
    TrendingUp,
    Award,
    Brain,
    CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function ModeSelectionPage() {
    const router = useRouter();
    const [selectedMode, setSelectedMode] = useState<string>('');

    const handleModeSelect = (mode: string) => {
        setSelectedMode(mode);
    };

    const handleContinue = () => {
        if (selectedMode === 'practice') {
            // Navigate to the dedicated practice mode page
            router.push('/practice');
        } else if (selectedMode === 'interview') {
            // Navigate to interview prep
            router.push('/interview-prep');
        }
    };

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

            <div className="flex items-center justify-center min-h-screen p-6">
                <div className="w-full max-w-5xl space-y-8">
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-3 mb-3">
                            <div className="relative">
                                <Zap className="h-8 w-8 text-primary" />
                                <Sparkles className="h-3 w-3 text-primary absolute -top-1 -right-1 animate-pulse" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
                                Choose Your Learning Path
                            </h1>
                        </div>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Select the mode that best fits your current goals and learning objectives
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Practice Mode */}
                        <Card
                            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${selectedMode === 'practice'
                                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                                : 'border-border hover:border-primary/50 hover:bg-primary/5'
                                }`}
                            onClick={() => handleModeSelect('practice')}
                        >
                            <CardHeader className="text-center pb-4">
                                <div className="flex items-center justify-center mb-3">
                                    <div className="relative">
                                        <Play className="h-12 w-12 text-primary" />
                                        {selectedMode === 'practice' && (
                                            <CheckCircle className="h-5 w-5 text-primary absolute -top-1 -right-1" />
                                        )}
                                    </div>
                                </div>
                                <CardTitle className="text-2xl">Practice Mode</CardTitle>
                                <CardDescription className="text-base">
                                    Quick coding challenges to sharpen your skills
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Code className="h-5 w-5 text-primary flex-shrink-0" />
                                        <span className="text-sm">AI-generated coding challenges</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Zap className="h-5 w-5 text-primary flex-shrink-0" />
                                        <span className="text-sm">Instant feedback and hints</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                                        <span className="text-sm">Track your progress over time</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                                        <span className="text-sm">Multiple languages & difficulty levels</span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-border/50">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">5-30 minutes</span>
                                        </div>
                                        <Badge variant="secondary" className="bg-primary/20 text-primary">
                                            Quick Start
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <h4 className="font-semibold text-sm">Perfect for:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Daily coding practice</li>
                                        <li>• Learning new concepts</li>
                                        <li>• Building confidence</li>
                                        <li>• Quick skill assessment</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Interview Prep Mode */}
                        <Card
                            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${selectedMode === 'interview'
                                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                                : 'border-border hover:border-primary/50 hover:bg-primary/5'
                                }`}
                            onClick={() => handleModeSelect('interview')}
                        >
                            <CardHeader className="text-center pb-4">
                                <div className="flex items-center justify-center mb-3">
                                    <div className="relative">
                                        <Briefcase className="h-12 w-12 text-primary" />
                                        {selectedMode === 'interview' && (
                                            <CheckCircle className="h-5 w-5 text-primary absolute -top-1 -right-1" />
                                        )}
                                    </div>
                                </div>
                                <CardTitle className="text-2xl">Interview Prep Mode</CardTitle>
                                <CardDescription className="text-base">
                                    Complete interview simulation with 4 comprehensive stages
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center space-y-1 p-2 rounded-lg bg-background/50 border border-primary/10">
                                        <Code className="h-5 w-5 text-primary mx-auto" />
                                        <div className="text-xs font-medium">Coding</div>
                                        <div className="text-xs text-muted-foreground">45 min</div>
                                    </div>
                                    <div className="text-center space-y-1 p-2 rounded-lg bg-background/50 border border-blue-500/10">
                                        <MessageSquare className="h-5 w-5 text-blue-500 mx-auto" />
                                        <div className="text-xs font-medium">Technical Q&A</div>
                                        <div className="text-xs text-muted-foreground">30 min</div>
                                    </div>
                                    <div className="text-center space-y-1 p-2 rounded-lg bg-background/50 border border-green-500/10">
                                        <Users className="h-5 w-5 text-green-500 mx-auto" />
                                        <div className="text-xs font-medium">Behavioral</div>
                                        <div className="text-xs text-muted-foreground">20 min</div>
                                    </div>
                                    <div className="text-center space-y-1 p-2 rounded-lg bg-background/50 border border-purple-500/10">
                                        <FileText className="h-5 w-5 text-purple-500 mx-auto" />
                                        <div className="text-xs font-medium">Report</div>
                                        <div className="text-xs text-muted-foreground">Instant</div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-border/50">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">~95 minutes</span>
                                        </div>
                                        <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 to-orange-500/20 text-primary">
                                            Comprehensive
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <h4 className="font-semibold text-sm">Perfect for:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Job interview preparation</li>
                                        <li>• Complete skill evaluation</li>
                                        <li>• FAANG/Big Tech prep</li>
                                        <li>• Professional assessment</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Continue Button */}
                    <div className="text-center space-y-4">
                        <Button
                            size="lg"
                            onClick={handleContinue}
                            disabled={!selectedMode}
                            className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${selectedMode
                                ? "bg-gradient-to-r from-primary to-orange-700 hover:from-primary/90 hover:to-orange-700/90 hover:scale-105"
                                : ""
                                }`}
                        >
                            {selectedMode ? (
                                <>
                                    Continue to {selectedMode === 'practice' ? 'Practice Mode' : 'Interview Prep'}
                                </>
                            ) : (
                                <>
                                    Select a mode to continue
                                </>
                            )}
                        </Button>

                        {selectedMode && (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    {selectedMode === 'practice'
                                        ? 'Start with quick challenges and build your skills incrementally'
                                        : 'Experience a complete technical interview simulation with detailed feedback'
                                    }
                                </p>
                                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                                    <span className="flex items-center space-x-1">
                                        <Brain className="h-3 w-3 text-primary" />
                                        <span>AI-powered</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Award className="h-3 w-3 text-primary" />
                                        <span>Personalized</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <TrendingUp className="h-3 w-3 text-primary" />
                                        <span>Progress tracking</span>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}