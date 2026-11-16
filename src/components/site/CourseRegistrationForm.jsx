/* Free AI course registration: validates on blur, focuses the first problem on submit,
   shows loading, success and error states. */
import { CircleAlert, CircleCheck, Send } from "lucide-react";

import { Link } from "react-router-dom";

import Button from "@/components/ui/Button";
import { Checkbox, Field, Select, TextInput } from "@/components/ui/Field";
import { useRegisterForCourse } from "@/store/tanstackStore/queries/site";
import useForm from "@/utils/useForm";

const ROLES = ["Student", "Teacher", "Small business owner", "Job seeker", "Working professional", "Other"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UG_PHONE = /^(\+?256|0)7\d{8}$/;

const validate = (v) => {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Enter your full name.";
  if (!UG_PHONE.test(v.phone.replace(/[\s()]/g, ""))) e.phone = "Enter a Ugandan mobile number, for example 0772 123 456.";
  if (!EMAIL.test(v.email.trim())) e.email = "Enter a valid email address, for example name@gmail.com.";
  if (v.town.trim().length < 2) e.town = "Enter your town or district.";
  if (!v.role) e.role = "Choose the option that describes you best.";
  if (!v.consent) e.consent = "Please agree so we can send you the course details.";
  return e;
};

export default function CourseRegistrationForm({ startLabel, onDone }) {
  const mutation = useRegisterForCourse();
  const form = useForm({
    id: "register",
    initial: { name: "", phone: "", email: "", town: "", role: "", consent: false },
    validate,
  });

  if (mutation.isSuccess) {
    return (
      <div role="status" className="flex flex-col items-start gap-4">
        <span className="grid size-12 place-items-center rounded-full bg-success-soft text-success">
          <CircleCheck aria-hidden="true" size={24} strokeWidth={1.75} />
        </span>
        <p className="text-h4">You are registered</p>
        <p className="text-muted">
          Thank you, {form.values.name.split(" ")[0]}. We have saved your place for the cohort that starts on {startLabel}. Watch your email
          and WhatsApp for the joining details.
        </p>
        <Button variant="outline" onClick={onDone}>
          Close
        </Button>
      </div>
    );
  }

  const name = form.field("name");
  const phone = form.field("phone");
  const email = form.field("email");
  const town = form.field("town");
  const role = form.field("role");
  const consent = form.field("consent");

  return (
    <form noValidate onSubmit={form.handleSubmit((values) => mutation.mutate({ ...values, phone: values.phone.replace(/\s/g, "") }))} className="flex flex-col gap-5">
      {mutation.isError && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-error-soft p-4 text-small font-semibold text-error">
          <CircleAlert aria-hidden="true" size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          We could not send your registration. Check your connection and try again.
        </p>
      )}
      <Field field={name} label="Full name" required>
        <TextInput field={name} autoComplete="name" />
      </Field>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field field={phone} label="Phone (WhatsApp)" hint="We send class reminders here." required>
          <TextInput field={phone} type="tel" inputMode="tel" autoComplete="tel" placeholder="0772 123 456" />
        </Field>
        <Field field={email} label="Email" required>
          <TextInput field={email} type="email" inputMode="email" autoComplete="email" placeholder="name@gmail.com" />
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field field={town} label="Town or district" required>
          <TextInput field={town} autoComplete="address-level2" placeholder="Lira" />
        </Field>
        <Field field={role} label="I am a" required>
          <Select field={role} options={ROLES} />
        </Field>
      </div>
      <Checkbox field={consent}>
        I agree that GetDigital256 can contact me about this course by email, SMS or WhatsApp, and share my name and email with Cyberiad Labs for my course link. See our{" "}
        <Link to="/privacy" target="_blank" className="font-semibold text-link underline-offset-4 hover:underline">
          Privacy Policy
        </Link>
        .
      </Checkbox>
      <Button type="submit" size="lg" icon={Send} loading={mutation.isPending} className="w-full sm:w-auto sm:self-start">
        {mutation.isPending ? "Sending" : "Register for free"}
      </Button>
    </form>
  );
}
