import { Plan } from 'src/app/shared/models';

/**
 * Insurance premium calculation, shared by every quote view.
 *
 *   primaAnual     = max(valorVehículo × tasa%, primaMínima)
 *   primaAlContado = primaAnual × (1 − descuento%)
 *   primaACredito  = primaAlContado × (1 + interés%)
 *
 * The backend computes the same primaAnual on `plans/search` results and returns
 * it as `plan.price`; that value is used as a fallback when the vehicle value is
 * not available (e.g. a plan opened outside the quote stepper flow).
 */

type PlanLike = Partial<Pick<Plan, 'minimumPremium' | 'rate' | 'discount' | 'interest' | 'price'>> | null | undefined;

/** Annual premium: sum insured × rate, floored at the plan's minimum premium. */
export function primaAnual(plan: PlanLike, vehicleValue?: number | null): number {
  const min = Number(plan?.minimumPremium) || 0;
  const rate = Number(plan?.rate) || 0;
  const value = Number(vehicleValue) || 0;

  if (value > 0) return Math.max((value * rate) / 100, min);

  const backendPrice = Number(plan?.price);
  return backendPrice > 0 ? backendPrice : min;
}

/** Cash premium: annual premium less the commercial discount. */
export function primaAlContado(plan: PlanLike, vehicleValue?: number | null): number {
  const discount = Number(plan?.discount) || 0;
  return primaAnual(plan, vehicleValue) * (1 - discount / 100);
}

/** Credit premium: cash premium plus the financing surcharge. */
export function primaACredito(plan: PlanLike, vehicleValue?: number | null): number {
  const interest = Number(plan?.interest) || 0;
  return primaAlContado(plan, vehicleValue) * (1 + interest / 100);
}
