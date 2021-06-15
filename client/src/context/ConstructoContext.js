import { createContext } from "react";
const noop = () => {};
export const ConstructorContext = createContext({
  todoExercise: null,
  setTodoExercise: noop,
  duration: null,
  setDuration: noop,
  workout: null,
  setWorkout: noop,
  next: null,
  setNext: noop,
  help: null,
  setHelp: noop,
  cycle: null,
  setCycle: noop,
  req: false,
  setReq: noop,
});
