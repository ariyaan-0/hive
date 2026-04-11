import { MapPin, Clock, UserX, Shield, Compass } from 'lucide-react';

const features = [
  {
    icon: <MapPin className="w-7 h-7 text-(--color-primary-500)" />,
    title: 'Hyper Local',
    description: 'Only see rooms within 5km. Connect with your actual neighbors, not strangers across the globe.',
  },
  {
    icon: <Clock className="w-7 h-7 text-(--color-primary-500)" />,
    title: 'Ephemeral',
    description: 'Rooms expire in a few hours. Messages vanish in 24 hours. No digital footprint left behind.',
  },
  {
    icon: <UserX className="w-7 h-7 text-(--color-primary-500)" />,
    title: 'Anonymous',
    description: 'Pick a handle. No profiles, no follower counts, no clout-chasing. Just raw conversation.',
  },
  {
    icon: <Shield className="w-7 h-7 text-(--color-primary-500)" />,
    title: 'Safe',
    description: 'Block users, report abuse. Community-focused safety tools built in from day one.',
  },
];

const steps = [
  { step: 1, title: 'Allow Location', description: 'Share your location so Hive can show you nearby rooms.' },
  { step: 2, title: 'Browse Rooms', description: 'Explore what\'s buzzing within 5km of you right now.' },
  { step: 3, title: 'Jump In & Chat', description: 'Drop into a room, share your take, leave whenever.' },
  { step: 4, title: 'Create Your Own', description: 'Start a room and let the neighborhood come to you.' },
];

const ExplorePage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col items-center gap-10 animate-fade-in">

      {/* Hero Section */}
      <div className="text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-(--color-card-bg) border border-(--color-divider) shadow-sm flex items-center justify-center">
          <Compass className="w-8 h-8 text-(--color-primary-500)" />
        </div>
        <h1 className="font-heading font-bold text-[32px] text-(--color-text-heading) tracking-tight">
          Explore Rooms
        </h1>
        <p className="text-(--color-text-muted) text-(--text-sm) uppercase tracking-[0.1em] font-medium">
          Coming Soon
        </p>
      </div>

      {/* Description Card */}
      <div className="bg-white rounded-2xl border border-(--color-divider) shadow-[var(--shadow-card)] px-8 py-8 text-center w-full max-w-xl">
        <h2 className="font-heading font-medium text-(--text-lg) text-(--color-text-heading) mb-3">
          Discover chatrooms around you
        </h2>
        <p className="text-(--color-text-body) text-(--text-base) leading-relaxed">
          Find and join anonymous chat rooms within
          <strong className="text-(--color-primary-500)"> 5km </strong>
          of your location. No sign-ups, no profile building — just pure local conversations that disappear when they're done.
        </p>
        <div className="mt-6">
          <span className="inline-flex items-center gap-2 bg-(--color-primary-500) text-white px-6 py-2.5 rounded-full font-medium text-(--text-sm) opacity-70 cursor-not-allowed shadow-[var(--shadow-btn)]">
            <Compass className="w-4 h-4" />
            Under Development
          </span>
        </div>
      </div>

      {/* Why Explore? Feature Cards */}
      <div className="w-full">
        <h2 className="font-heading font-medium text-(--text-lg) text-(--color-text-heading) text-center mb-6">
          Why Explore Rooms?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

export default ExplorePage;
