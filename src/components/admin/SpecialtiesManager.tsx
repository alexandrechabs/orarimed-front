import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { Speciality, SubSpeciality, Locale } from '@/types/specialty';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as LucideIcons from 'lucide-react';

const LUCIDE_ICONS = [
  'Stethoscope',
  'Heart',
  'Activity',
  'Baby',
  'Bone',
  'Brain',
  'Ear',
  'Eye',
  'FlaskConical',
  'HeartPulse',
  'Hospital',
  'Pill',
  'Scissors',
  'Syringe',
  'Teeth',
  'Thermometer',
  'Utensils',
  'User',
  'Users',
] as const;

const COLOR_PALETTE = [
  'from-blue-500 to-blue-600',
  'from-red-500 to-red-600',
  'from-pink-500 to-pink-600',
  'from-yellow-500 to-yellow-600',
  'from-purple-500 to-purple-600',
  'from-orange-500 to-orange-600',
  'from-indigo-500 to-indigo-600',
  'from-green-500 to-green-600',
  'from-cyan-500 to-cyan-600',
  'from-teal-500 to-teal-600',
  'from-sky-500 to-sky-600',
  'from-emerald-500 to-emerald-600',
] as const;

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'al', label: 'AL' },
];

interface Props {
  initialData?: Speciality[];
  onSave?: (data: Speciality[]) => void | Promise<void>;
}

