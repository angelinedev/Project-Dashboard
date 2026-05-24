const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-lg",
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const AvatarBadge = ({
  user,
  size = "md",
  interactive = false,
  onClick,
  className = "",
}) => {
  const content = user?.avatarUrl ? (
    <img
      src={user.avatarUrl}
      alt={user.fullName || "Profile avatar"}
      className="h-full w-full rounded-full object-cover"
    />
  ) : (
    <span>{getInitials(user?.fullName || "PD")}</span>
  );

  const sharedClassName = `flex ${sizeClasses[size]} items-center justify-center overflow-hidden rounded-full bg-teal-500 font-semibold text-slate-950 ${className}`;

  if (interactive) {
    return (
      <button type="button" onClick={onClick} className={sharedClassName}>
        {content}
      </button>
    );
  }

  return <div className={sharedClassName}>{content}</div>;
};

export default AvatarBadge;
