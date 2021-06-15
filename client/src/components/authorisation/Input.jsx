export const Input = (props) => {
  return (
    <div class="password">
      <input
        onChange={(e) => props.onChange(e)}
        onBlur={(e) => props.onBlur(e)}
        value={props.value}
        type={props.type}
        className={"input"}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
      />
    </div>
  );
};
