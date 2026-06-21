import { cards } from '../data/cards.js';

export function getCurrentQuarter() {
  const now = new Date();
  const q = Math.ceil((now.getMonth() + 1) / 3);
  return `${now.getFullYear()}-Q${q}`;
}

export function getBestCards(category, currentQuarter) {
  if (!category) return [];

  const candidates = cards.map((card) => {
    let rate = card.fixedBenefits[category]?.rate
      || card.fixedBenefits.other?.rate
      || 1;
    let unit = card.fixedBenefits[category]?.unit
      || card.fixedBenefits.other?.unit
      || 'x';
    let reason = card.fixedBenefits[category]?.label
      || card.fixedBenefits.other?.label
      || 'Base rate';
    let isRotating = false;

    const rotation = card.rotating[currentQuarter];
    if (rotation && rotation.categories.includes(category)) {
      rate = rotation.rate;
      unit = rotation.unit;
      reason = rotation.label;
      isRotating = true;
    }

    const effectiveValue = unit === 'x'
      ? rate * card.pointValue * 100
      : rate;

    return {
      cardId: card.id,
      cardName: card.name,
      shortName: card.shortName,
      color: card.color,
      rate,
      unit,
      reason,
      isRotating,
      effectiveValue,
      pointSystem: card.pointSystem,
    };
  });

  return candidates.sort((a, b) => b.effectiveValue - a.effectiveValue);
}

export function getRotatingInfo(currentQuarter) {
  return cards
    .filter((card) => card.rotating[currentQuarter])
    .map((card) => ({
      cardId: card.id,
      cardName: card.name,
      shortName: card.shortName,
      color: card.color,
      rotation: card.rotating[currentQuarter],
    }));
}
