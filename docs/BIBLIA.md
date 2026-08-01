# Biblia pública de Chamuyo

**Documento de visión, mundo y mecánicas del party game social de barrio sobre confianza, plata, mandados cotidianos y estafas construidas con hechos reales.**

Chamuyo es un juego web 2D, local y artesanal para seis personajes. En el MVP actual una persona juega y las otras cinco son controladas por el juego. Cada personaje tiene un oficio, bienes, dinero, necesidades y una agenda. La mayor parte de lo que ocurre en el pueblo es legítimo. El conflicto aparece cuando alguien aprovecha esa actividad cotidiana para construir una coartada, desplazar la sospecha o ejecutar una maniobra.

Esta es la documentación pública del proyecto. Explica qué experiencia propone Chamuyo, cómo se estructura una partida y qué sistemas forman parte del MVP.

---

## 1. Identidad del juego

### Premisa

Chamuyo no consiste en reconocer un mensaje falso dentro de una lista. Su fantasía central es **vivir un día normal en un barrio donde una estafa puede esconderse dentro de una cadena de hechos verdaderos**.

Una heladera puede estar realmente en venta. Su dueño puede necesitar el dinero para otra compra. Un técnico puede haberla revisado, un vecino puede haber ayudado con el traslado y varias personas pueden haber sacado fotos legítimas del mismo objeto. Si más tarde aparece una publicación dudosa, todos tendrán una parte cierta de la historia, pero nadie habrá visto necesariamente el cuadro completo.

La pregunta central es:

> ¿Qué parte de lo que vi demuestra una maniobra y qué parte sólo parece rara porque la vida cotidiana es desordenada?

El jugador camina, hace un mandado, llega tarde a algunas conversaciones, oye fragmentos, observa recorridos y guarda comprobantes. Al atardecer debe reconstruir el día con información incompleta.

### Género y formato

- Party game social de deducción.
- Aventura 2D con vista superior.
- Partidas para seis personajes.
- Un jugador humano contra cinco bots en el MVP.
- Campaña persistente en el navegador.
- Episodios breves divididos en rondas.

### Promesa de experiencia

Una buena partida debería dejar:

- una acusación razonable pero discutible;
- una conducta honesta que parezca sospechosa por motivos humanos;
- una manipulación construida con datos verdaderos;
- una decisión económica tentadora que sacrifique respaldo;
- un recorrido físico que funcione como coartada o contradicción;
- un desenlace que explique lo ocurrido sin humillar a quien se equivocó.

El aprendizaje surge de la experiencia. Chamuyo no busca hablar como una campaña institucional ni castigar al jugador con una moraleja.

---

## 2. Pilares de diseño

### 2.1. La vida cotidiana es el núcleo jugable

Comprar, vender, cobrar, reparar, averiguar, retirar y entregar no son decoración narrativa. Cada actividad puede producir dinero, bienes, horarios, recibos, testigos y necesidades posteriores.

### 2.2. Lo sospechoso no equivale a lo falso

Una urgencia puede ser real. Un precio bajo puede responder a una mudanza. Una persona honesta puede ponerse nerviosa. Un documento prolijo puede ser falso. El juego evita que una sola señal determine la verdad.

### 2.3. El conocimiento depende de la posición

No hay un narrador omnisciente durante el día. Una conversación se conoce si alguien estuvo cerca; un movimiento, si lo vio; un documento, si lo obtuvo; y un rumor, si otro personaje decidió contarlo.

### 2.4. Toda decisión tiene una economía

Cada opción debe dejar claro:

- cuánto dinero entra o sale;
- si usa banco o efectivo;
- qué objeto cambia de manos;
- qué beneficio obtiene el personaje;
- qué evidencia queda;
- qué riesgo económico o social acepta.

### 2.5. El Estafador sigue siendo parte del barrio

El Estafador tiene oficio, sueldo, bienes, amistades y tareas legítimas. Puede pasar una ronda sin ejecutar una maniobra, pero no aparece como una persona narrativamente inactiva.

### 2.6. El Cómplice tiene voluntad propia

