import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import api, { getApiErrorMessage } from "@/services/api.js";
import { persistSession } from "@/utils/authStorage.js";

const authModes = {
  login: {
    eyebrow: "Welcome back",
    title: "Sign in to your team workspace",
    submitLabel: "Enter dashboard",
  },
  register: {
    eyebrow: "Create account",
    title: "Start collaborating with your team",
    submitLabel: "Create account",
  },
};

const authHighlights = [
  "Protected dashboard access with JWT-based session storage",
  "Live task board connected to your MongoDB-backed task API",
  "Join a shared team instantly with an invitation code",
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      inviteCode: "",
    },
  });

  const currentMode = authModes[mode];
  const alternateModeLabel = useMemo(
    () => (mode === "login" ? "Need an account?" : "Already registered?"),
    [mode],
  );

  const onSubmit = async (values) => {
    setServerError("");

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login"
          ? {
              email: values.email,
              password: values.password,
            }
          : {
              fullName: values.fullName,
              email: values.email,
              password: values.password,
              inviteCode: values.inviteCode || undefined,
            };

      const response = await api.post(endpoint, payload);
      persistSession(response.data.data ?? response.data);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen px-4 py-5 lg:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-[1480px] overflow-hidden rounded-[36px] border border-white/60 bg-white/65 shadow-panel backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.26),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_32%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.34em] text-teal-200/70">
                Project Dashboard
              </p>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
                Internship-ready team operations, task visibility, and secure access.
              </h1>
              <p className="mt-5 max-w-xl text-base text-slate-300">
                Use the protected login flow to enter the team workspace, review
                your assigned tasks, and join a team by invitation code.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {authHighlights.map((item, index) => (
                <article
                  key={item}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
                    0{index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-200">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center px-6 py-8 sm:px-8 sm:py-10">
          <div className="mx-auto w-full max-w-lg">
            <div className="rounded-[30px] bg-white p-7 shadow-panel sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.26em] text-slate-400">
                    {currentMode.eyebrow}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                    {currentMode.title}
                  </h2>
                </div>
                <div className="rounded-full bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                  MERN
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 rounded-full bg-slate-100 p-1">
                {Object.keys(authModes).map((authMode) => (
                  <button
                    key={authMode}
                    type="button"
                    onClick={() => setMode(authMode)}
                    className={`rounded-full px-4 py-3 text-sm font-semibold capitalize transition ${
                      mode === authMode
                        ? "bg-slate-950 text-white"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {authMode}
                  </button>
                ))}
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {mode === "register" && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-600">
                      Full name
                    </span>
                    <input
                      type="text"
                      placeholder="Ariana Patel"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
                      {...register("fullName", {
                        required: mode === "register" ? "Full name is required." : false,
                      })}
                    />
                    {errors.fullName && (
                      <p className="mt-2 text-sm text-rose-500">{errors.fullName.message}</p>
                    )}
                  </label>
                )}

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">
                    Email
                  </span>
                  <input
                    type="email"
                    placeholder="team.member@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
                    {...register("email", {
                      required: "Email is required.",
                    })}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-rose-500">{errors.email.message}</p>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">
                    Password
                  </span>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
                    {...register("password", {
                      required: "Password is required.",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters.",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-rose-500">{errors.password.message}</p>
                  )}
                </label>

                {mode === "register" && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-600">
                      Team invitation code
                    </span>
                    <input
                      type="text"
                      placeholder="Optional: TEAM12"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 uppercase text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
                      {...register("inviteCode")}
                    />
                    <p className="mt-2 text-sm text-slate-400">
                      Leave this blank if you are creating an account first and joining later.
                    </p>
                  </label>
                )}

                {serverError && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Please wait..." : currentMode.submitLabel}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between gap-3 text-sm text-slate-500">
                <span>{alternateModeLabel}</span>
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="font-semibold text-slate-900"
                >
                  {mode === "login" ? "Create one now" : "Sign in instead"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
