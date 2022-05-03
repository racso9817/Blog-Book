# ProfeDirect
 Profe Direct código fuente en Angular más FireBase como Backend (saas)

## Comandos importantes
- markdown cheat sheet: https://www.markdownguide.org/cheat-sheet/
- ng serve

## TODO List
- Cambiar texto de las preguntas [x]
- Revisar gramática y ortografía [x]
- En trabaja con nosotros mover última línea a la última pregunta [x]
- Revisar banner del inicio para que se vea bien en todas las pantallas [x]
- Soporte para diferentes pantallas, soporte para celulares []
- Hacer un footer, revisar los estilos del footer actual y cambiarlos (falta soporte para celulares) [x] 
- Hacer pestaña de planes y cursos(standby) [ ]
- Revisar el routing en typescript para poner nombres adecuados(Importante) [ ]
- Modificar tamaño del carousel del inicio (falta revision de oscar) [x]
- Modificar el estilo del login (falta imagen de fondo) [x]
- Modificar estilo de soporte (falta revision de oscar) [x]
- Enlazar formulario de soporte con correo real [ ]
- Construir lógica para acceder con el login []
- Agrega mas cosas a sobre nosotros []
- Al dar click a profesor destacado llevar a descripción del profesor y las clases que da []

## IMPORTANT TODOs:
- Crear una variable en user.model.ts que verifique si es estudiante, profesor o admin. Debe ser algo parecido al isProfileSet (revisar esta variable y entender su uso para replicarlo)
- Eliminar la interfaces de roles en user.model.ts, es mejor usar el truco de isProfileSet (revisar esta variable y replicar su uso para el propósito mencionado)
- Editar los forms de edit my profile tanto para estudiante como para profesor, y que cumpla con los requisitos necesarios (después de investigar bien, firebase no permite agregar más campos en la función createuserwithemailandpassword así que todos los campos necesarios deberán ser agregados en el edit my profile)
- Cuando un profesor carga su información en el edit my profile se debe crear una lógica para que este no pueda seguir navegando hasta que se apruebe su solicitud de profesor
