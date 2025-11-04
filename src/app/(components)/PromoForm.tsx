"use client";

import { useState, useRef } from "react";
import { getFormValidationErrors } from "../../ui/utils/get-form-validation-errors.util";
import TextInput from "../../ui/components/TextInput";
import SelectInput from "../../ui/components/SelectInput";
import Button from "../../ui/components/Button";
import { SubscribeData } from "@/interfaces/subscribe.interface";

export default function PromoForm() {
  const [form, setForm] = useState<SubscribeData>({ name: "", email: "", gender: null });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
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
      const request = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const response = await request.json();
      if (!request.ok) {
        console.error("Erro na resposta do servidor:", response);
        return;
      }

      setForm({ name: "", email: "", gender: null });
      setSubmitted(true);
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} className="w-full max-w-md flex flex-col gap-6 py-4" onSubmit={handleSubmit} noValidate>
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
        value={form.gender ?? ''}
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
