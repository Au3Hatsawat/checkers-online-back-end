export function calculateElo(
  ratingA: number,
  ratingB: number,
  scoreA: number,
  kFactor: number = 32
): { newA: number; newB: number } {
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 / (1 + Math.pow(10, (ratingA - ratingB) / 400));

  const newA = Math.round(ratingA + kFactor * (scoreA - expectedA));
  const newB = Math.round(ratingB + kFactor * ((1 - scoreA) - expectedB));

  return { newA, newB };
}