El Cómplice conoce al Estafador, aunque no controla ni conoce automáticamente todos sus movimientos. Puede negociar, colaborar, reclamar, mentir, retener dinero o negarse a seguir ayudando.

### 2.7. La mesa interpreta y la auditoría comprueba

Durante el día se observan hechos parciales. En la reunión se comparan relatos. La auditoría busca operaciones concretas. El replay final muestra la secuencia completa cuando ya existe un veredicto.

---

## 3. Dirección narrativa

### El barrio como red de relaciones

El pueblo no es un tablero donde aparecen casos independientes. Los objetos, las necesidades y las personas conectan historias:

- una bicicleta vendida puede convertirse en herramienta de reparto;
- una heladera reemplazada puede terminar en la protectora;
- una impresión legítima puede compartir papel con una tanda dudosa;
- una cuenta nueva puede corresponder a un empleo real;
- una visita al banco puede ser un trámite, un cobro o un retiro;
- una mudanza puede justificar una venta urgente sin volverla fraudulenta.

Los hechos reaparecen y cambian de significado según quién los recuerda y qué ocurrió después.

### Tono

El lenguaje es argentino y latinoamericano, oral y concreto. Los personajes hablan como vecinos que necesitan resolver algo, no como instructores de seguridad.

La gracia surge de la convivencia: una discusión cortada por una gallina, alguien barriendo que ve sólo una parte, un perro que interrumpe un recorrido o una queja por el olor en la vereda. La necesidad económica y las víctimas nunca son el remate del chiste.

### Lo que Chamuyo evita

- Casos binarios de “verdadero o falso”.
- Opciones seguras sin costo ni tensión.
- Misiones que pagan sin cliente o motivo.
- Un mapa puramente decorativo.
- Personajes que siguen al jugador en grupo.
- Una interfaz de aplicación corporativa.
- Una estética genérica de producto tecnológico.
- Copiar personajes, edificios o recursos de otros juegos.

---

## 4. El pueblo

Chamuyo ocurre en un pueblo barrial deliberadamente compacto. Los recorridos son breves, pero cada zona tiene función social y económica.

### Lugares del mapa

- Almacén.
- Banco y cajero.
- Farmacia.
- Imprenta.
- Puesto de usados.
- Plaza Sarmiento.
- Protectora de animales.
- Oficina y correo.
- Comedor familiar y casa de Marta.
- Propiedad en alquiler.
- Escuela.
- Municipalidad.
- Capilla.
- Parada de colectivo.
- Casas de los vecinos.

Cada edificio tiene una entrada reconocible y una función concreta. Llegar a un lugar no resuelve automáticamente una tarea: hay que encontrar a la contraparte e interactuar.

El oficio técnico no posee un edificio exclusivo: sus arreglos se realizan a domicilio y generan recorridos entre comercios, casas y propiedades.

### Un barrio que se mueve

Los seis personajes tienen agendas simultáneas. No caminan como un grupo ni esperan la decisión del jugador. Cada uno puede visitar edificios, conversar, comprar, vender, trabajar o abandonar una operación por su cuenta.

Dos perros, un gato y tres gallinas recorren el mapa con conductas autónomas. Los perros y el gato emiten sonidos breves sin globos permanentes. Pisar un residuo puede provocar comentarios ambientales independientes de los vecinos cercanos, pero esos comentarios no se convierten en evidencia ni alteran los votos.

---

## 5. El elenco

Las seis identidades permanecen entre partidas. Los papeles secretos cambian, pero su silueta y presencia barrial siguen siendo reconocibles.

| Personaje | Identidad visual | Presencia en el barrio |
| --- | --- | --- |
| Marta | Rodete y bolsa | Familia, comedor, compras y encargos concretos. |
| Nico | Gorra y carpeta | Personaje controlado por el jugador; puede recibir cualquiera de los cuatro roles. |
| Luli | Pelo claro y ropa de trabajo | Comercio, reparto, protectora y vínculos rápidos entre lugares. |
| Don Raúl | Bigote y chaleco | Propiedades, arreglos, protectora y experiencia barrial. |
| Carla | Anteojos y herramienta | Técnica, reparaciones y comprobaciones materiales. |
| Tano | Visera y pliego | Imprenta, reventa, oficina y publicaciones. |

