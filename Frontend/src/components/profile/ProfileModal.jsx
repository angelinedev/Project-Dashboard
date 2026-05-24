import { useEffect } from "react";
import { useForm } from "react-hook-form";

import AvatarBadge from "@/components/common/AvatarBadge.jsx";

const ProfileModal = ({
  isOpen,
  user,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        fullName: user?.fullName || "",
        avatarUrl: user?.avatarUrl || "",
      });
    }
  }, [isOpen, reset, user]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[30px] bg-white p-6 shadow-panel sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
              Profile
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Update your account
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

        <div className="mt-6 flex items-center gap-4 rounded-[24px] bg-slate-50 p-5">
          <AvatarBadge user={user} size="lg" />
          <div>
            <p className="text-lg font-semibold text-slate-900">{user?.fullName}</p>
            <p className="text-sm text-slate-500">{user?.platformRole?.replace("_", " ")}</p>
          </div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Full name
            </span>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
              {...register("fullName", {
                required: "Full name is required.",
              })}
            />
            {errors.fullName && (
              <p className="mt-2 text-sm text-rose-500">{errors.fullName.message}</p>
            )}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Profile image URL
            </span>
            <input
              type="url"
              placeholder="https://..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
              {...register("avatarUrl")}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Email
            </span>
            <input
              type="text"
              value={user?.email || ""}
              readOnly
              className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
            />
          </label>

          {errorMessage && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
