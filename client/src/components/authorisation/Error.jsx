export const Error = (props) => {
  return (
    props.textError && <span className="reg_auth_error">{props.textError}</span>
  );
};
