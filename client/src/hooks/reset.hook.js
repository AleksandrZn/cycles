export const useReset = (inputs) => {
  inputs.map((input) => {
    input.setValue("");
    input.setDirty(false);
  });
};
