import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Pencil, X, Check } from 'lucide-react';
import { useAuth } from '@/services/auth/useAuth';
import { ConsultationReason } from '@/types/consultationReason';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';

export default function ConsultationReasons() {
  const { getReasons, saveReasons } = useAuth();
  const [reasons, setReasons] = useState<ConsultationReason[]>([]);
  const [newReason, setNewReason] = useState<ConsultationReason>({
    name: '',
    duration: 30,
    tempId: new Date().getTime().toString(),
    color: '#546384',
    type: 'appointment',
    active: true,
  });

  useEffect(() => {
    getReasons().then((result) => {
      setReasons(result);
    });
  }, []);

  const addReason = () => {
    setReasons([...reasons, newReason]);
    setNewReason({
      name: '',
      duration: 30,
      tempId: new Date().getTime().toString(),

      color: '#546384',
      type: 'appointment',
      active: true,
    });
  };

  const toggleActive = (id?: number, tempId?: string) => {
    setReasons(
      reasons.map((reason) =>
        (id !== undefined && reason.id === id) ||
        (tempId && reason.tempId === tempId)
          ? { ...reason, active: !reason.active }
          : reason,
      ),
    );
  };

  const toggleEdit = (id: number | string, tempId?: string) => {
    console.log(id);
    setReasons(
      reasons.map((reason) => {
        const isTargetReason =
          (id !== undefined && reason.id === id) ||
          (tempId && reason.tempId === tempId);

        return {
          ...reason,
          isEditing: isTargetReason ? !reason.isEditing : false,
        };
      }),
    );
  };

  const save = () => {
    saveReasons(reasons).then((result) => {
      setReasons(result);
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 mt-8">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label
              htmlFor="reason-name"
              className="text-sm font-medium mb-1 block"
            >
              Nom du motif
            </Label>
            <Input
              value={newReason.name}
              onChange={(e) =>
                setNewReason({ ...newReason, name: e.target.value })
              }
              placeholder="Nom du motif"
              className="flex-1"
            />
          </div>
          <div className="w-32">
            <Label
              htmlFor="reason-duration"
              className="text-sm font-medium mb-1 block"
            >
              Durée (min)
            </Label>
            <Input
              type="number"
              value={newReason.duration}
              onChange={(e) =>
                setNewReason({
                  ...newReason,
                  duration: parseInt(e.target.value) || 0,
                })
              }
              placeholder="Durée (min)"
              className="w-24"
              min="5"
              step="5"
            />
          </div>

          <div className="w-32">
            <Label
              htmlFor="reason-color"
              className="text-sm font-medium mb-1 block"
            >
              Couleur
            </Label>
            <Input
              type="color"
              value={newReason.color}
              onChange={(e) =>
                setNewReason({ ...newReason, color: e.target.value })
              }
              className="w-24"
            />
          </div>
          <div className="w-32">
            <Label
              htmlFor="reason-type"
              className="text-sm font-medium mb-1 block"
            >
              Type
            </Label>
            <Select
              value={newReason.type}
              onValueChange={(value) =>
                setNewReason({
                  ...newReason,
                  type: value as 'appointment' | 'absence',
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appointment">Consultation</SelectItem>
                <SelectItem value="absence">Absence</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              onClick={addReason}
              disabled={!newReason.name.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Mes motifs de consultation</h3>
        {reasons.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun motif de consultation défini
          </p>
        ) : (
          <div className="space-y-2">
            {reasons.map((reason) => (
              <div
                key={reason.id || reason.tempId}
                className="flex items-center gap-2 p-2 border rounded-lg"
              >
                {reason.isEditing ? (
                  <>
                    <div className="flex-1">
                      <Label
                        htmlFor="reason-name"
                        className="text-sm font-medium mb-1 block"
                      >
                        Nom
                      </Label>
                      <Input
                        value={reason.name}
                        onChange={(e) =>
                          setReasons(
                            reasons.map((r) =>
                              r.id === reason.id
                                ? { ...r, name: e.target.value }
                                : r,
                            ),
                          )
                        }
                        className="flex-1"
                      />
                    </div>
                    <div className="w-32">
                      <Label
                        htmlFor="reason-duration"
                        className="text-sm font-medium mb-1 block"
                      >
                        Durée
                      </Label>
                      <Input
                        type="number"
                        value={reason.duration}
                        onChange={(e) =>
                          setReasons(
                            reasons.map((r) =>
                              r.id === reason.id
                                ? {
                                    ...r,
                                    duration: parseInt(e.target.value) || 0,
                                  }
                                : r,
                            ),
                          )
                        }
                        className="w-24"
                        min="5"
                        step="5"
                      />
                    </div>
                    <div className="w-32">
                      <Label
                        htmlFor="reason-color"
                        className="text-sm font-medium mb-1 block"
                      >
                        Couleur
                      </Label>
                      <Input
                        type="color"
                        value={reason.color}
                        onChange={(e) =>
                          setReasons(
                            reasons.map((r) =>
                              r.id === reason.id
                                ? { ...r, color: e.target.value }
                                : r,
                            ),
                          )
                        }
                        className="w-24"
                      />
                    </div>
                    <div className="w-32">
                      <Label
                        htmlFor="reason-type"
                        className="text-sm font-medium mb-1 block"
                      >
                        Type
                      </Label>
                      <Select
                        value={reason.type}
                        onValueChange={(value) =>
                          setReasons(
                            reasons.map((r) =>
                              r.id === reason.id
                                ? {
                                    ...r,
                                    type: value as 'appointment' | 'absence',
                                  }
                                : r,
                            ),
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appointment">
                            Consultation
                          </SelectItem>
                          <SelectItem value="absence">Absence</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleEdit(reason.id!, reason.tempId)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">{reason.name}</div>
                    <div className="w-24 text-sm text-muted-foreground">
                      {reason.duration} minutes
                    </div>
                    <div className="w-32 text-sm">
                      <div
                        className="w-4 h-4 rounded-full mx-auto"
                        style={{ backgroundColor: reason.color }}
                      />
                    </div>
                    <div className="w-24 text-sm text-muted-foreground mx-auto">
                      {reason.type}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleEdit(reason.id!, reason.tempId)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleActive(reason.id, reason.tempId)}
                      title={reason.active === false ? 'Activer' : 'Désactiver'}
                    >
                      {reason.active === false ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Button type="button" onClick={save}>
        <Plus className="h-4 w-4 mr-2" />
        Enregistrer
      </Button>
    </div>
  );
}
