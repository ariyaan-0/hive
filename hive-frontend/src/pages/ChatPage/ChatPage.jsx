import { MessageCircle, Zap, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-7 h-7 text-(--color-primary-500)" />,
    title: 'Real-Time',
    description: 'Instant WebSocket-powered messaging. No refresh, no lag — just live conversation.',
  },
  {
    icon: <Users className="w-7 h-7 text-(--color-primary-500)" />,
    title: 'Proximity-Based',
    description: 'Chat with people who are actually near you. Campus friends, event buddies, neighbors.',
  },
  {
    icon: <Shield className="w-7 h-7 text-(--color-primary-500)" />,
    title: 'Private & Safe',
    description: 'End-to-end encrypted DMs. Block and report tools to keep your conversations comfortable.',
  },
];

const steps = [
  { step: 1, title: 'Find People', description: 'Discover users near you or from your feed.' },
  { step: 2, title: 'Start a Chat', description: 'Send a direct message — it\'s instant.' },
  { step: 3, title: 'Go Real-Time', description: 'Messages arrive live, no refreshing needed.' },
  { step: 4, title: 'Stay Safe', description: 'Block, mute, or report anytime.' },
];

const ChatPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col items-center gap-10 animate-fade-in">

      {/* Hero Section */}
      <div className="text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-(--color-card-bg) border border-(--color-divider) shadow-sm flex items-center justify-center">
          <MessageCircle className="w-8 h-8 text-(--color-primary-500)" />
        </div>
        <h1 className="font-heading font-bold text-[32px] text-(--color-text-heading) tracking-tight">
          Chats
        </h1>
        <p className="text-(--color-text-muted) text-(--text-sm) uppercase tracking-[0.1em] font-medium">
          Coming Soon
        </p>
      </div>

      {/* Description Card */}
      <div className="bg-white rounded-2xl border border-(--color-divider) shadow-[var(--shadow-card)] px-8 py-8 text-center w-full max-w-xl">
        <h2 className="font-heading font-medium text-(--text-lg) text-(--color-text-heading) mb-3">
          Real-time conversations, local connections
        </h2>
        <p className="text-(--color-text-body) text-(--text-base) leading-relaxed">
          Private 1-on-1 messaging with people near you. Powered by
          <strong className="text-(--color-primary-500)"> WebSockets </strong>
          for instant, live communication — no refreshing, no delays. Just real talk with your real neighbors.
        </p>
        <div className="mt-6">
          <span className="inline-flex items-center gap-2 bg-(--color-primary-500) text-white px-6 py-2.5 rounded-full font-medium text-(--text-sm) opacity-70 cursor-not-allowed shadow-[var(--shadow-btn)]">
            <MessageCircle className="w-4 h-4" />
            Under Development
          </span>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="w-full">
        <h2 className="font-heading font-medium text-(--text-lg) text-(--color-text-heading) text-center mb-6">
          What's Coming?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl border border-(--color-divider) p-6 text-center flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-(--color-primary-50) flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="font-heading font-medium text-(--text-md) text-(--color-text-heading)">
                {feature.title}
              </h3>
              <p className="text-(--color-text-body) text-(--text-sm) leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl border border-(--color-divider) shadow-[var(--shadow-card)] px-8 py-8 w-full max-w-xl">
        <h2 className="font-heading font-medium text-(--text-lg) text-(--color-text-heading) text-center mb-8">
          How It Will Work
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {steps.map(({ step, title, description }) => (
            <div key={step} className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-(--color-primary-500) text-white font-heading font-bold text-(--text-base) flex items-center justify-center shadow-sm">
                {step}
              </div>
              <h4 className="font-medium text-(--text-sm) text-(--color-text-heading)">{title}</h4>
              <p className="text-(--color-text-muted) text-[11px] leading-snug">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-(--color-text-muted) text-[11px] text-center pb-4">
        🛠 We're actively building this feature. Stay tuned for updates!
      </p>
    </div>
  );
};

export default ChatPage;
