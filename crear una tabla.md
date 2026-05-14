# necesito crear una tabla (desktop) / tarjeta (movile)




- entre el titulo y el buscador debe de haber un border bottom para separarlos

y al nivel del input de busqueda me debes de mostrar un selector para buscar entre estatus (**_   
  PENDIENTE
  VALIDADO
  VENCIDO
  RECHAZADA 
_**)

## necesito que la tabla lleve los campos

    * id
    * ci (esta viene del usuario)
    * fecha
    * comprobante
    * conto
    * tipo de plan
    * estatus (se mostraran badges con un color de fondo para distiguir)
    * acciones (estos seran btns):
       * select para cambiar rapidamente el estatus
        * btn para ver mas detalles de la suscripcion (esto habriara un modal que muestre datos como cedula, rol, primerNombre, segundoNombre y mas detalles del tramite)
        * btn de whatsapp para contactar a la persona  (este componente se te paso como whatsapp-button.tsx)
        *bton para ver el comprobante de pago img

        A ESTOS TRE BOTONES SOLO DEJALOS VISIBLES LA FUNCIONANLIDAD DE LAS PETICIONES AL SERVIDOR LAS ARE DESPUES
        *(btn para descargar carnet) (visible solo cuando este en estatus VALIDADO)
        *(btn para descargar solvencia de pago) (visible solo cuando este en estatus VALIDADO)
        * (btn para descargar resivo de pago)(visible solo cuando este en estatus PENDIENTE)




notas las tabla se debe renderizar segun el rol del usuario, si es super usuario o administrador puede ver el btn de whatsapp y el selector para cambiar de estatus

---

# componentes que se te pasaron

_ ux/btn/whatsapp/index.tsx.tsx (btn de whatsapp)


---

# el codigo debe estar organizado de la siguiente manera (todo dentro de la misma carpeta)

    * todo debe de quedar dentro de la carpeta /components/view/suscripciones/suscipcion
        * store (con un estado de zustan)

                * la data mockup debe estar en un archivo diferente
        * service (cada peticion debe tener su archivo independiente)
                * (servicios para hacer la comunicacion cliente servidor)
                * (logica de las peticiones)
                * el servicio para traerse los datos sera el mismo del filtro

        * los servicios deben comunicarse directamente con el store

        * las querys que te pase ponlas en una carpeta llamada querys

---

# detalles generales

    - Deben adaptarse correctamente a diferentes tamaños de pantalla (móvil, tablet y escritorio).
    - Aplica `useMemo`, `useCallback`, y `React.memo` donde sea necesario para evitar renders innecesarios.
    - Código claro, con nombres de variables y funciones descriptivos, siguiendo buenas prácticas.
    - si tienes que agregar una variable de entorno ponla en un env.ts que debe estar en la raiz del proyecto

---

# detalles tecnicos

    - el buscador de la tabla su funcionalidad debe debe ser con la misma query de traerse los datos (utilizara la variable filtro)
        - el buscador debe tener un bounce de 600ms

    **_ la tabla debe rendirizar contenido segun el rol del usuario _**

    **_ si estamos en desarrollo y no se logra hacer la comunicacion se debe de cargar una data mockup _**


    - el token lo puedes sacar de localstorage (tiene el key: "token")

    - las acciones como actualizaciones deben ser de tipo optimistas (y se deben actualizar directamente en el storage de zustand y enviadas al servidor)

    - en caso de agregar algo debe ser optimista y agregarla directamente en el zustan y el id para que sea consistente toma el id mayor de la tabla y sumale 1

    - el cambio entre tarjeta y tabla debe ser automatico dependiendo de la resolucion del dispositivo

---

# configuracion de graphql

como las peticiones se hacen con graphql el provilder importalo en layout de nextjs
la url del provilder de graphql debe ser http://localhost:4000/graphql

