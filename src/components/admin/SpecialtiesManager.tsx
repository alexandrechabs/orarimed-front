import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { Speciality, SubSpeciality, Locale } from '@/types/specialty';

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
