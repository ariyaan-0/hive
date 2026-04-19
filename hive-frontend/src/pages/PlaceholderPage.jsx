const PlaceholderPage = ({ title }) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="bg-card-bg border border-divider rounded-xl shadow-[var(--shadow-card)] p-12 text-center max-w-md w-full mx-4">
        <h2 className="font-heading font-medium text-(--text-xl) text-text-heading mb-4">
          {title}
        </h2>
        <p className="text-text-body text-(--text-base)">
          This page is currently under development. Please check back later!
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
