// app/components/TaskList.jsx

export default function TaskList({ tasks }) {
  return (
    <div className="mx-auto bg-black/60 backdrop-blur rounded-xl border border-white/10 p-4 text-white">
      <h3 className="text-lg font-semibold mb-2">Mission Tasks</h3>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className={`flex items-center gap-3 p-2 rounded-md ${t.done ? 'bg-green-600/20' : 'bg-white/5'}`}>
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${t.done ? 'bg-green-500 border-green-500' : 'border-white/40'}`}
              aria-label={t.done ? 'completed' : 'pending'}
            >
              {t.done ? '✓' : ''}
            </span>
            <span className={t.done ? 'line-through opacity-80' : ''}>{t.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
