import React, { useContext, useEffect, useState } from "react";
import { NavbarWorkout } from "./NavbarWorkout";
import "../assets/styles/Workout.css";
import { Loader } from "../Loader";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { Tools } from "./Tools";
import { Warning } from "../Warning";
const Workout = () => {
  const [load, setLoad] = useState(true);
  const auth = useContext(AuthContext);
  const [workout, setWorkout] = useState({});
  const [trainingMode, setTrainingMode] = useState(0);
  const [description, setDescription] = useState([]);
  const [type, setType] = useState("");
  const { request } = useHttp();
  const [visble, setVisible] = useState(0);
  let checkRepits = new Array(10);
  let checkExercises = new Array(10);
  for (let i = 0; i < 10; i++) {
    checkExercises[i] = (i + 1) * -2;
    checkRepits[i] = new Array(7);
  }
  for (let i = 0, k = 0; i < 10; i++, k++) {
    for (let j = 0; j < 7; j++, k++) {
      checkRepits[i][j] = k;
    }
  }
  let date = new Date();
  const getDay = (i) => {
    let days = [
      "ВОСКРЕСЕНЬЕ",
      "ПОНЕДЕЛЬНИК",
      "ВТОРНИК",
      "СРЕДА",
      "ЧЕТВЕРГ",
      "ПЯТНИЦА",
      "СУББОТА",
    ];
    return days[i];
  };

  const handleCheckRepits = (key) => {
    if (
      new Date(workout.date).toLocaleDateString() ===
      new Date().toLocaleDateString()
    ) {
      let elem = document.getElementById(`${key}`);
      if (elem.style.background === "") {
        elem.style.background = "rgb(207, 180, 138)";
      } else {
        elem.style.background = "";
      }
    }
  };
  const handleCheckExercises = (key) => {
    if (
      new Date(workout.date).toLocaleDateString() ===
      new Date().toLocaleDateString()
    ) {
      let elem = document.getElementById(`${key}`);
      if (elem.style.background === "") {
        elem.style.background = "rgb(123, 188, 182)";
      } else {
        elem.style.background = "";
      }
    }
  };
  const handleGetTraining = async (date) => {
    try {
      auth.setRefresh(true);
      const data = await request(
        "/api/workout/get",
        "POST",
        { date: date },
        { Authorization: `Bearer ${auth.token}` }
      );
      if (data.type === 1) {
        setVisible(1);
        setWorkout(data.data);
        setTrainingMode(data.ok);
        setType(data.name);
        let buffer = [];
        let len = 0;
        workout.exercises.map((item, index) => {
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
        setLoad(false);
      } else {
        setVisible(2);
        setWorkout(data.link);
        setType(data.name);
        setLoad(false);
      }
    } catch (e) {
      if (e.message === "Auth error") {
        auth.logout();
      }
    }
  };

  useEffect(() => {
    if (load) {
      handleGetTraining(date.toLocaleDateString());
    }
  }, [workout, load]);

  useEffect(() => {
    if (!auth.visible) setLoad(true);
    if (auth.visible) setLoad(false);
  }, [auth.visible]);
  return (
    <div className="workout">
      {auth.visible && <div className="background_back"></div>}
      {auth.visible && <Warning className="warning_info" choise={true} />}
      {load && (
        <div className="background_back">
          <Loader />
        </div>
      )}
      {!load && <NavbarWorkout />}
      {!load && visble === 1 && (
        <div className="main-content">
          <Tools visible={[true, true, false]} />
          <div className="discription">
            <div>
              <p>
                {getDay(new Date(workout.date).getDay())}
                <br />
                <span>{new Date(workout.date).toLocaleDateString()}</span>
              </p>
              <h1>{type}</h1>
            </div>
          </div>
          <div className="training">
            <div className="exercises">
              <div className="wrapper_exercise_workout">
                {workout.exercises.map((item, index) => {
                  return (
                    <div className="added_exercise">
                      <p
                        id={checkExercises[index]}
                        onClick={() =>
                          handleCheckExercises(checkExercises[index])
                        }
                      >
                        {item.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="input_values">
              <div className="wrapper_description">
                {description.map((_, index, checkRepits) => {
                  return (
                    <div className="description">
                      <span>Вес</span>
                      <span>Под</span>
                      <span>Пов</span>
                      <span>%</span>
                    </div>
                  );
                })}
              </div>
              {workout.exercises.map((item, i) => {
                let repits = new Array(item.preRepit + 1);
                for (let index = 0; index < repits.length; index++) {
                  repits[index] = true;
                }
                return (
                  <div className="values_exercise">
                    {repits.map((_, index) => {
                      return (
                        <div
                          className="values"
                          id={checkRepits[i][index]}
                          onClick={() =>
                            handleCheckRepits(checkRepits[i][index])
                          }
                        >
                          <input
                            className="weight"
                            type="text"
                            readOnly
                            value={
                              Math.ceil(
                                index === item.preRepit
                                  ? ((1 * item.weight.$numberDecimal) / 100) *
                                      (1 * item.percent.$numberDecimal)
                                  : ((((1 * item.weight.$numberDecimal) / 100) *
                                      (1 * item.percent.$numberDecimal) *
                                      0.8) /
                                      item.preRepit) *
                                      (index + 1)
                              ) + "кг"
                            }
                          />
                          {index !== item.preRepit && (
                            <input
                              className="repit"
                              type="text"
                              readOnly
                              value="1"
                            />
                          )}
                          {index === item.preRepit && (
                            <input
                              className="repit"
                              type="text"
                              readOnly
                              value={item.workRepit}
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
                            value={
                              Math.ceil(
                                index === item.preRepit
                                  ? 1 * item.percent.$numberDecimal
                                  : ((1 * item.percent.$numberDecimal * 0.8) /
                                      item.preRepit) *
                                      (index + 1)
                              ) + "%"
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="footter">
            <span>©2021 CYCLES. ALL RIGHTS RECERVED</span>
          </div>
        </div>
      )}
      {!load && visble === 2 && (
        <div className="main-content">
          <Tools visible={[true, true, true]} />
          <div className="discription">
            <div>
              <p>
                {getDay(new Date().getDay())}
                <br />
                <span>{new Date().toLocaleDateString()}</span>
              </p>
              <h1>{type}</h1>
            </div>
          </div>
          <iframe src={workout} />
          <div className="footter">
            <span>©2021 CYCLES. ALL RIGHTS RECERVED</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default Workout;
