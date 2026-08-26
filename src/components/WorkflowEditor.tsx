"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StepData {
  id?: string;
  title: string;
  content: string;
}

interface WorkflowEditorProps {
  initialTitle?: string;
  initialDescription?: string;
  initialSteps?: StepData[];
  workflowId?: string; // if editing
}

export function WorkflowEditor({
  initialTitle = "",
  initialDescription = "",
  initialSteps = [],
  workflowId,
}: WorkflowEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [steps, setSteps] = useState<StepData[]>(
    initialSteps.length > 0
      ? initialSteps
      : [{ title: "", content: "" }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addStep = () => {
    setSteps((prev) => [...prev, { title: "", content: "" }]);
  };

  const removeStep = (index: number) => {
    if (steps.length === 1) return;
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    const newSteps = [...steps];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSteps.length) return;
    [newSteps[index], newSteps[swapIndex]] = [
      newSteps[swapIndex],
      newSteps[index],
    ];
    setSteps(newSteps);
  };

  const updateStep = (index: number, field: keyof StepData, value: string) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, [field]: value } : step))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Workflow title is required.");
      return;
    }

    if (steps.some((s) => !s.title.trim() || !s.content.trim())) {
      setError("All steps must have a title and content.");
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      steps: steps.map((s) => ({ title: s.title.trim(), content: s.content.trim() })),
    };

    const url = workflowId ? `/api/workflows/${workflowId}` : "/api/workflows";
    const method = workflowId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save workflow.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Workflow details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Workflow details</h2>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="e.g. New Employee Onboarding"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-none"
            placeholder="Brief description of what this workflow covers..."
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            Steps ({steps.length})
          </h2>
          <button
            type="button"
            onClick={addStep}
            className="text-sm text-orange-600 font-medium hover:text-orange-700"
          >
            + Add step
          </button>
        </div>

        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                Step {index + 1}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveStep(index, "up")}
                  disabled={index === 0}
                  className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveStep(index, "down")}
                  disabled={index === steps.length - 1}
                  className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  disabled={steps.length === 1}
                  className="p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                  title="Remove step"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Step title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(index, "title", e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  placeholder="e.g. Introduction to the team"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={step.content}
                  onChange={(e) => updateStep(index, "content", e.target.value)}
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-y"
                  placeholder="Explain what the employee needs to do or learn in this step..."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addStep}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 text-sm font-medium hover:border-orange-300 hover:text-orange-500 transition-colors"
        >
          + Add another step
        </button>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Saving..."
            : workflowId
            ? "Save changes"
            : "Create workflow"}
        </button>
      </div>
    </form>
  );
}