### Oficios

Los oficios se reparten sin repetirse dentro de la campaña inicial:

- almacenero o almacenera;
- cadete;
- voluntario o voluntaria de protectora;
- propietario o propietaria;
- técnico o técnica en frío;
- imprentero o imprentera;
- revendedor o revendedora;
- administrativo o administrativa.

El oficio define misiones plausibles, bienes iniciales, ingresos, lugares frecuentes y explicaciones posibles. No es sólo una etiqueta visual.

### Necesidades y motivaciones

Los personajes pueden necesitar dinero para salud, alquiler, herramientas, trabajo, un viaje, una compra importante, una mejora del negocio o la atención de un animal. Una necesidad explica la presión, pero no demuestra culpabilidad.

---

## 6. Roles secretos

### Vecino

El Vecino intenta completar sus tareas sin perder recursos ni acusar por impulso.

Durante el día:

- cumple un mandado;
- decide entre respaldo, ahorro, velocidad y riesgo;
- observa hechos cercanos;
- conserva recibos y recuerdos.

En la mesa:

- compara versiones;
- consulta diálogos conocidos;
- vota a quién auditar.

### Verificador

El Verificador comparte las responsabilidades del Vecino y agrega una libreta de preguntas durante la reunión.

Puede pedir justificaciones relacionadas con una operación y contrastar:

- qué hizo una persona;
- en qué orden;
- con quién estuvo;
- qué documento utilizó;
- qué objeto tuvo;
- qué parte del horario quedó sin explicar.

Las respuestas pueden ser claras, nerviosas, incompletas o persuasivas. Ninguna aparece marcada como verdadera o falsa.

### Estafador

El Estafador conoce al Cómplice. Mantiene dos vidas simultáneas:

1. una actividad pública real, compatible con su oficio y sus recursos;
2. una intención privada que puede priorizar cobertura, preparación o ejecución.

Una preparación todavía no utilizada no equivale a una estafa. Por eso una auditoría puede encontrar únicamente trabajo, compras, visitas y operaciones legítimas aunque haya existido una intención oculta.

### Cómplice

El Cómplice conoce al Estafador, pero conserva intereses propios. Puede recibir un encargo, negociar qué obtiene, cumplir un acuerdo, presionar, guardar una evidencia o retener dinero.

Su conducta puede proteger al Estafador o dejar un excedente difícil de explicar. También puede convertirse en el principal sospechoso sin ser quien diseñó la maniobra.

---

## 7. Campaña, partida y ronda

### Campaña

La campaña conserva entre episodios:

- dinero bancario y efectivo;
- bienes y propiedad;
- profesiones;
- relaciones;
- operaciones e historial;
- recursos obtenidos durante partidas anteriores.

Los roles secretos se sortean nuevamente al iniciar otra partida. Un objeto o antecedente viejo no determina el papel actual.

### Partida

Una partida contiene hasta tres rondas. Puede terminar antes si una auditoría descubre al Estafador o si una maniobra alcanza su condición de victoria.

### Ronda

Cada ronda representa un día en el pueblo:

1. El jugador recibe dos mandados compatibles y elige uno.
2. Decide cómo intentar resolverlo.
3. Los seis personajes comienzan sus agendas.
4. El jugador se mueve libremente y cumple pasos físicos.
5. Cuatro movimientos autónomos ocurren en distintos lugares.
6. Cuando los bots y los cuatro movimientos terminan, se habilita **A comer**.
7. El barrio resume hechos, pregunta y vota.
8. La auditoría decide si la partida continúa o llega a un desenlace.

El día no exige que todos presencien todas las operaciones. Perder una conversación es parte del juego.

---

## 8. Mandados y contrapartes

### El papelito de mandado

La guía visible del jugador indica:

- paso actual;
- destino;
- persona con quien debe hablar;
- acción requerida;
- canal y monto, si corresponde;
- evidencia posible;
- próximo destino.

Puede guardarse y consultarse sin detener el mundo.

### Pasos físicos

Una misión puede exigir:

