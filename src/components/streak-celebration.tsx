"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Flame, Sparkles } from "lucide-react"

interface StreakCelebrationProps {
  streakCount: number
  onStreakMilestone?: (milestone: number) => void
}

const streakMilestones = [3, 7, 14, 30, 60, 100]

const getStreakMessage = (streak: number) => {
  if (streak === 1) return "Great start! You've begun your journey."
  if (streak === 3) return "Amazing! You're building a healthy habit."
  if (streak === 7) return "Fantastic! One week of consistent self-care."
  if (streak === 14) return "Incredible! Two weeks of dedication."
  if (streak === 30) return "Outstanding! A full month of mental health care."
  if (streak === 60) return "Phenomenal! Two months of consistency."
  if (streak === 100) return "Legendary! 100 days of self-care mastery."

  if (streak < 7) return "Keep it up! You're doing great."
  if (streak < 30) return "Excellent consistency! You're on fire."
  if (streak < 100) return "Incredible dedication! You're a mental health champion."
  return "You're a true mental health warrior! Keep going!"
}

const getStreakColor = (streak: number) => {
  if (streak < 3) return "text-orange-500"
  if (streak < 7) return "text-orange-600"
  if (streak < 30) return "text-red-500"
  if (streak < 100) return "text-purple-500"
  return "text-blue-500"
}

const getStreakEmoji = (streak: number) => {
  if (streak < 3) return "🔥"
  if (streak < 7) return "🚀"
  if (streak < 30) return "⭐"
  if (streak < 100) return "🏆"
  return "👑"
}

export function StreakCelebration({ streakCount, onStreakMilestone }: StreakCelebrationProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebratedStreak, setCelebratedStreak] = useState(0)
  const [previousStreak, setPreviousStreak] = useState(0)

  useEffect(() => {
    // Check if we hit a new milestone
    const newMilestone = streakMilestones.find((milestone) => streakCount >= milestone && previousStreak < milestone)

    if (newMilestone && streakCount > previousStreak) {
      setCelebratedStreak(streakCount)
      setShowCelebration(true)
      onStreakMilestone?.(newMilestone)
    }

    setPreviousStreak(streakCount)
  }, [streakCount, previousStreak, onStreakMilestone])

  const nextMilestone = streakMilestones.find((milestone) => milestone > streakCount)
  const progressToNext = nextMilestone ? (streakCount / nextMilestone) * 100 : 100

  return (
    <>
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <Flame className={`h-8 w-8 text-white ${streakCount > 0 ? "animate-pulse" : ""}`} />
                </div>
                {streakCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-orange-400">
                    <span className="text-xs font-bold text-orange-600">{streakCount}</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-800">
                  {streakCount === 0 ? "Start Your Streak!" : `${streakCount} Day Streak!`}
                </h3>
                <p className="text-orange-600">{getStreakMessage(streakCount)}</p>
                {nextMilestone && (
                  <p className="text-sm text-orange-500 mt-1">
                    {nextMilestone - streakCount} days until your next milestone
                  </p>
                )}
              </div>
            </div>
            <div className="text-4xl">{getStreakEmoji(streakCount)}</div>
          </div>

          {nextMilestone && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-orange-600 mb-1">
                <span>Progress to {nextMilestone} days</span>
                <span>{Math.round(progressToNext)}%</span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Streak Milestone Celebration */}
      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-pulse">
              <Flame className="h-10 w-10 text-white" />
            </div>
            <DialogTitle className="text-3xl">Streak Milestone!</DialogTitle>
            <DialogDescription className="text-lg space-y-2">
              <div className="text-2xl font-bold text-orange-600">{celebratedStreak} Days Strong!</div>
              <div>{getStreakMessage(celebratedStreak)}</div>
              <div className="flex items-center justify-center space-x-2 text-orange-500 mt-4">
                <Sparkles className="h-5 w-5" />
                <span>You're building incredible mental health habits!</span>
                <Sparkles className="h-5 w-5" />
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <Button
              onClick={() => setShowCelebration(false)}
              className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600"
            >
              Keep Going! 🔥
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
