import { useEffect } from "react";
import { useForm } from "react-hook-form";

const JoinTeamModal = ({ isOpen, isSubmitting, errorMessage, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      inviteCode: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset({ inviteCode: "" });
    }
  }, [isOpen, reset]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[30px] bg-white p-6 shadow-panel sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
              Team access
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Join with invitation code
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
          >
            Close
          </button>
        </div>

        <form
          className="mt-6 space-y-5"
          onSubmit={handleSubmit(({ inviteCode }) => onSubmit(inviteCode))}
        >
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Invitation code
            </span>
            <input
              type="text"
              placeholder="TEAM12"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 uppercase text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
              {...register("inviteCode", {
                required: "Invitation code is required.",
              })}
            />
            {errors.inviteCode && (
              <p className="mt-2 text-sm text-rose-500">{errors.inviteCode.message}</p>
            )}
          </label>

          {errorMessage && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Joining team..." : "Join team"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinTeamModal;
