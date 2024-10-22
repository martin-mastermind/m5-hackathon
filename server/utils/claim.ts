type ClaimAmountParams = {
  claimNumber: number;
  visualLvl: number;
  chassisLvl: number;
  brakesLvl: number;
  engineLvl: number;
};

export const getClaimAmount = ({
  claimNumber,
  visualLvl,
  chassisLvl,
  brakesLvl,
  engineLvl,
}: ClaimAmountParams) => {
  return (
    300 *
    (1 * (claimNumber + claimNumber * 0.1)) *
    (visualLvl * 1 + chassisLvl * 1.5 + brakesLvl * 2 + engineLvl * 3)
  );
};
