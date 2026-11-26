"use client";

import { BreederFields } from "@/components/auth/breeder-fields/BreederFields";
import { PersonalFields } from "@/components/auth/personal-fields/PersonalFields";
import { RegisterSuccess } from "@/components/auth/register-success/RegisterSuccess";
import { ToggleGroup } from "@/components/ui/toggle-group/ToggleGroup";
import { buttonClass, errorTextClass, pageTitleClass, panelClass } from "@/styles/theme";
import { ROLE_OPTIONS } from "./register-form.utils";
import { useRegisterForm } from "./useRegisterForm";

export function RegisterForm() {
  const { role, form, error, success, loading, setRole, setField, submit } = useRegisterForm();

  if (success) return <RegisterSuccess />;

  return (
    <div className={panelClass}>
      <h1 className={pageTitleClass}>Zarejestruj się</h1>
      <ToggleGroup options={ROLE_OPTIONS} value={role} onChangeAction={setRole} fullWidth className="mb-4" />
      <form onSubmit={submit} className="flex flex-col gap-3">
        <PersonalFields form={form} onChangeAction={setField} />
        {role === "BREEDER" && <BreederFields form={form} onChangeAction={setField} />}
        {error && <p className={errorTextClass}>{error}</p>}
        <button type="submit" disabled={loading} className={buttonClass()}>
          {loading ? "Tworzenie konta..." : "Zarejestruj się"}
        </button>
      </form>
    </div>
  );
}
