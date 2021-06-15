import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { InputNamber } from "./InputNamber";
import { AddButton } from "./AddButton";
import { ConstructorContext } from "../../context/ConstructoContext";
import { WorkoutContext } from "../../context/WorkoutContext";

export const Workout = (props) => {
  const getDay = (key) => {
    const days = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
    return days[key];
  };
  const constructor = useContext(ConstructorContext);
  const [trainingDay, setTrainingDay] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [description, setDescription] = useState([]);
  const [surplus, setSurplus] = useState([]);

  useEffect(() => {
    let sur = [];
    constructor.todoExercise.map((item, i) => {
      sur = [...sur, item.workRepit];
    });
    setSurplus(sur);
  }, [constructor.todoExercise]);

  useEffect(() => {
    if (constructor.next) {
      setExercises([]);
    }
  }, [constructor.next]);

  useEffect(() => {
    let buffer = [];
    let len = 0;
    exercises.map((item, index) => {
      if (item.preRepit > len) {
        len = item.preRepit;
      }
    });
    if (len !== 0) {
      for (let index = 0; index <= len; index++) {
        buffer = [...buffer, index + 1];
      }
    }
    setDescription(buffer);
  }, [constructor.workout]);

  useEffect(() => {
    let buffer = [];
    constructor.duration.days.map((day) => {
      buffer = [...buffer, [day, []]];
    });
    constructor.setWorkout(buffer);
  }, [constructor.duration]);

  const handleDay = (index) => {
    setTrainingDay(index);
    setExercises([...constructor.workout[index][1]]);
  };

  const handleAdd = (index) => {
    let e = document.getElementById("select_exercise");
    let name = e.options[e.selectedIndex].value;
    let buffer = new Array(...constructor.workout);
    let sur = surplus;
    constructor.todoExercise.map((item, i) => {
      if (item.exercise === name) {
        setExercises([...buffer[index][1], item]);
        constructor.setWorkout(buffer);
        sur[item.id] -= item.inputRepit;
      }
    });
    setSurplus(sur);
  };

  const handleRemove = (indexDay, index) => {
    let buffer = [...constructor.workout];
    let sur = [...surplus];
    buffer[indexDay][1].map((_, i) => {
      if (i === index) {
        sur[buffer[indexDay][1][i].id] += buffer[indexDay][1][i].inputRepit;
        buffer[indexDay][1].splice(index, 1);
      }
    });
    setSurplus(sur);
    constructor.setWorkout(buffer);
    setExercises(buffer[indexDay][1]);
  };

  useEffect(() => {
    let buffer = new Array(...constructor.workout);
    buffer[trainingDay][1] = exercises;
    constructor.setWorkout(buffer);
  }, [exercises]);

  return (
    <WorkoutContext.Provider
      value={{
        surplus,
        setSurplus,
        exercises,
        setExercises,
      }}
    >
      <div className={props.class}>
        <div className="backgraund_2">
          <div className="left_menu">
            <p>НЕДЕЛЯ</p>
            <span>1</span>
            <div className="days_week">
              {constructor.workout.map((item, index) => {
                return (
                  <div
                    className={
                      index === trainingDay
                        ? "training_day checked"
                        : "training_day no_checked"
                    }
                    onClick={() => handleDay(index)}
                  >
                    <p>{getDay(item[0])}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="container_do_training">
            <div className="exercises">
              <div className="wrapper_exercise_workout">
                {exercises.map((item, index) => {
                  return (
                    <div className="added_exercise">
                      <div className="remainder">
                        {constructor.todoExercise.map((e, i) => {
                          if (e.id === item.id) {
                            return surplus[i];
                          }
                        })}
                      </div>
                      <div
                        onClick={() => handleRemove(trainingDay, index)}
                        className="delete_exercise_workout"
                      >
                        &#10006;
                      </div>
                      <p>{item.exercise}</p>
                    </div>
                  );
                })}
                {exercises.length < 10 &&
                surplus.filter((item) => item === 0).length === surplus.length
                  ? false
                  : true && (
                      <div className="add_exercise">
                        <select id="select_exercise">
                          {constructor.todoExercise.map((item, index) => {
                            if (surplus[index] !== 0)
                              return (
                                <option className="training_day">
                                  {item.exercise}
                                </option>
                              );
                          })}
                        </select>
                        <AddButton
                          onClick={() => {
                            handleAdd(trainingDay);
                          }}
                          className="add_exercise_button"
                        />
                      </div>
                    )}
              </div>
            </div>
            <div className="input_values">
              <div className="wrapper_description">
                {description.map((_, index, mass) => {
                  return (
                    <div className="description">
                      <p>{mass[index]}</p>
                      <span>Вес</span>
                      <span>Под</span>
                      <span>Пов</span>
                      <span>%</span>
                    </div>
                  );
                })}
              </div>
              {exercises.map((item, i) => {
                let repits = new Array(item.preRepit + 1);
                for (let index = 0; index < repits.length; index++) {
                  repits[index] = true;
                }
                return (
                  <div className="values_exercise">
                    {repits.map((_, index) => {
                      return (
                        <div className="values">
                          <input
                            className="weight"
                            type="text"
                            readOnly
                            value={Math.ceil(
                              index === item.preRepit
                                ? (item.weight / 100) * item.percent
                                : (((item.weight / 100) * item.percent * 0.8) /
                                    item.preRepit) *
                                    (index + 1)
                            )}
                          />
                          {index === item.preRepit && (
                            <InputNamber
                              type={1}
                              index={i}
                              exerciseId={item.id}
                              className="training_input"
                            />
                          )}
                          {index !== item.preRepit && (
                            <input
                              className="repit"
                              type="text"
                              readOnly
                              value="1"
                            />
                          )}
                          <input
                            className="repit"
                            type="text"
                            readOnly
                            value="8"
                          />
                          <input
                            className="percent"
                            type="text"
                            readOnly
                            value={Math.ceil(
                              index === item.preRepit
                                ? item.percent
                                : ((item.percent * 0.8) / item.preRepit) *
                                    (index + 1)
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </WorkoutContext.Provider>
  );
};
