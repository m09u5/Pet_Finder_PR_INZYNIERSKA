import type { ReactNode } from "react";
import type { PublicAnimal } from "@pet-finder/shared";

export interface AnimalDetailsProps {
  animal: PublicAnimal;
  headerAction?: ReactNode;
  children?: ReactNode;
}
