
import { emergencyAlerts } from '../data/mockData';

const STORAGE_KEY = 'resortClinicEmergencyAlerts';

export function getEmergencyAlerts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error('Could not load emergency alerts:', error);
  }

  // Keep the existing demo alerts and convert their old statuses.
  return emergencyAlerts.map((alert) => ({
    ...alert,
    description: alert.description || alert.details || '',
    status:
      alert.status === 'Resolved' ? 'Completed' : 'Sent',
  }));
}

export function saveEmergencyAlerts(alerts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}
