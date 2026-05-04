import { ProfileFormSkeleton } from "./ProfileFormSkeleton"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Camera } from "lucide-react"
import { useProfileStore } from "./store/profile-store"
import { handleImageSelect, saveCroppedImageToStore } from "./lib/image-utils"
import { ImageCropper } from "./image-cropper"
import { useProfile } from "./hook/use-profile"
import { ChangePasswordModal } from "./ChangePasswordModal"
import "./css/style.css"

function ProfileForm() {
  const {
    avatar,
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    email,
    telefono,
    rol,
    cedula,
    numeroGremino,
    set
  } = useProfileStore()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)

  const [cropperOpen, setCropperOpen] = useState(false)
  const [imageToCrop, setImageToCrop] = useState<string>("")

  const { fetchUsuario, actualizarUsuario, cambiarPassword } = useProfile()

  useEffect(() => {
    const loadUserData = async () => {
      setIsFetching(true)
      await fetchUsuario()
      setIsFetching(false)
    }
    loadUserData()
  }, [])

  const onImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const base64 = await handleImageSelect(e)
    if (base64) {
      setImageToCrop(base64)
      setCropperOpen(true)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onCropComplete = (croppedImage: string) => {
    saveCroppedImageToStore(croppedImage)
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      await actualizarUsuario()
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    const success = await cambiarPassword(newPassword, confirmPassword)
    if (success) {
      setNewPassword("")
      setConfirmPassword("")
      setPasswordModalOpen(false)
    }
    return success
  }

  if (isFetching) return <ProfileFormSkeleton />

  return (
    <div className="p-2 md:p-4 lg:p-6 mx-auto w-[95vw] max-w-[1200px]  m-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-1 rounded-full bg-primary"></div>
        <h3 className="text-2xl font-bold text-foreground text-primary">
          Perfil
        </h3>
      </div>

      <Card className="">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Foto de perfil */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <Avatar className="w-40 h-40 border-4 border-muted transition-opacity group-hover:opacity-80">
                  <AvatarImage src={avatar || "/person-profile.png"} />
                  <AvatarFallback className="text-4xl">
                    {primerNombre ? primerNombre.charAt(0).toUpperCase() : "US"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 rounded-full bg-secondary p-2 shadow-md">
                  <Camera className="h-4 w-4" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageSelect}
                />
              </div>
              <p
                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                Cambiar foto
              </p>
            </div>

            {/* Formulario */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Primer Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="primerNombre">Primer Nombre</Label>
                  <Input
                    id="primerNombre"
                    type="text"
                    value={primerNombre}
                    onChange={(e) => set("primerNombre", e.target.value)}
                    className="h-[41px]"
                  />
                </div>

                {/* Segundo Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="segundoNombre">Segundo Nombre</Label>
                  <Input
                    id="segundoNombre"
                    type="text"
                    value={segundoNombre}
                    onChange={(e) => set("segundoNombre", e.target.value)}
                    className="h-[41px]"
                  />
                </div>

                {/* Primer Apellido */}
                <div className="space-y-2">
                  <Label htmlFor="primerApellido">Primer Apellido</Label>
                  <Input
                    id="primerApellido"
                    type="text"
                    value={primerApellido}
                    onChange={(e) => set("primerApellido", e.target.value)}
                    className="h-[41px]"
                  />
                </div>

                {/* Segundo Apellido */}
                <div className="space-y-2">
                  <Label htmlFor="segundoApellido">Segundo Apellido</Label>
                  <Input
                    id="segundoApellido"
                    type="text"
                    value={segundoApellido}
                    onChange={(e) => set("segundoApellido", e.target.value)}
                    className="h-[41px]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="h-[41px]"
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="text"
                    value={telefono}
                    onChange={(e) => set("telefono", e.target.value)}
                    className="h-[41px]"
                  />
                </div>

                {/* Cédula */}
                <div className="space-y-2">
                  <Label htmlFor="cedula">Cédula</Label>
                  <Input
                    id="cedula"
                    type="text"
                    value={cedula}
                    disabled
                    className="h-[41px] bg-muted cursor-not-allowed"
                  />
                </div>

                {/* Número de Gremio */}
                <div className="space-y-2">
                  <Label htmlFor="numeroGremino">Número de Gremio</Label>
                  <Input
                    id="numeroGremino"
                    type="text"
                    value={numeroGremino || "No disponible"}
                    disabled
                    className="h-[41px] bg-muted cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end flex-col sm:flex-row gap-4 pt-4">
                <ChangePasswordModal
                  open={passwordModalOpen}
                  onOpenChange={setPasswordModalOpen}
                  newPassword={newPassword}
                  confirmPassword={confirmPassword}
                  onNewPasswordChange={setNewPassword}
                  onConfirmPasswordChange={setConfirmPassword}
                  onSave={handleChangePassword}
                />

                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  
                  className="text-white hover:opacity-90 bg-primary"
                >
                  {isLoading ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ImageCropper
        open={cropperOpen}
        onOpenChange={setCropperOpen}
        imageSrc={imageToCrop}
        onCropComplete={onCropComplete}
      />
    </div>
  )
}

export default ProfileForm