- visitar a quien encarga el trabajo;
- inspeccionar un objeto;
- hablar con vendedor o comprador;
- obtener documentación;
- negociar una condición;
- pasar por el cajero;
- pagar, cobrar o entregar;
- volver con la contraparte inicial.

La misión sólo avanza después de la interacción correcta. Caminar hasta un edificio no cuenta como haber realizado el trámite.

### Contrapartes

Toda operación tiene alguien del otro lado:

- un vendedor muestra una bicicleta, heladera o celular;
- un comprador prueba el objeto y pide documentación;
- un propietario enseña el inmueble;
- un farmacéutico entrega el producto;
- un empleado bancario consulta una operación;
- un responsable firma un trabajo;
- la imprenta entrega una tanda;
- la protectora recibe materiales o rendiciones.

Si la contraparte no está disponible, la tarea queda pendiente y el jugador debe volver.

### Tipos de decisión

Las alternativas no son “correcta” e “incorrecta”. Suelen enfrentar:

- mayor respaldo y mayor costo;
- ahorro con documentación más débil;
- velocidad con menos tiempo para comprobar;
- una seña que conserva liquidez pero puede perderse;
- una cancelación responsable sin beneficio inmediato.

Cada resultado distingue el valor del bien, un posible honorario, la comisión, el adelanto y cualquier diferencia negociada.

---

## 9. Economía del barrio

### Dos bolsillos

Banco y efectivo se muestran por separado.

- Las transferencias salen del banco.
- Las compras presenciales pueden requerir efectivo.
- Los honorarios entran en el canal acordado.
- El cajero mueve dinero del banco al bolsillo.
- Un retiro no crea ganancias.

El juego no permite saldos negativos.

### Dinero y propiedad

Comprar un bien mueve dinero y propiedad al mismo tiempo. Vender exige que el personaje sea dueño del objeto. Cada bicicleta, heladera, celular o herramienta tiene un único propietario.

Las visitas y consultas no producen ingresos por sí solas. Un servicio paga únicamente cuando existe una persona o institución que lo encargó.

### Información económica pública y privada

El jugador conoce sus cifras exactas, movimientos y bienes. Del resto ve una situación económica aproximada, su oficio declarado y pertenencias visibles. Una auditoría puede revelar cifras o movimientos concretos cuando forman parte del caso.

### El cajero como interacción

Cuando una negociación requiere efectivo insuficiente:

1. la operación queda pausada;
2. el banco se convierte en destino temporal;
3. el jugador usa el cajero e indica cuánto retirar;
4. el saldo bancario baja y el efectivo sube;
5. debe volver a la conversación original;
6. la oferta puede mantenerse o cambiar según el tiempo transcurrido.

Llegar al banco sin retirar el monto necesario no completa el paso.

### Ejemplo: remedios de Marta

Marta entrega un adelanto para comprar un medicamento y ofrece un honorario independiente por el mandado. En la farmacia pueden existir distintas alternativas: precio de lista con comprobante completo, marca equivalente con reintegro del ahorro o una negociación en efectivo con respaldo más débil.

El adelanto, la compra, el posible reintegro, la diferencia y el honorario son movimientos separados. Esa separación permite que una decisión sea rentable sin inventar dinero y que la mesa pueda reconstruir qué ocurrió.

---

## 10. Familias de situaciones

Las operaciones se construyen a partir de necesidades y bienes existentes. Una ronda presenta cuatro movimientos con protagonistas distintos, y el barrio no conoce de antemano cuántas maniobras puede haber.

### Bicicleta y transferencia

Una bicicleta puede comprarse para reparto o venderse por necesidad. La operación permite revisar frenos, cuadro, propiedad y acreditación del pago. El punto de tensión no es que una transferencia demore, sino quién asume el riesgo mientras todavía no acreditó.

### Heladera y mudanza

Una heladera puede venderse porque alguien se muda, reemplaza equipo o necesita completar otra compra. Probar que enfría, reconocer marcas de uso y verificar el lugar son acciones más valiosas que juzgar sólo el precio.

### Operación bancaria

