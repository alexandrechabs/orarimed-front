import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUser } from '@/services/user/useUser';

interface PatientSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPatient: (patient: any) => void;
}

const PatientSearchDialog: React.FC<PatientSearchDialogProps> = ({
  open,
  onOpenChange,
  onSelectPatient,
}) => {
  const { searchPatient } = useUser();
  const [search, setSearch] = useState({
    lastName: '',
    firstName: '',
    birthDate: '',
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!search.lastName || !search.firstName || !search.birthDate) {
      alert('Nom, prénom et date de naissance requis');
      return;
    }

    setLoading(true);
    try {
      const res = await searchPatient(
        search.firstName,
        search.lastName,
        search.birthDate
      );
      console.log(res);

      setResults(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rechercher un patient</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Nom</Label>
            <Input
              value={search.lastName}
              onChange={(e) =>
                setSearch({ ...search, lastName: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Prénom</Label>
            <Input
              value={search.firstName}
              onChange={(e) =>
                setSearch({ ...search, firstName: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Date de naissance</Label>
            <Input
              type="date"
              value={search.birthDate}
              onChange={(e) =>
                setSearch({ ...search, birthDate: e.target.value })
              }
            />
          </div>

          <Button onClick={handleSearch} disabled={loading}>
            Rechercher
          </Button>

          {results && (
            <div className="border rounded divide-y">
              <button
                key={results.id}
                type="button"
                className="w-full text-left p-2 hover:bg-muted"
                onClick={() => {
                  onSelectPatient(results);
                  onOpenChange(false);
                }}
              >
                {results.firstname} {results.lastname} – {results.email}
              </button>
            </div>
          )}

          {!results && !loading && (
            <p className="text-sm text-muted-foreground">
              Aucun patient trouvé
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientSearchDialog;
