import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Lock } from "lucide-react"
import Input from "@/components/ux/input"

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newPassword: string
  confirmPassword: string
  onNewPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onSave: () => Promise<boolean> | boolean
}

export function ChangePasswordModal({
  open,
  onOpenChange,
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSave,
}: ChangePasswordModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(modalOpen) => {
        onOpenChange(modalOpen)
        if (!modalOpen) {
          onNewPasswordChange("")
          onConfirmPasswordChange("")
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-transparent border border-input hover:bg-accent hover:text-accent-foreground text-black"
        >
          <Lock className="h-4 w-4" />
          Cambiar contraseña
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cambiar contraseña</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva contraseña</Label>
            <Input
              id="new-password"
              name="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => onNewPasswordChange(e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Repetir contraseña</Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              placeholder="Repite la contraseña"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={async () => await onSave()}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
