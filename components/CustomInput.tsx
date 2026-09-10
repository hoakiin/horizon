import { Control, FieldPath } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "./ui/field";
import { Input } from "./ui/input";
import z from "zod";
import { authFormSchema } from "@/lib/utils";

type FormSchema = ReturnType<typeof authFormSchema>;

interface CustomInput {
  control: Control<z.infer<FormSchema>>;
  name: FieldPath<z.infer<FormSchema>>;
  label: string;
  placeholder: string;
  format?: "date";
}

function formatDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const parts: string[] = [];
  if (digits.length > 0) parts.push(digits.slice(0, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 6));
  if (digits.length > 6) parts.push(digits.slice(6, 8));
  return parts.join("-");
}

function CustomInput({ control, name, label, placeholder, format }: CustomInput) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="form-item">
          <FieldLabel className="form-label">{label}</FieldLabel>
          <div className="flex w-full flex-col">
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete={name === "password" ? "new-password" : "off"}
              className="input-class"
              type={name === "password" ? "password" : "text"}
              onChange={(e) => {
                const raw = e.target.value;
                field.onChange(format === "date" ? formatDate(raw) : raw);
              }}
            />
          </div>

          {fieldState.invalid && (
            <FieldError
              errors={[fieldState.error]}
              className="form-message mt-2"
            />
          )}
        </Field>
      )}
    />
  );
}

export default CustomInput;
