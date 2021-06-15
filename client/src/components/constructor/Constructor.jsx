import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import "../assets/styles/Constructor.css";
import { AddButton } from "./AddButton";
import { Exercise } from "./Exercise";
import { Duration } from "./Duration";
import { Workout } from "./Workout";
import { ConstructorContext } from "../../context/ConstructoContext";
import video1 from "../assets/videos/video1.mp4";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { Redirect } from "react-router";
import { Loader } from "../Loader";
import { CycleWeek } from "./CycleWeek";
import { CycleExcel } from "./CycleExcel";

export const Constructor = () => {
  const [next, setNext] = useState(false);
  const [workout, setWorkout] = useState([[-1, []]]);
  const [todoExercise, setTodoExercise] = useState([]);
  const [visible, setVisible] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [duration, setDuration] = useState({
    date: "",
    duration: 0,
    days: [],
  });
  const [help, setHelp] = useState(0);
  const [cycle, setCycle] = useState(1);
  const { loading, error, request, clearError, setError } = useHttp();
  const auth = useContext(AuthContext);
  const [req,setReq]=useState(false)

  const handlePrev = () => {
    setWorkout([[-1, []]]);
    setNext(false);
    setVisible(false);
  };
  const getVideo = (key) => {
    switch (key) {
      case 1:
        return video1;
      default:
        return false;
    }
  };

  const addTodoExercise = (oldTodoExercise, newTodoExercise) =>
    setTodoExercise([...oldTodoExercise, newTodoExercise]);
  const removeItem = (i, oldmass) => {
    let buffer = [...oldmass];
    buffer.map((_, index) => {
      if (index === i) {
        buffer.splice(index, 1);
      }
    });
    setTodoExercise(buffer);
  };
  const handleHelpHide = () => {
    setHelp(0);
  };
  const handleAdd = () => {
    addTodoExercise(todoExercise, {
      exercise: "",
      weight: "",
      percent: "",
      preRepit: "",
      workRepit: "",
      id: "",
      inputRepit: null,
    });
  };
  const handleCreate = () => {
    workout.map(async (item, index) => {
      if (item[1].length !== 0) {
        if (index + 1 === workout.length) {
          setVisible(false);
          let start = new Date(duration.date)
          let end = new Date(duration.date);
          end.setDate(start.getDate() + 7 * duration.duration);
          workout.map(() => {});
          try {
            auth.setRefresh(true);
            await request(
              "/api/constructor/create",
              "POST",
              {
                type: "Линейное циклирование",
                start: start,
                end: end,
                active: true,
                exercises: todoExercise,
                workouts: workout,
                duration: duration.duration
              },
              { Authorization: `Bearer ${auth.token}` }
            );
            setRedirect(true);
          } catch (e) {
            if (e.message === "Auth error") {
              auth.logout();
            }
          }
        }
      } else setVisible(true);
    });
  };

  return (
    <ConstructorContext.Provider
      value={{
        todoExercise,
        setTodoExercise,
        duration,
        setDuration,
        workout,
        setWorkout,
        next,
        setNext,
        help,
        setHelp,
        cycle,
        setCycle,
        req,
        setReq
      }}
    >
      {redirect && <Redirect to="/workout" />}
      <div className="construct">
        {help !== 0 && (
          <div className="help">
            <p onClick={() => handleHelpHide()}>&#10006;</p>
            <video preload="metadata" width="750" height="500" controls>
              <source src={getVideo(help)} type="video/mp4" />
            </video>
          </div>
        )}
        {(loading||req)&& (
          <div className="background_back">
            <Loader />
          </div>
        )}
        <Navbar />
        <div className="container-constructor">
          {cycle === 1 && (
            <div className="contaner-cycles">
              {!next && (
                <div className="wrapper">
                  <h1>
                    ЛИНЕЙНЫЙ ЦИКЛ <br />
                    (ШАГ ПЕРВЫЙ)
                  </h1>
                  <div className="contaner-excercise">
                    <div className="names">
                      <p>УПРАЖНЕНИЕ</p>
                      <p>РАБОЧИЙ ВЕС (8 ПОВТОРОВ)</p>
                      <p>ПРОЦЕНТ РАБОЧЕГО ПОДХОДА</p>
                      <p>РАЗМИНОЧНЫЙ ПОДХОД</p>
                      <p>РАБОЧИЙ ПОДХОД</p>
                    </div>
                    <div className="count">{todoExercise.length}</div>
                    <div className="scroll-wrapper-exercise">
                      {todoExercise.map((todo, index) => {
                        return (
                          <Exercise
                            value={todoExercise}
                            index={index}
                            onClick={() => removeItem(index, todoExercise)}
                          />
                        );
                      })}
                    </div>
                    <AddButton onClick={() => handleAdd()} />
                  </div>
                </div>
              )}
              {!next && <Duration />}
              {next && (
                <div className="description_workout">
                  <h1>
                    ЛИНЕЙНЫЙ ЦИКЛ <br />
                    (ШАГ ВТОРОЙ)
                  </h1>
                  <p>Создайте первую тренировочную неделю</p>
                  <div className="btn btn1" onClick={() => handlePrev()}>
                    ПЕРВЫЙ ШАГ
                  </div>
                </div>
              )}
              <div id="scroller"></div>
              <Workout class={next ? "wrapper_training_week" : "unvisible"} />
              <div className="btn-wraper">
                {next && (
                  <div
                    className={loading ? "btn btn1 disable" : "btn btn1"}
                    onClick={() => handleCreate()}
                  >
                    СОЗДАТЬ
                  </div>
                )}
                {(error || visible) && (
                  <div className="warning">
                    {error || "Заполните все тренировочные дни"}
                  </div>
                )}
              </div>

              <div className="footter">
                <span>©2021 CYCLES. ALL RIGHTS RECERVED</span>
              </div>
            </div>
          )}
          {cycle === 2 && (
            <CycleWeek/>
          )}
          {cycle === 3 && (
            <CycleExcel/>
          )}
        </div>
      </div>
    </ConstructorContext.Provider>
  );
};
