export interface ConsultationReason {
  id?: number;
  name: string;
  duration: number;
  isEditing?: boolean;
  active?: boolean;
  color: string;
  type: 'appointment' | 'absence';
  tempId?: string;
}
