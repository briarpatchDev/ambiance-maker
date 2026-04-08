"use client";

import { createContext, useContext } from "react";

export type User = {
  id: string;
  email?: string;
  avatar?: string;
  username?: string;
  role?: string;
};

const UserContext = createContext<User | null>(null);

export const UserProvider = ({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
