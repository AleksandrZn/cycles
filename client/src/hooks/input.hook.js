import { useContext, useState } from "react";
import { WorkoutContext } from "../context/WorkoutContext";
import { useValidation } from "./validation.hook";

export const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setDirty] = useState(false);
  const valid = useValidation(value, validations);
  const context = useContext(WorkoutContext);
  const handlePlus = (max, step, index = -1) => {
    if (value !== (max || 5)) setValue(value + (step || 1));
    if (index > -1) {
      let sur = [...context.surplus];
      sur[index] -= 1;
      context.setSurplus(sur);
    }
  };
  const handleMinus = (min, step, index = -1) => {
    if (value !== (min || 0)) setValue(value - (step || 1));
    if (index > -1) {
      let sur = [...context.surplus];
      sur[index] += 1;
      context.setSurplus(sur);
    }
  };
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const onChangeNumber = (e) => {
    if (!e.target.value.match(/[^0-9'".]/)) {
      setValue(e.target.value);
    }
  };
  const onBlur = () => {
    setDirty(true);
  };
  return {
    value,
    setValue,
    setDirty,
    onChange,
    onBlur,
    onChangeNumber,
    handleMinus,
    handlePlus,
    isDirty,
    ...valid,
  };
};
