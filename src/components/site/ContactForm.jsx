/* Contact form with inline validation and loading, success and error states. */
import { CircleAlert, CircleCheck, Send } from "lucide-react";

import { Link } from "react-router-dom";

import Button from "@/components/ui/Button";
import { Field, TextArea, TextInput } from "@/components/ui/Field";
import { useSendMessage } from "@/store/tanstackStore/queries/site";
import useForm from "@/utils/useForm";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validate = (v) => {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Enter your name.";
  if (!EMAIL.test(v.email.trim())) e.email = "Enter a valid email address, for example name@gmail.com.";
  if (v.phone.trim() && !/^\+?[\d\s()]{9,16}$/.test(v.phone.trim())) e.phone = "Enter a phone number with digits only, or leave it empty.";
  if (v.message.trim().length < 10) e.message = "Tell us a little more, at least 10 characters.";
  return e;
};

export default function ContactForm() {
  const mutation = useSendMessage();
  const form = useForm({ id: "contact", initial: { name: "", email: "", phone: "", message: "" }, validate });

  if (mutation.isSuccess) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 py-4">
        <span className="grid size-12 place-items-center rounded-full bg-success-soft text-success">
          <CircleCheck aria-hidden="true" size={24} strokeWidth={1.75} />
        </span>
        <p className="text-h4">Message sent</p>
        <p className="max-w-[48ch] text-muted">Thank you for writing to GetDigital256. We will reply to {form.values.email} as soon as we can.</p>
        <Button
          variant="outline"
          onClick={() => {
            form.reset();
            mutation.reset();
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  const name = form.field("name");
  const email = form.field("email");
  const phone = form.field("phone");
  const message = form.field("message");

  return (
    <form noValidate onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="flex flex-col gap-5">
      {mutation.isError && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-error-soft p-4 text-small font-semibold text-error">
          <CircleAlert aria-hidden="true" size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          Your message did not send. Check your connection and try again.
        </p>
      )}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field field={name} label="Your name" required>
          <TextInput field={name} autoComplete="name" />
        </Field>
        <Field field={email} label="Email" required>
          <TextInput field={email} type="email" inputMode="email" autoComplete="email" placeholder="name@gmail.com" />
        </Field>
      </div>
      <Field field={phone} label="Phone" hint="Only if you would like a call back.">
        <TextInput field={phone} type="tel" inputMode="tel" autoComplete="tel" placeholder="0772 123 456" />
      </Field>
      <Field field={message} label="Message" required>
        <TextArea field={message} rows={5} />
      </Field>
      <Button type="submit" size="lg" icon={Send} loading={mutation.isPending} className="w-full sm:w-auto sm:self-start">
        {mutation.isPending ? "Sending" : "Send message"}
      </Button>
      <p className="text-small text-muted">
        We use your details only to reply to you. See our{" "}
        <Link to="/privacy" className="font-semibold text-link underline-offset-4 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
