import React, { useState } from 'react';
import {
  BookHeart,
  X,
  Sparkles,
  MapPin,
  Save,
  Clock,
  Trash2,
  Feather,
  Loader2
} from 'lucide-react';

export default function MoodJournalModal({
  isOpen,
  onClose,
  currentMood,
  currentLocation,
  currentWeather,
  moodLogs = [],
  onSaveLog,
  onDeleteLog
}) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentMood || !currentLocation) return;

    setIsSubmitting(true);
    try {
      await onSaveLog({
        moodId: currentMood.id,
        moodName: currentMood.name,
        cityName: currentLocation.name,
        country: currentLocation.country || '',
        temperatureC: currentWeather?.current?.tempC ?? null,
        weatherDescription: `${currentMood.name} Weather`,
        note: note.trim()
      });
      setNote('');
    } catch (err) {
      console.error('Error saving mood log:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-xl rounded-3xl p-6 sm:p-7 border border-white/20 shadow-2xl relative flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <BookHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Weather & Mood Journal
              </h3>
              <p className="text-xs text-slate-400">
                Persistent emotion logs backed by MongoDB Atlas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add New Reflection Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-5 p-4 rounded-2xl bg-white/5 border border-white/10 shrink-0"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Current Mood:{' '}
              <span className="text-purple-300 font-bold">
                {currentMood?.emoji} {currentMood?.name}
              </span>
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" />
              {currentLocation?.name}
            </span>
          </div>

          <textarea
            rows="2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="How does today's weather make you feel? (optional reflection)..."
            className="w-full p-3 rounded-xl bg-black/30 border border-white/15 focus:border-purple-400 focus:outline-none text-xs text-white placeholder:text-slate-500 resize-none transition-all"
          />

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Save Entry
                </>
              )}
            </button>
          </div>
        </form>

        {/* Past Reflections List */}
        <div className="flex-grow overflow-y-auto pr-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Previous Reflections
          </h4>

          <div className="space-y-2.5">
            {moodLogs && moodLogs.length > 0 ? (
              moodLogs.map((log) => {
                const dateStr = new Date(log.createdAt).toLocaleDateString(
                  undefined,
                  {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }
                );
                return (
                  <div
                    key={log._id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-semibold">
                          {log.moodName}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />{' '}
                          {log.cityName}
                        </span>
                        {log.temperatureC !== null &&
                          log.temperatureC !== undefined && (
                            <span className="text-xs text-slate-400 font-mono">
                              {log.temperatureC}°C
                            </span>
                          )}
                        <span className="text-[10px] text-slate-500 ml-auto">
                          {dateStr}
                        </span>
                      </div>
                      {log.note && (
                        <p className="text-xs text-slate-200 mt-1.5 leading-relaxed bg-black/20 p-2 rounded-xl italic">
                          “{log.note}”
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteLog(log._id)}
                      title="Delete log"
                      className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                <Feather className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="font-medium">No mood reflections recorded yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Write how this weather makes you feel and save it to MongoDB Atlas.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
