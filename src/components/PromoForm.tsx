"use client";

import { useState, useRef } from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import Button from "./Button";
import { getFormValidationErrors } from "../utils/getFormValidationErrors";

export default function PromoForm() {
  const [form, setForm] = useState({ name: "", email: "", gender: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const formEl = formRef.current;
    const newErrors = formEl ? getFormValidationErrors(formEl) : {};
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {  
      return;
    }

    setLoading(true);
    try {
      // TODO: integração
      setForm({ name: "", email: "", gender: "" });
      setSubmitted(true);
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} className="w-full max-w-md flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <TextInput
        label="Nome"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        error={errors.name}
      />
      <TextInput
        label="E-mail"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
        error={errors.email}
      />
      <SelectInput
        label="Gênero"
        name="gender"
        value={form.gender}
        onChange={handleChange}
        required
        error={errors.gender}
        options={[
          { value: "male", label: "Masculino" },
          { value: "female", label: "Feminino" },
          { value: "other", label: "Outro" },
        ]}
      />
      <Button type="submit" loading={loading}>
        Quero Receber Ofertas!
      </Button>
      {submitted && (
        <div className="mt-6 text-green-600 font-semibold text-center">
          Cadastro realizado com sucesso! Aguarde nossas ofertas ;)
        </div>
      )}
    </form>
  );
}
