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
}

function CustomInput({ control, name, label, placeholder }: CustomInput) {
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
              autoComplete="off"
              className="input-class"
              type={name === "password" ? "password" : "text"}
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
