import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteNote, getNote, saveNote } from "../utils/storage";

export default function NoteBox({ fullName }) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNote(getNote(fullName));
  }, [fullName]);

  function handleSave() {
    saveNote(fullName, note);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  function handleDelete() {
    deleteNote(fullName);
    setNote("");
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">My Notes</h2>
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Delete note"
          title="Delete note"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        rows={5}
        className="mt-4 w-full rounded-md border border-slate-300 bg-white p-3 text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        placeholder="Add your thoughts about this repository"
      />
      <div className="mt-3 flex items-center gap-3">
        <button type="button" onClick={handleSave} className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
          Save note
        </button>
        {saved && <span className="text-sm text-emerald-700 dark:text-emerald-300">Saved</span>}
      </div>
    </section>
  );
}

