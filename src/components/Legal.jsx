import { Shield, FileText, Lock, AlertTriangle, Download, Mail, Trash2, Database } from "lucide-react";
import { useState } from "react";

export default function Legal() {
  const [open, setOpen] = useState(null);

  const toggle = (section) => {
    setOpen(open === section ? null : section);
  };

  const sections = [
    {
      id: 1,
      title: "Educational Purpose",
      icon: <FileText className="w-5 h-5" />,
      content: `SmileStreak is an educational habit-building tool. Any AI feedback,
      reports, or insights are informational only and do not replace professional
      dental advice, diagnosis, or treatment.`
    },
    {
      id: 2,
      title: "User Responsibility",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `You are responsible for your health decisions. Always consult a
      licensed dental professional for medical concerns, symptoms, or treatment
      planning. SmileStreak should never be used as a substitute for clinical care.`
    },
    {
      id: 3,
      title: "Image & Scan Processing",
      icon: <Database className="w-5 h-5" />,
      content: `Images uploaded for scans are processed only to generate feedback.
      SmileStreak does not sell or share scan images. Any stored progress data
      remains on your device unless cloud backup is explicitly enabled.`
    },
    {
      id: 4,
      title: "Privacy & Data Use",
      icon: <Lock className="w-5 h-5" />,
      content: `We collect only minimal usage data needed for the app to function,
      such as streak progress, habits, and optional scan metadata. This data is
      used solely to improve your experience and app stability.`
    },
    {
      id: 5,
      title: "Liability Limitation",
      icon: <Shield className="w-5 h-5" />,
      content: `SmileStreak and its creators are not responsible for medical,
      dental, or personal outcomes resulting from use of the app. Use of this
      software is voluntary and at your own discretion.`
    },
    {
      id: 6,
      title: "Policy Updates",
      icon: <FileText className="w-5 h-5" />,
      content: `These terms may evolve as the app grows. Continued use of
      SmileStreak indicates acceptance of the most current version.`
    }
  ];

  return (
    <div className="space-y-6 pb-10">

      {/* Header (Claude-style gradient hero) */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6" />
            <h2 className="text-2xl font-black">Legal & Privacy</h2>
          </div>
          <p className="text-sm opacity-90">
            Transparency, safety, and user trust come first.
          </p>
        </div>
      </div>

      {/* Accordion Legal Sections */}
      <div className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden">
        {sections.map((s, i) => (
          <div key={s.id} className={`border-b last:border-none border-gray-100`}>
            <button
              onClick={() => toggle(s.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="text-blue-600">{s.icon}</div>
                <span className="font-bold text-gray-900 text-sm">
                  {s.id}. {s.title}
                </span>
              </div>
              <span className="text-gray-400 text-xs">
                {open === s.id ? "Hide" : "View"}
              </span>
            </button>

            {open === s.id && (
              <div className="px-5 pb-5 text-sm text-gray-700 leading-relaxed">
                {s.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Data Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
        <h3 className="font-black text-gray-900 mb-4">Your Data Controls</h3>

        <div className="grid grid-cols-1 gap-3">

          <button className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 transition">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900 text-sm">
                Export My Data
              </span>
            </div>
          </button>

          <button className="flex items-center justify-between p-4 rounded-2xl bg-red-50 border-2 border-red-200 hover:bg-red-100 transition">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-gray-900 text-sm">
                Delete My Local Data
              </span>
            </div>
          </button>

        </div>
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-3xl p-6 shadow-lg">
        <h3 className="font-black text-gray-900 mb-3">Questions or Concerns?</h3>
        <a
          href="mailto:support@smilestreak.app"
          className="flex items-center gap-3 text-sm font-semibold text-blue-700 hover:underline"
        >
          <Mail className="w-4 h-4" />
          Contact Support
        </a>
      </div>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-400">
          SmileStreak v1.0.0 • Last updated {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}