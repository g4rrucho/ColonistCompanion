import { useContext } from "react";
import { CompanionContext } from "./CompanionContext";

export const useCompanion = () => {
  const ctx = useContext(CompanionContext);
  return ctx;
};