export default function SpecialitiesManager({
  initialData = [],
  onSave,
}: Props) {
  const [specialities, setSpecialities] = useState<Speciality[]>(initialData);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeLocale, setActiveLocale] = useState<Locale>('en');

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

  /* -----------------------------
     SPECIALITY
  ------------------------------ */

  const addSpeciality = () => {
    setSpecialities((prev) => [
      ...prev,
      {
        slug: '',
        translations: LOCALES.map((l) => ({
          locale: l.code,
          name: '',
        })),
        subSpecialities: [],
        icon: 'Stethoscope', // Icône par défaut
        color: '#339991', // Couleur par défaut (bleu)
      },
    ]);
    setExpanded(specialities.length);
  };

  const updateSpecialityName = (
    index: number,
    locale: Locale,
    value: string,
  ) => {
    const copy = [...specialities];
    const translation = copy[index].translations.find(
      (t) => t.locale === locale,
    );

    if (translation) {
      translation.name = value;

      if (locale === 'en') {
        copy[index].slug = slugify(value);
      }
    }

    setSpecialities(copy);
  };

  /* -----------------------------
     SUB SPECIALITY
  ------------------------------ */

  const addSubSpeciality = (specIndex: number) => {
    const copy = [...specialities];
    copy[specIndex].subSpecialities.push({
      slug: '',
      translations: LOCALES.map((l) => ({
        locale: l.code,
        name: '',
      })),
    });
    setSpecialities(copy);
  };

  const updateSubSpecialityName = (
    specIndex: number,
    subIndex: number,
    locale: Locale,
    value: string,
  ) => {
    const copy = [...specialities];
    const sub = copy[specIndex].subSpecialities[subIndex];
    const translation = sub.translations.find((t) => t.locale === locale);

    if (translation) {
      translation.name = value;

      if (locale === 'en') {
        sub.slug = slugify(value);
      }
    }

    setSpecialities(copy);
  };

  /* -----------------------------
     REMOVE
  ------------------------------ */

  const removeSpeciality = (index: number) => {
    setSpecialities((prev) => prev.filter((_, i) => i !== index));
    if (expanded === index) setExpanded(null);
  };

  const removeSubSpeciality = (specIndex: number, subIndex: number) => {
    const copy = [...specialities];
    copy[specIndex].subSpecialities.splice(subIndex, 1);
    setSpecialities(copy);
  };

  /* -----------------------------
     RENDER
  ------------------------------ */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des spécialités</h2>
        <Button onClick={addSpeciality}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une spécialité
        </Button>
      </div>

      {/* LANG SELECT */}
      <div className="flex gap-2">
        {LOCALES.map((l) => (
          <Button
            key={l.code}
            variant={activeLocale === l.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveLocale(l.code)}
          >
            {l.label}
          </Button>
        ))}
      </div>

      {/* LIST */}
      {specialities.map((spec, index) => {
        const currentTranslation = spec.translations.find(
          (t) => t.locale === activeLocale,
        );

        return (
          <Card key={index}>
            <CardHeader
              className="cursor-pointer"
              onClick={() => setExpanded(expanded === index ? null : index)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {expanded === index ? <ChevronUp /> : <ChevronDown />}
                  <div className="space-y-2">
                    <Select
                      value={spec.icon || 'Stethoscope'}
                      onValueChange={(value) => {
                        const copy = [...specialities];
                        copy[index].icon = value;
                        setSpecialities(copy);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une icône" />
                      </SelectTrigger>
                      <SelectContent>
                        {LUCIDE_ICONS.map((iconName) => {
                          const Icon = spec.icon
                            ? (LucideIcons as any)[spec.icon]
                            : LucideIcons[iconName as keyof typeof LucideIcons];
                          return (
                            <SelectItem key={iconName} value={iconName}>
                              <div className="flex items-center gap-2">
                                {Icon && <Icon className="h-4 w-4" />}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Select
                      value={spec.color || COLOR_PALETTE[0]}
                      onValueChange={(value) => {
                        const copy = [...specialities];
                        copy[index].color = value;
                        setSpecialities(copy);
                      }}
                    >
                      <SelectTrigger className="w-[70px]">
                        <div
                          className={`${spec.color || COLOR_PALETTE[0]} bg-gradient-to-br h-5 w-5 rounded-full`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="grid grid-cols-6 gap-2 p-2 w-[240px]">
                          {COLOR_PALETTE.map((color) => (
                            <SelectItem
                              key={color}
                              value={color}
                              className="flex items-center justify-center p-2"
                            >
                              <div
                                className={`h-6 w-6 rounded-full border border-gray-200 bg-gradient-to-br ${color} `}
                              />
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="font-medium">
                    {currentTranslation?.name || 'Nouvelle spécialité'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSpeciality(index);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>

            {expanded === index && (
              <CardContent className="space-y-4">
                {/* NAME */}
                <div>
                  <Label>Nom ({activeLocale.toUpperCase()})</Label>
                  <Input
                    value={currentTranslation?.name || ''}
                    onChange={(e) =>
                      updateSpecialityName(index, activeLocale, e.target.value)
                    }
                  />
                </div>

                {/* SLUG */}
                <div>
                  <Label>Slug</Label>
                  <Input
                    value={spec.slug}
                    onChange={(e) => {
                      const copy = [...specialities];
                      copy[index].slug = e.target.value;
                      setSpecialities(copy);
                    }}
                  />
                </div>

                {/* SUB SPECIALITIES */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Sous-spécialités</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addSubSpeciality(index)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>

                  {spec.subSpecialities.map((sub, subIndex) => {
                    const subTranslation = sub.translations.find(
                      (t) => t.locale === activeLocale,
                    );

                    return (
                      <div key={subIndex} className="flex gap-2 items-center">
                        <Input
                          value={subTranslation?.name || ''}
                          onChange={(e) =>
                            updateSubSpecialityName(
                              index,
                              subIndex,
                              activeLocale,
                              e.target.value,
                            )
                          }
                          placeholder="Nom"
                        />
                        <Input
                          value={sub.slug}
                          onChange={(e) => {
                            const copy = [...specialities];
                            copy[index].subSpecialities[subIndex].slug =
                              e.target.value;
                            setSpecialities(copy);
                          }}
                          className="w-1/3"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSubSpeciality(index, subIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      {/* SAVE */}
      {onSave && specialities.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={() => onSave(specialities)}>Enregistrer</Button>
        </div>
      )}
    </div>
  );
}
