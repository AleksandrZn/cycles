import { EMAIL, PASSWORD, LINK } from "./typesInputError";
import { useEffect, useState } from "react";

export const useCompare = (value, input) => {
  const [textError, setTextError] = useState("");
  useEffect(() => {
    value !== input.value && !input.isEmpty
      ? setTextError("Пароли не совпадают")
      : setTextError("");
  }, [value, input]);
  return textError;
};
export const useError = (type, input) => {
  const [textError, setTextError] = useState("");
  useEffect(() => {
    switch (type) {
      case EMAIL:
        input.isDirty && input.isEmpty
          ? setTextError("Заполните поле Email")
          : input.isDirty && input.emailError
          ? setTextError("Введите корректный Email")
          : setTextError("");
        break;
      case PASSWORD:
        input.isDirty && input.isEmpty
          ? setTextError("Заполните поле Password")
          : input.isDirty && input.minLengthError
          ? setTextError("Минимальная длинна пороля")
          : setTextError("");
        break;
      case LINK:
        input.isDirty && input.isEmpty
          ? setTextError("Заполните поле ввода")
          : input.isDirty && input.linkError
          ? setTextError("Введите корректную Ссылку")
          : setTextError("");
        break;
      default:
        input.isDirty && input.isEmpty
          ? setTextError("Заполните поле ввода")
          : setTextError("");
    }
  }, [input]);
  return textError;
};
