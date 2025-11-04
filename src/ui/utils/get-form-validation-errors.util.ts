export function getFormValidationErrors(formEl: HTMLFormElement): { [key: string]: string } {
  const newErrors: { [key: string]: string } = {};
  if (!formEl.checkValidity()) {
    Array.from(formEl.elements).forEach((el) => {
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement
      ) {
        if (!el.validity.valid) {
          newErrors[el.name] = el.validationMessage;
        }
      }
    });
  }
  return newErrors;
}