Una demora puede existir realmente. La verificación se apoya en el canal de contacto, el estado dentro de la aplicación y la ausencia de pedidos de credenciales. Consultar el propio banco protege una operación; no genera ingresos.

### Familiar con número nuevo

Perder o cambiar un teléfono es una situación real que puede generar pedidos urgentes. La identidad se contrasta mediante otro canal, datos familiares y la posibilidad de pagar directamente al destinatario final.

### Alquiler

Una propiedad puede quedar disponible por una cancelación y ofrecerse con apuro legítimo. Dirección, acceso, documentación, persona con llave y canal de reserva forman una cadena verificable.

### Trabajo remoto

Una propuesta real identifica empresa, responsable, dominio y condiciones de contratación. La entrevista no paga por sí sola; el ingreso comienza cuando el trabajo o empleo efectivamente se concreta.

### QR comercial o solidario

En un barrio pueden convivir pagos de comercios, colectas, rifas y campañas legítimas. El nombre del beneficiario, el ticket y la confirmación con la institución importan más que la mera presencia de un código.

### Celular usado

La compra o venta exige que el equipo exista, pueda probarse y tenga una procedencia coherente. El IMEI, la factura y la posibilidad de revisar el teléfono sostienen la trazabilidad.

---

## 11. Preparación, oportunidad y evidencia

El Estafador puede obtener recursos durante una actividad compatible: material de imprenta, información de un aviso, un documento real, una línea telefónica o una cuenta. Tener uno de esos elementos no prueba que exista una estafa.

La diferencia está en el uso:

- **Actividad legítima:** el personaje trabaja, compra, vende o tramita algo.
- **Preparación:** obtiene un recurso que todavía no produjo una víctima ni una pérdida.
- **Oportunidad:** aparece una situación compatible donde puede intentar usarlo.
- **Intento bloqueado:** la maniobra se inicia, pero alguien verifica o rechaza.
- **Ejecución exitosa:** consigue dinero, un bien o información.

Una oportunidad sólo aparece cuando el mundo contiene los objetos, lugares y relaciones que la vuelven plausible. No todas las historias ofrecen una acción criminal.

---

## 12. Estafador y Cómplice

### Conocimiento compartido

Ambos conocen la identidad del otro. Ese conocimiento es privado y no se transmite al resto del barrio.

### Encuentros en el mapa

Delegar o repartir no ocurre mediante una acción a distancia. Los dos personajes deben encontrarse físicamente y conversar. Alguien cercano puede verlos juntos u oír un fragmento sin conocer necesariamente el motivo.

### Negociación

El Estafador puede actuar solo o pedir ayuda. Si existe colaboración, ambos conversan sobre el encargo y el reparto. El Cómplice puede aceptar, pedir mejores condiciones, desconfiar o negarse.

Después de una maniobra, la conversación vuelve sobre lo ocurrido y el dinero disponible. Lo declarado por una parte no tiene por qué coincidir con el monto real. La entrega, cuando existe, debe realizarse con el dinero en el canal correspondiente.

### Conflicto interno

La relación criminal también produce sospecha:

- uno puede sentir que recibió menos de lo prometido;
- alguien puede guardar una prueba;
- un retiro puede quedar sin explicación;
- una discusión puede ser escuchada;
- el Cómplice puede conservar dinero y quedar más expuesto que el autor del plan.

El sistema permite que colaboren sin convertirlos en una sola entidad narrativa.

---

## 13. Observación, diálogo y rumor

### Conversaciones por cercanía

El jugador escucha una charla completa únicamente si está lo bastante cerca. Desde lejos puede ver que dos personas se encontraron, pero no conocer el tema.

Lo oído se guarda como un recuerdo breve con participantes, lugar y momento. El botón `…` junto a un personaje permite revisar sus últimas frases conocidas durante la ronda.

### La chusma de la ronda

En cada día un vecino puede observar desde una tarea cotidiana: barrer, regar, pasear o esperar el colectivo. Su comentario puede ser correcto, parcial o confundido.

En la mesa se presenta como comentario y tiene poca influencia frente a un documento, una transacción o una contradicción directa. La chusma no conoce roles, intenciones ni montos ocultos.

