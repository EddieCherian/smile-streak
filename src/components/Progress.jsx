export default function Progress({ habitData }) {
  const days = Object.values(habitData || {});
  const completed = days.filter(
    d => d?.morning && d?.night && d?.floss
  ).length;

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-md text-center">
        <p className="text-sm text-gray-500">Completed Days</p>
        <p className="text-3xl font-extrabold text-cyan-600">
          {completed}
        </p>
      </div>
    </section>
  );
}
