import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/context/toast-context';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const { user, updateUser } = useUserStore();
  const { addToast } = useToast();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currency, setCurrency] = useState(user.currency || 'IDR');

  useEffect(() => {
    if (open) {
      setName(user.name);
      setEmail(user.email);
      setCurrency(user.currency || 'IDR');
    }
  }, [open, user]);

  const handleSave = () => {
    const parts = name.trim().split(' ');
    const initials = parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
    updateUser({ name, email, initials, currency });
    addToast('Profile updated successfully', 'success');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-primary/20 text-primary text-xl font-medium">{user.initials}</AvatarFallback>
            </Avatar>
          </div>
          <div><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
          <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" /></div>
          <div><Label>Currency</Label><Input value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1.5" placeholder="IDR, USD, etc." /></div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
