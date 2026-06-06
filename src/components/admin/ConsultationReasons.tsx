import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, X, Check } from "lucide-react";
import { ConsultationReason } from "@/types/consultationReason";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Trash } from "lucide-react";
import {
  Control,
  FieldValues,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ConsultationReasonsProps {
  name?: string;
  control?: Control<FieldValues>;
}

export default function ConsultationReasons({
  name = "consultationReasons",
}: ConsultationReasonsProps) {
  const { t } = useLanguage();
  const {
    control,
    watch: consultationReasonsWatch,
    setValue,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    keyName: "originalId",
  });

  const reasons = consultationReasonsWatch(name) || [];

  const [newReason, setNewReason] = useState<ConsultationReason>({
    name: "",
    duration: 30,
    tempId: new Date().getTime().toString(),
    color: "#546384",
    type: "appointment",
    active: true,
  });

  const addReason = () => {
    append(newReason);
    setNewReason({
      name: "",
      duration: 30,
      tempId: new Date().getTime().toString(),

      color: "#546384",
      type: "appointment",
      active: true,
    });
  };

  const toggleActive = (
    active: boolean,
    id?: number | string,
    tempId?: string,
  ) => {
    const index = fields.findIndex(
      (field) =>
        (id && field.id === id) || (tempId && (field as any).tempId === tempId),
    );

    if (index !== -1) {
      // Utilisez setValue au lieu de update
      setValue(`${name}.${index}.active` as any, !active);
    }
  };

  const toggleEdit = (
    isEditing: boolean,
    id: number | string,
    tempId?: string,
  ) => {
    const index = fields.findIndex(
      (field) =>
        (id && field.id === id) || (tempId && (field as any).tempId === tempId),
    );

    if (index !== -1) {
      setValue(`${name}.${index}.isEditing` as any, isEditing);
    }
  };

  const edit = (
    id: number | string,
    tempId?: string,
    updates: Partial<ConsultationReason> = {},
  ) => {
    const index = fields.findIndex(
      (field) =>
        (id && field.id === id) || (tempId && (field as any).tempId === tempId),
    );

    if (index !== -1) {
      const currentValue = fields[index] as unknown as ConsultationReason;
      // Conserve la valeur actuelle de isEditing si elle n'est pas dans les mises à jour
      const updatedValue = {
        ...currentValue,
        ...updates,
        // Si isEditing n'est pas dans les updates, on garde la valeur actuelle
        isEditing: true,
      };

      setValue(`${name}.${index}` as any, updatedValue);
    }
  };

  const deleteReason = (reason: ConsultationReason) => {
    const index = fields.findIndex(
      (field) =>
        (reason.id && field.id === reason.id) ||
        (reason.tempId && (field as any).tempId === reason.tempId),
    );

    if (index !== -1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 mt-8">
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="col-span-3 lg:col-span-2 space-y-2">
            <Label
              htmlFor="reason-name"
              className="text-sm font-medium mb-1 block"
            >
              {t.doctorParams.reasonForm.name}
            </Label>
            <Input
              value={newReason.name}
              onChange={(e) =>
                setNewReason({ ...newReason, name: e.target.value })
              }
              placeholder={t.doctorParams.reasonForm.namePlaceholder}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="reason-duration"
              className="text-sm font-medium mb-1 block"
            >
              {t.doctorParams.reasonForm.duration}
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
              placeholder={t.doctorParams.reasonForm.duration}
              className="w-full"
              min="5"
              step="5"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="reason-color"
              className="text-sm font-medium mb-1 block"
            >
              {t.doctorParams.reasonForm.color}
            </Label>
            <Input
              type="color"
              value={newReason.color}
              onChange={(e) =>
                setNewReason({ ...newReason, color: e.target.value })
              }
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="reason-type"
              className="text-sm font-medium mb-1 block"
            >
              {t.doctorParams.reasonForm.type}
            </Label>
            <Select
              value={newReason.type}
              onValueChange={(value) =>
                setNewReason({
                  ...newReason,
                  type: value as "appointment" | "absence",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appointment">
                  {t.doctorParams.reasonForm.consultation}
                </SelectItem>
                <SelectItem value="absence">
                  {t.doctorParams.reasonForm.absence}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            className="mt-4"
            type="button"
            onClick={addReason}
            disabled={!newReason.name.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.common.add}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t.doctorParams.reasonTitle}</h3>
        {reasons.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t.doctorParams.noReaasons}
          </p>
        ) : (
          <div className="space-y-2">
            {reasons.map((reason) => (
              <div
                key={reason.id || reason.tempId}
                className="grid grid-cols-3 lg:grid-cols-7 gap-6 p-2 border rounded-lg"
              >
                {reason.isEditing ? (
                  <>
                    <div className="col-span-3">
                      <Label
                        htmlFor="reason-name"
                        className="text-sm font-medium mb-1 block"
                      >
                        {t.doctorParams.reasonForm.name}
                      </Label>
                      <Input
                        value={reason.name}
                        onChange={(e) =>
                          edit(reason.id, reason.tempId, {
                            name: e.target.value,
                          })
                        }
                        className="flex-1"
                      />
                    </div>
                    <div className="col-span-1">
                      <Label
                        htmlFor="reason-duration"
                        className="text-sm font-medium mb-1 block"
                      >
                        {t.doctorParams.reasonForm.duration}
                      </Label>
                      <Input
                        type="number"
                        value={reason.duration}
                        onChange={(e) =>
                          edit(reason.id, reason.tempId, {
                            duration: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-24"
                        min="5"
                        step="5"
                      />
                    </div>
                    <div className="col-span-1">
                      <Label
                        htmlFor="reason-color"
                        className="text-sm font-medium mb-1 block"
                      >
                        {t.doctorParams.reasonForm.color}
                      </Label>
                      <Input
                        type="color"
                        value={reason.color}
                        onChange={(e) =>
                          edit(reason.id, reason.tempId, {
                            color: e.target.value,
                          })
                        }
                        className="w-24"
                      />
                    </div>
                    <div className="col-span-1">
                      <Label
                        htmlFor="reason-type"
                        className="text-sm font-medium mb-1 block"
                      >
                        {t.doctorParams.reasonForm.type}
                      </Label>
                      <Select
                        value={reason.type}
                        onValueChange={(value) =>
                          edit(reason.id, reason.tempId, {
                            type: value as "appointment" | "absence",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t.doctorParams.reasonForm.type}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appointment">
                            {t.doctorParams.reasonForm.consultation}
                          </SelectItem>
                          <SelectItem value="absence">
                            {t.doctorParams.reasonForm.absence}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3 lg:col-span-1 flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          toggleEdit(false, reason.id!, reason.tempId)
                        }
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-3 my-auto">{reason.name}</div>
                    <div className="col-span-1 text-sm my-auto text-muted-foreground">
                      {reason.duration} {t.doctorParams.minutes}
                    </div>
                    <div className="col-span-1 text-sm my-auto">
                      <div
                        className="w-4 h-4 rounded-full mx-auto"
                        style={{ backgroundColor: reason.color }}
                      />
                    </div>
                    <div className="col-span-1 text-sm my-auto text-muted-foreground mx-auto">
                      {reason.type === "appointment"
                        ? t.doctorParams.reasonForm.consultation
                        : t.doctorParams.reasonForm.absence}
                    </div>
                    <div className="col-span-3 lg:col-span-1 flex justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) =>
                          toggleEdit(true, reason.id!, reason.tempId)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          toggleActive(reason.active, reason.id, reason.tempId)
                        }
                        title={
                          reason.active === false
                            ? t.common.activate
                            : t.common.deactivate
                        }
                        className="mx-1"
                      >
                        {reason.active === false ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteReason(reason)}
                        title={
                          reason.active === false
                            ? t.common.activate
                            : t.common.deactivate
                        }
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
