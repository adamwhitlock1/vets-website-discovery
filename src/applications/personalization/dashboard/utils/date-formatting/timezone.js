import timezones from './timezones.json';
import vaosTimeZones from './vaos-timezones.json';

export const stripDST = abbr => {
  if (/^[PMCE][DS]T$/.test(abbr)) {
    return abbr?.replace('ST', 'T').replace('DT', 'T');
  }

  return abbr;
};

export const getTimezoneBySystemId = id =>
  timezones.find(z => z.id === `dfn-${id}`);

export const getVATimeZone = id => {
  const matchingZone = getTimezoneBySystemId(id);

  if (!matchingZone) {
    return null;
  }

  let abbreviation = matchingZone.currentTZ;

  // Strip out middle char in abbreviation so we can ignore DST
  if (matchingZone.timezone.includes('America')) {
    abbreviation = stripDST(abbreviation);
  }

  return abbreviation;
};

export const getCCTimeZone = appointment => {
  const zoneSplit = appointment.attributes?.timeZone.split(' ');
  return stripDST(zoneSplit[1]);
};

export function getTimezoneByFacilityId(id) {
  if (!id) {
    return null;
  }

  if (vaosTimeZones[id]) {
    return vaosTimeZones[id];
  }

  return vaosTimeZones[id.substr(0, 3)];
}

export function getTimezoneAbbrByFacilityId(id) {
  return getVATimeZone(id);
}

const TIMEZONE_LABELS = {
  PHT: 'Philippine time',
  ET: 'Eastern time',
  CT: 'Central time',
  MT: 'Mountain time',
  PT: 'Pacific time',
  AKT: 'Alaska time',
};

export function getTimezoneNameFromAbbr(abbreviation) {
  const label = TIMEZONE_LABELS[abbreviation];

  if (label) {
    return label;
  }

  return abbreviation;
}

export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getUserTimezoneAbbr() {
  const zone = new Date()
    .toLocaleTimeString('en-us', { timeZoneName: 'short' })
    .split(' ')[2];
  return stripDST(zone);
}