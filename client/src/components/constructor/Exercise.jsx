import React, { useEffect } from "react";
import { useContext } from "react";
import { InputNamber } from "./InputNamber";
import { useInput } from "../../hooks/input.hook";
import { ConstructorContext } from "../../context/ConstructoContext";

export const Exercise = (props) => {
  const constructor = useContext(ConstructorContext);
  const exercise = useInput("Упражнение");
  const weight = useInput(10);
  const percent = useInput(50);
  const preRepit = useInput(3);
  const workRepit = useInput(3);

  useEffect(() => {
    let buffer = [];
    if (constructor.todoExercise !== null) {
      constructor.todoExercise.map((todo, index) => {
        if (index === props.index) {
          buffer = [
            ...buffer,
            {
              exercise: exercise.value,
              weight: weight.value,
              percent: percent.value,
              preRepit: preRepit.value,
              workRepit: workRepit.value,
              id: index,
              inputRepit: 1,
            },
          ];
        } else {
          buffer = [...buffer, todo];
        }
      });
    }
    constructor.setTodoExercise(buffer);
  }, [
    exercise.value,
    weight.value,
    percent.value,
    preRepit.value,
    workRepit.value,
  ]);

  return (
    <div className="delete_wrapper">
      <div className="delete_exercise" onClick={props.onClick}>
        &#10006;
      </div>
      <div className="wrapper-excercise">
        <div className="input-excercise">
          <input
            className="exc"
            type="text"
            value={props.value[props.index].exercise}
            onChange={(e) => exercise.onChange(e)}
            maxLength="20"
          />
          <input
            type="text"
            placeholder="0"
            value={props.value[props.index].weight}
            onChange={(e) => weight.onChangeNumber(e)}
            maxLength="3"
          />
          <InputNamber
            value={props.value[props.index].percent}
            onChange={(e) => percent.onChange(e)}
            handleMinus={() => percent.handleMinus(50, 2.5)}
            handlePlus={() => percent.handlePlus(80, 2.5)}
          />
          <InputNamber
            value={props.value[props.index].preRepit}
            onChange={(e) => preRepit.onChange(e)}
            handleMinus={() => preRepit.handleMinus(2)}
            handlePlus={() => preRepit.handlePlus(6)}
          />
          <InputNamber
            value={props.value[props.index].workRepit}
            onChange={(e) => workRepit.onChange(e)}
            handleMinus={() => workRepit.handleMinus(2)}
            handlePlus={() => workRepit.handlePlus(9)}
          />
        </div>
      </div>
    </div>
  );
};
