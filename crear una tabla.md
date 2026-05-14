# necesito crear una tabla (desktop) / tarjeta (movile)

el componente debe estar encerrado en un componente de card de ui, debe tener su titulo a la izq y a la derecha debe estar un select para cambiar el rol del usuario y revisar si la tabla rederiza bien segun el rol (este selector solo de le puede mostrar en produccion al usuario con rol. y en desarrollo siempre se debe de mostrar)

debajo del titulo y del selector se debe de mostrar un buscador al usuario (el buscador que sea a nivel de frontend)

- entre el titulo y el buscador debe de haber un border bottom para separarlos

y al nivel del input de busqueda me debes de mostrar un boton para crear un nuevo plan (ese btn debe mostrar una modal con los campos pertinenetes )

## necesito que la tabla lleve los campos

    * id
    * tipo
    * email
    * costo
    * estatus (alli lo que debe de mostrar es un swift para cambiar el estatus rapidamente)
    * acciones (estos seran btns):
        * btn que mostrara una modal para cambiar los datos de ese plan



---

# el codigo debe estar organizado de la siguiente manera (todo dentro de la misma carpeta)

    * todo debe de quedar dentro de la carpeta /components/view/suscripcion
        * store (con un estado de zustan)
        * la data mockup debe estar en un archivo diferente
        * service (hooks) (cada peticion debe tener su archivo independiente)
                * (servicios para hacer la comunicacion cliente servidor)
                * (logica de las peticiones)

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


    **_ si estamos en desarrollo y no se logra hacer la comunicacion se debe de cargar una data mockup _**
    **_ los roles fake los puedes dejar un un enum _**

    - el token lo puedes sacar de localstorage (tiene el key: "token")

    - las acciones como actualizaciones deben ser de tipo optimistas (y se deben actualizar directamente en el storage de zustand y enviadas al servidor)

    - en caso de agregar algo debe ser optimista y agregarla directamente en el zustan y el id para que sea consistente toma el id mayor de la tabla y sumale 1

    - el cambio entre tarjeta y tabla debe ser automatico dependiendo de la resolucion del dispositivo


