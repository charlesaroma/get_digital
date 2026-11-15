/* Joins class names, skipping empty values. */
export const cn = (...parts) => parts.filter(Boolean).join(" ");
