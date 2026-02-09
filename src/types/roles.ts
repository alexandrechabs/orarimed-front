// src/types/roles.ts
export enum UserRole {
  PATIENT = 1,
  DOCTOR = 2,
  SECRETARY = 3,
  ADMIN = 4,
}

// Fonction utilitaire pour afficher le libellé du rôle
export function getRoleLabel(roleId: number): string {
  const labels: Record<number, string> = {
    [UserRole.PATIENT]: 'Patient',
    [UserRole.DOCTOR]: 'Médecin',
    [UserRole.SECRETARY]: 'Secrétaire',
    [UserRole.ADMIN]: 'Administrateur',
  };
  return labels[roleId] || `Inconnu (${roleId})`;
}

// Fonction utilitaire pour obtenir la liste des rôles
export function getAvailableRoles() {
  return [
    { id: UserRole.PATIENT, label: 'Patient' },
    { id: UserRole.DOCTOR, label: 'Médecin' },
    { id: UserRole.SECRETARY, label: 'Secrétaire' },
    { id: UserRole.ADMIN, label: 'Administrateur' },
  ];
}
