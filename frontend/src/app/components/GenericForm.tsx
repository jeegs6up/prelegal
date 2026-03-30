"use client";

import { DocumentFields, FieldDefinition } from "../types";

interface GenericFormProps {
  fields: FieldDefinition[];
  values: DocumentFields;
  onChange: (values: DocumentFields) => void;
  documentName: string;
}

export default function GenericForm({
  fields,
  values,
  onChange,
  documentName,
}: GenericFormProps) {
  function update(name: string, value: string) {
    onChange({ ...values, [name]: value });
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-dark-navy">{documentName}</h2>
      {fields.map((field) => {
        if (field.type === "radio" && field.options) {
          return (
            <fieldset key={field.name} className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-dark-navy">
                {field.label}
              </legend>
              {field.options.map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={field.name}
                    checked={(values[field.name] || field.default) === opt}
                    onChange={() => update(field.name, opt)}
                  />
                  {opt}
                </label>
              ))}
            </fieldset>
          );
        }
        if (field.type === "textarea") {
          return (
            <label key={field.name} className="flex flex-col gap-1">
              <span className="text-sm font-medium text-dark-navy">
                {field.label}
              </span>
              <textarea
                rows={2}
                value={values[field.name] ?? field.default}
                onChange={(e) => update(field.name, e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
              />
            </label>
          );
        }
        return (
          <label key={field.name} className="flex flex-col gap-1">
            <span className="text-sm font-medium text-dark-navy">
              {field.label}
            </span>
            <input
              type={field.type === "date" ? "date" : "text"}
              value={values[field.name] ?? field.default}
              onChange={(e) => update(field.name, e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
            />
          </label>
        );
      })}
    </div>
  );
}
