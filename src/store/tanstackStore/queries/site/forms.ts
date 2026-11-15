/* Form submissions from the public site */
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../../services/content/messagesApi";
import { registerForCourse } from "../../services/content/registrationsApi";

export const useSendMessage = () => useMutation({ mutationFn: sendMessage });
export const useRegisterForCourse = () => useMutation({ mutationFn: registerForCourse });
