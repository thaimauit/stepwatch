export const checkEmailValid = email => {
  const emailCheck =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
  return emailCheck.test(email);
};

export const delay = (ms = 0) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const rad = x => {
  return (x * Math.PI) / 180;
};
export const getDistance = (p1, p2) => {
  if (!p1 && !p2) return null;

  const R = 6378137; // Earth’s mean radius in meter
  const dLat = rad(p2.latitude - p1.latitude);
  const dLong = rad(p2.longitude - p1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.latitude)) *
      Math.cos(rad(p2.latitude)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d; // returns the distance in meter
};

export const shuffleArray = array => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const parseNumber = numberString => {
  const validNumberString = (
    typeof numberString === 'string' ? numberString : numberString + ''
  ).replace(',', '.');
  const result = Number(validNumberString);
  return result;
};

export const parseNumberWithResult = numberString => {
  if (!numberString) return { valid: false };
  const validNumberString = (
    typeof numberString === 'string' ? numberString : numberString + ''
  ).replace(',', '.');
  if (isNaN(validNumberString)) return { valid: false };
  const result = Number(validNumberString);
  return { valid: true, value: result };
};
