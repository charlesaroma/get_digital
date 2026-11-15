/* Small form state hook: values, validation on blur, errors after a submit attempt,
   and focus on the first invalid field. */
import { useState } from "react";

export default function useForm({ id, initial, validate }) {
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const errors = validate(values);

  const errorOf = (name) => ((touched[name] || submitted) && errors[name]) || undefined;
  const fieldId = (name) => `${id}-${name}`;

  const field = (name) => {
    const error = errorOf(name);
    return {
      id: fieldId(name),
      name,
      error,
      inputProps: {
        id: fieldId(name),
        name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? `${fieldId(name)}-error` : `${fieldId(name)}-hint`,
        onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
        onChange: (e) => {
          const { type, checked, value } = e.target;
          setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
        },
        ...(typeof initial[name] === "boolean" ? { checked: values[name] } : { value: values[name] }),
      },
    };
  };

  const handleSubmit = (onValid) => (e) => {
    e.preventDefault();
    setSubmitted(true);
    const first = Object.keys(errors)[0];
    if (first) {
      document.getElementById(fieldId(first))?.focus();
      return;
    }
    onValid(values);
  };

  const reset = () => {
    setValues(initial);
    setTouched({});
    setSubmitted(false);
  };

  return { values, field, handleSubmit, reset };
}