### Hechos observables

La reunión puede usar:

- lugares visitados;
- horarios;
- personas vistas juntas;
- diálogos escuchados;
- comprobantes obtenidos;
- dinero retirado o entregado;
- propiedad de un objeto;
- respuestas del interrogatorio.

El juego separa esos hechos de la verdad interna hasta que termina el caso.

---

## 14. La reunión “A comer”

La mesa familiar es el único encuentro colectivo obligatorio.

La reunión nunca se abre automáticamente. Una vez que el barrio terminó, el jugador puede seguir caminando o pulsar **A comer**. Si todavía tiene un mandado, un retiro, un reparto o una conversación obligatoria pendiente, el botón explica qué debe cerrar antes de sentarse. Llegar a las 20:30 tampoco fuerza la reunión.

### Orden de la reunión

1. Se resumen los movimientos del día.
2. Se incorporan observaciones y comentarios disponibles.
3. El Verificador puede pedir explicaciones.
4. Se consultan diálogos conocidos.
5. Los personajes votan a quién auditar.
6. La auditoría presenta movimientos verificables.
7. La partida continúa o llega a un desenlace.

Antes del voto no se muestran intenciones privadas ni etiquetas que revelen automáticamente una operación.

### Interrogatorio

Las preguntas se relacionan con actividades reales:

- motivo de una venta;
- dirección de un alquiler;
- titular de una cuenta;
- procedencia de un teléfono;
- orden de un recorrido;
- identidad de un testigo.

Una persona honesta puede responder de forma torpe. Una persona culpable puede sostener una versión convincente con hechos verdaderos. La respuesta es una pista, no una prueba automática.

### Votación

Los bots consideran lo que pudieron conocer: evidencia, horarios, contradicciones, relaciones y rumores de bajo peso. No votan a partir del rol secreto.

---

## 15. Auditoría, juicio y desenlaces

### Auditoría sin operación irregular

Si el personaje sólo realizó tareas legítimas o consiguió un recurso todavía no utilizado, la auditoría describe esas actividades sin revelar el rol.

### Estafador descubierto

Si la auditoría encuentra una ejecución directa del Estafador, el barrio gana y la partida termina.

### Cómplice expuesto

Encontrar una operación del Cómplice no significa necesariamente haber encontrado a quien organizó el plan. Según las pruebas y el momento de la partida, el caso puede continuar.

### Acusación equivocada

Auditar a un Vecino o Verificador reduce la confianza del barrio. Una conducta extraña o una respuesta nerviosa no alcanzan por sí solas.

### Juicio final

Cuando la partida llega a su cierre, el juicio reúne actividades públicas, respuestas, documentos y cronologías de varias rondas. Si el barrio identifica al Estafador, gana. Si condena a otra persona o deja sin explicar la maniobra, gana el Estafador.

### Replay

Una vez decidido el resultado, el replay muestra la secuencia oculta:

1. actividad pública;
2. preparación o cobertura;
3. ejecución directa o encargo;
4. cobro, reparto o conflicto;
5. señal decisiva y veredicto.

La explicación final busca señalar la relación causal que importaba, no burlarse de la decisión del jugador.

---

## 16. Interfaz y controles

### Controles principales

- `WASD` o flechas: caminar.
- Clic o toque: marcar un destino.
- `E` o `Enter`: interactuar.
- `P`: mostrar u ocultar el papelito.
- `I`: abrir billetera, inventario y notas.
- `1`–`6`: elegir acciones disponibles.
- Cruceta táctil: desplazamiento en móvil.
- `MAPA`: ampliar el área de juego.

### Capas de información

- **Mapa:** posiciones, recorridos, edificios y objetos.
- **Papelito:** misión propia y próximo paso.
- **Billetera:** banco, efectivo, bienes y recibos.
- **Diálogo:** información oída cerca de los personajes.
- **Mesa:** observaciones compartidas, preguntas y voto.
- **Replay:** verdad completa después del veredicto.

La interfaz intenta que el jugador diferencie lo propio, lo observado y lo revelado sin convertir la pantalla en un panel administrativo.

---

## 17. Dirección visual

