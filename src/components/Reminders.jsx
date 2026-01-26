export default function Reminders() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Reminders</h2>

      <div className="bg-white p-4 rounded-2xl shadow">
        <p className="font-semibold">Morning Brush</p>
        <p className="text-sm text-gray-500">9:00 AM</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <p className="font-semibold">Night Brush</p>
        <p className="text-sm text-gray-500">8:00 PM</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <p className="font-semibold">Floss</p>
        <p className="text-sm text-gray-500">9:00 PM</p>
      </div>
    </section>
  );
}
