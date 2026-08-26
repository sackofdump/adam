"use client";

import { useState } from "react";
import Link from "next/link";

interface Step {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface Workflow {
  id: string;
  title: string;
  description: string | null;
  steps: Step[];
}

interface GuidedWorkflowProps {
  workflow: Workflow;
}

export function GuidedWorkflow({ workflow }: GuidedWorkflowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = workflow.steps;
  const totalSteps = steps.length;
  const currentStep = steps[currentIndex];
  const progress = ((currentIndex + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentIndex < totalSteps - 1) {
      setCurrentIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (completed) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Workflow complete!
        </h2>
        <p className="text-gray-500 text-lg mb-8">
          You&apos;ve finished all {totalSteps} steps of &ldquo;
          {workflow.title}&rdquo;.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setCompleted(false);
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Review again
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard" className="hover:text-gray-700">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{workflow.title}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{workflow.title}</h1>
        {workflow.description && (
          <p className="text-gray-500 mt-1">{workflow.description}</p>
        )}
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">
            Step {currentIndex + 1} of {totalSteps}
          </span>
          <span className="text-gray-400">{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
                index === currentIndex
                  ? "bg-orange-600 text-white"
                  : index < currentIndex
                  ? "bg-orange-200 text-orange-700 hover:bg-orange-300"
                  : "bg-gray-200 text-gray-500 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current step */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
            {currentIndex + 1}
          </span>
          <h2 className="text-xl font-semibold text-gray-900">
            {currentStep.title}
          </h2>
        </div>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
            {currentStep.content}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
        >
          {currentIndex === totalSteps - 1 ? "Complete workflow" : "Next step →"}
        </button>
      </div>
    </div>
  );
}
