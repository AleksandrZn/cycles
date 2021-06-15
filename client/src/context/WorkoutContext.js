import { createContext } from "react";
function noop() {}
export const WorkoutContext = createContext({
  surplus: null,
  setSurplus: noop,
  exercises: null,
  setExercises: noop,
});