Chamuyo busca sentirse como un juego web artesanal, humano y local.

### Principios

- Perspectiva superior o semisuperior.
- Pixel art original con bordes nítidos.
- Colores planos, cálidos y ligeramente gastados.
- Fachadas diferenciadas y entradas claras.
- Personajes reconocibles por silueta, ropa y accesorio.
- Papelitos, recibos, pizarrones, sellos y madera como materiales de interfaz.
- Botones tratados como controles de juego o cartas de acción.

### Referencia de género

La inspiración de los RPG de 16 bits se limita a la legibilidad espacial, la escala de pueblo y la claridad de los personajes. Chamuyo no utiliza sprites, paletas, edificios ni elementos copiados de otros juegos.

### Elementos del mundo

La bicicleta se representa como un objeto reconocible y puede aparecer estacionada, probada, empujada o cargada. Los animales tienen movimiento propio y sólo muestran sonidos transitorios. La mesa mantiene vajilla, pan, mate, soda y una tabla de salame como elementos de identidad barrial.

### Lo que queda fuera de la estética

- fondos abstractos con brillo;
- gradientes tecnológicos;
- glassmorphism;
- ilustración plástica tridimensional;
- imágenes de stock;
- interfaz de aplicación empresarial;
- personajes de estilos incompatibles.

---

## 18. Arquitectura del MVP

Chamuyo funciona con tres archivos principales:

```text
index.html   estructura, mapa y componentes visuales
style.css    composición, sprites, animaciones y adaptación de pantalla
app.js       reglas, estado, economía, movimiento, bots y persistencia
```

No requiere frameworks, compilación ni servicios externos para iniciar.

### Persistencia

La campaña se guarda en el almacenamiento local del navegador. Conserva la progresión entre episodios y vuelve a sortear los roles al comenzar una partida nueva.

### Separación de información

Aunque el MVP se ejecuta localmente, distingue conceptualmente:

- estado público: posiciones, palabras pronunciadas, documentos compartidos y votos;
- estado privado: rol, intención, información no declarada y recursos ocultos;
- estado observable: aquello que un personaje pudo conocer por proximidad o evidencia.

Esa separación sostiene la lógica de deducción incluso cuando los cinco participantes restantes son bots.

---

## 19. Alcance actual

El MVP público incluye:

- un jugador humano y cinco bots;
- seis personajes persistentes;
- cuatro roles jugables;
- un pueblo explorable con teclado, clic y control táctil;
- colisiones, cámara y destinos;
- agendas simultáneas;
- misiones con contrapartes explícitas;
- banco, efectivo, cajero, transacciones y bienes;
- observaciones y conversaciones por cercanía;
- rumor de baja fiabilidad;
- reuniones, interrogatorios y votación;
- auditoría, juicio y replay;
- campaña persistente;
- animales autónomos con sonidos e incidentes ambientales sin peso probatorio.

La experiencia publicada es local y para una persona. La arquitectura mantiene separada la información pública y privada, pero este repositorio no incluye un servidor multijugador.

---

## 20. Ejecutar

El juego puede abrirse directamente mediante:

```text
index.html
```

También puede servirse desde la carpeta del proyecto:

```sh
python3 -m http.server 4173
```

Luego se abre:

```text
http://127.0.0.1:4173/
```

---

## 21. Norte del proyecto

Chamuyo funciona cuando el jugador deja de buscar “la carta falsa” y empieza a preguntarse:

- ¿Quién necesitaba qué?
- ¿Quién estuvo realmente ahí?
- ¿Qué dinero cambió de bolsillo?
- ¿Qué objeto existía?
- ¿Quién podía verificarlo?
- ¿Qué parte del relato quedó sin explicar?

El barrio debe seguir pareciendo vivo incluso si una ronda no contiene ninguna maniobra. La estafa resulta interesante precisamente porque se monta sobre favores, apuros, trabajos, compras y desprolijidades que ya tenían sentido antes de que alguien decidiera aprovecharlas.

---

## Derechos

Este repositorio no incluye una licencia de uso. Se reservan todos los derechos sobre el código, el diseño, los textos y los recursos originales.
