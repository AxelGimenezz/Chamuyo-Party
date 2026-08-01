# Chamuyo

**Chamuyo** es un party game social de barrio sobre mandados, plata, confianza y estafas escondidas dentro de situaciones cotidianas.

Una persona recorre un pueblo 2D junto a cinco personajes controlados por el juego. Cada vecino tiene oficio, bienes, saldo, necesidades y una agenda propia. Durante el día se compra, se vende, se trabaja, se negocia y se dejan rastros. Al atardecer, el barrio se reúne a comer para reconstruir qué pasó y decidir a quién auditar.

La mayor parte de las operaciones son legítimas. Una urgencia, un precio bajo o una explicación torpe pueden ser reales. La dificultad consiste en distinguir una desprolijidad cotidiana de una maniobra preparada.

## Cómo se juega

1. Se sortean roles secretos entre los seis personajes.
2. Elegís un mandado compatible con tu oficio y tu situación económica.
3. Caminás hasta cada destino, encontrás a la contraparte y resolvés la operación.
4. Mientras recorrés el pueblo podés observar movimientos y escuchar conversaciones cercanas.
5. Al final de la ronda llega la reunión **A comer**.
6. El barrio compara horarios, recibos, bienes, retiros, rumores y respuestas.
7. Una auditoría o un juicio determina si el Estafador fue descubierto o logró escapar.

## Roles

- **Vecino:** cumple sus tareas, cuida los recursos del barrio y vota con la información que consiguió.
- **Verificador:** además de jugar como vecino, puede pedir explicaciones concretas antes de una auditoría.
- **Estafador:** mantiene una vida pública normal mientras busca oportunidades para preparar o ejecutar una maniobra.
- **Cómplice:** conoce al Estafador, pero tiene intereses propios y puede negociar, colaborar, retener dinero o romper el acuerdo.

El Estafador y el Cómplice se conocen. Los demás sólo saben su propio papel.

## El pueblo

El mapa reúne comercios, viviendas e instituciones conectadas por tareas reales: almacén, banco y cajero, farmacia, imprenta, puesto de usados, taller, protectora de animales, oficina, escuela, municipalidad, capilla, plaza y casas del barrio.

Los personajes se desplazan de forma independiente. El jugador no decide por los bots: puede cumplir su agenda, desviarse para investigar o acercarse a una charla, pero cada vecino sigue con su propio asunto.

## Economía y campaña

Banco y efectivo son bolsillos separados. Una transferencia sale del banco; una negociación presencial puede exigir billetes; retirar en el cajero mueve dinero de un bolsillo al otro sin crear ingresos.

Comprar y vender también cambia la propiedad de los bienes. Los honorarios, adelantos, precios y diferencias negociadas quedan registrados como movimientos distintos.

La campaña persiste en el navegador: conserva saldos, pertenencias, relaciones y antecedentes entre partidas, mientras los roles secretos vuelven a sortearse.

## Controles

| Control | Acción |
| --- | --- |
| `WASD` o flechas | Caminar |
| Clic o toque | Marcar un destino caminable |
| `E` o `Enter` | Hablar o interactuar |
| `P` | Mostrar u ocultar el papelito del mandado |
| `I` | Abrir billetera, bienes y libreta |
| `1`–`6` | Elegir una acción disponible |

En pantallas táctiles hay una cruceta. El botón `MAPA` permite ampliar el área de juego.

## Ejecutar el juego

Chamuyo está hecho con HTML, CSS y JavaScript vanilla. No usa frameworks, no requiere compilación y no tiene dependencias de runtime.

Podés abrir `index.html` directamente en un navegador moderno.

Como alternativa, desde la carpeta del proyecto:

```sh
python3 -m http.server 4173
```

Después abrí:

```text
http://127.0.0.1:4173/
```

## Estado actual

Chamuyo es un MVP local y jugable de una persona contra cinco bots. Incluye:

- cuatro roles jugables;
- pueblo explorable;
- agendas y contrapartes;
- economía persistente con banco, efectivo y bienes;
- conversaciones observables por cercanía;
- rumores de baja fiabilidad;
- reuniones, interrogatorios, votación, auditoría y replay;
- personajes y animales con movimiento autónomo.

La documentación de diseño pública está en [docs/BIBLIA.md](docs/BIBLIA.md).

## Derechos

Este repositorio no incluye una licencia de uso. Se reservan todos los derechos sobre el código, el diseño, los textos y los recursos originales.
