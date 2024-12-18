import { useRouter } from "@/routes/hooks";
import { Navigate } from "react-router";

export const getRole = (key: string) => {
  const roles = [
    { user: "User" },
    { reviewer: "Reviewer" },
    { col_dean: "College Dean" },
    { grant_dep: "Grant Department" },
    { grant_dir: "Grant Director" },
  ];

  const router = useRouter();
  if (!key) {
    return null;
  }

  const value = roles.find((role) => Object.keys(role)[0] === key) as any;
  if (!value) {
    router.replace("/login");
    return null;
  }
  const role = value[key];

  return role;
};
