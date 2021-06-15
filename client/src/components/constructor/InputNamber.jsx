import React, { useContext, useEffect, useState } from "react";
import minus from "../assets/images/-.svg";
import plus from "../assets/images/+.svg";
import { useInput } from "../../hooks/input.hook";
import { WorkoutContext } from "../../context/WorkoutContext";

export const InputNamber = (props) => {
  const workout = useContext(WorkoutContext);
  const repit = useInput(
    workout.exercises !== null ? workout.exercises[props.index].inputRepit : 1
  );
  useEffect(() => {
    repit.setValue(
      workout.exercises !== null ? workout.exercises[props.index].inputRepit : 1
    );
  }, [workout.exercises]);
  useEffect(() => {
    if (workout.exercises !== null) {
      let exercises = new Array(...workout.exercises);
      if (exercises !== null) {
        exercises[props.index] = {
          exercise: exercises[props.index].exercise,
          weight: exercises[props.index].weight,
          percent: exercises[props.index].percent,
          preRepit: exercises[props.index].preRepit,
          workRepit: exercises[props.index].workRepit,
          id: exercises[props.index].id,
          inputRepit: repit.value,
        };
        workout.setExercises(exercises);
      }
    }
  }, [repit.value]);

  if (props.type === 1) {
    return (
      <div className={"number " + props.className}>
        {repit.value !== 1 && (
          <img
            src={minus}
            className="number-minus"
            alt="minus"
            onClick={() =>
              repit.handleMinus(1, 1, workout.exercises[props.index].id)
            }
          />
        )}
        <input
          type="number"
          value={repit.value}
          onChange={(e) => repit.onChange(e)}
          readonly
        />
        {workout.surplus[props.exerciseId] !== 0 && (
          <img
            src={plus}
            className="number-plus"
            alt="plus"
            onClick={() =>
              repit.handlePlus(9, 1, workout.exercises[props.index].id)
            }
          />
        )}
      </div>
    );
  }
  if (props.type === 2 || true) {
    return (
      <div className={"number " + props.className}>
        <img
          src={minus}
          className="number-minus"
          alt="minus"
          onClick={props.handleMinus}
        />
        <input
          type="number"
          value={props.value}
          onChange={props.onChange}
          readonly
        />
        <img
          src={plus}
          className="number-plus"
          alt="plus"
          onClick={props.handlePlus}
        />
      </div>
    );
  }
};
