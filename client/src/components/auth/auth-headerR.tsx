import { useState } from "react";

const AuthHeader = ({
  label,
  title,
  onSelectRole,
}: {
  label: string;
  title: string;
  onSelectRole: (role: "User" | "Expert") => void;
}) => {
  const [selectedRole, setSelectedRole] = useState<"User" | "Expert" | null>(
    null
  );

  const handleRoleClick = (role: "User" | "Expert") => {
    setSelectedRole(role); 
    onSelectRole(role); 
  };

  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded ${
            selectedRole === "User"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 hover:bg-gray-800 hover:text-white"
          }`}
          onClick={() => handleRoleClick("User")}
        >
          User
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedRole === "Expert"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 hover:bg-gray-800 hover:text-white"
          }`}
          onClick={() => handleRoleClick("Expert")}
        >
          Expert
        </button>
      </div>
    </div>
  );
};

export default AuthHeader;
