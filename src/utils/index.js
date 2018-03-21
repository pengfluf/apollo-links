export function handleChangeInput(fieldName, value, setState) {
  setState({
    [fieldName]: value,
  });
}
