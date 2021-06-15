import React from "react";
import { useContext, useState } from "react";
import { InputNamber } from "./InputNamber";
import { useInput } from "../../hooks/input.hook";
import { ConstructorContext } from "../../context/ConstructoContext";

export const Duration = () => {
  const constructor = useContext(ConstructorContext);
  const [visible, setVisible] = useState(false);
  const date = new Date();
  const [days, setDays] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const weekCount = useInput(4);
  const dateStart = useInput("");

  const handleDays = (key) => {
    let buffer = [...days];
    buffer.map((_, index) => {
      if (index === key) {
        if (days[index]) {
          buffer[index] = false;
          setDays(buffer);
          document.getElementById(daysOfWeek[index]).style.backgroundColor =
            "white";
        } else {
          buffer[index] = true;
          setDays(buffer);
          document.getElementById(daysOfWeek[index]).style.backgroundColor =
            "#52C9A5";
        }
      }
    });
  };

  const handleNext = () => {
    let buffer = [];
    days.map((day, index) => {
      if (day) {
        buffer = [...buffer, index];
      }
    });
    if (
      dateStart.value !== "" &&
      days.map((item, i) => {
        if (item) return true;
        if (i === days.length - 1) return false;
      }) &&
      constructor.todoExercise.length !== 0
    ) {
      constructor.setDuration({
        date: dateStart.value,
        duration: weekCount.value,
        days: buffer,
      });

      constructor.setNext(true);
    } else {
      setVisible(true);
    }
  };

  return (
    <div className="duration">
      <div className="days">
        <h2>ВЫБЕРИТЕ ДНИ</h2>
        <div className="week">
          <div id="mon" className="mon" onClick={() => handleDays(0)}>
            <span>ПН</span>
          </div>
          <div id="tue" className="tue" onClick={() => handleDays(1)}>
            <span> ВТ</span>
          </div>
          <div id="wed" className="wed" onClick={() => handleDays(2)}>
            <span>СР</span>
          </div>
          <div id="thu" className="thu" onClick={() => handleDays(3)}>
            <span>ЧТ</span>
          </div>
          <div id="fri" className="fri" onClick={() => handleDays(4)}>
            <span>ПТ</span>
          </div>
          <div id="sat" className="sat" onClick={() => handleDays(5)}>
            <span>СБ</span>
          </div>
          <div id="sun" className="sun" onClick={() => handleDays(6)}>
            <span>ВС</span>
          </div>
        </div>
      </div>
      <div className="count_weeks">
        <h2>КОЛИЧЕСТВО НЕДЕЛЬ</h2>
        <InputNamber
          className="number_weeks"
          value={weekCount.value}
          onChange={(e) => weekCount.onChange(e)}
          handleMinus={() => weekCount.handleMinus(4)}
          handlePlus={() => weekCount.handlePlus(12)}
        />
      </div>
      <div className="date">
        <h2>ДАТА НАЧАЛА ТРЕНИРОВОК</h2>
        <div className="wraper_date">
          <input
            type="date"
            min={`${date.getFullYear()}-${
              date.getMonth() + 1 >= 10
                ? date.getMonth() + 1
                : "0" + (date.getMonth() + 1)
            }-${date.getDate() >= 10 ? date.getDate() : "0" + date.getDate()}`}
            max="2025-04-24"
            onKeyDown={(e) => e.preventDefault()}
            value={dateStart.value}
            onChange={(e) => dateStart.onChange(e)}
          />
        </div>
      </div>
      <div className="btn-wraper">
        <div className="btn btn1" onClick={(e) => handleNext(e)}>
          ВТОРОЙ ШАГ
        </div>
        {visible && <div className="warning">Заполните все данные</div>}
      </div>
    </div>
  );
};
