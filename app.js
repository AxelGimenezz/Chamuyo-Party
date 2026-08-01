(function () {
  "use strict";

  const PLAYERS = [
    { id: "marta", name: "Marta", initials: "MA", skin: "#c98f68", hair: "#50352d", shirt: "#9f4939", color: "#a9503e", pos: [24, 61], detail: "rodete" },
    { id: "nico", name: "Nico", initials: "NI", skin: "#d5a071", hair: "#3e3028", shirt: "#4c7774", color: "#4e7774", pos: [42, 43], detail: "gorrita", human: true },
    { id: "luli", name: "Luli", initials: "LU", skin: "#dbaa7c", hair: "#c99535", shirt: "#a84c66", color: "#a34e69", pos: [63, 59], detail: "colita" },
    { id: "raul", name: "Don Raúl", initials: "DR", skin: "#bd8763", hair: "#d8d1bc", shirt: "#5d704f", color: "#677852", pos: [75, 38], detail: "bigote" },
    { id: "carla", name: "Carla", initials: "CA", skin: "#a96f50", hair: "#2b2625", shirt: "#d0a23f", color: "#bd8c32", pos: [36, 72], detail: "anteojos" },
    { id: "tano", name: "Tano", initials: "TA", skin: "#cf9871", hair: "#443027", shirt: "#6c6379", color: "#6c6379", pos: [60, 30], detail: "visera" }
  ];

  const TEMPLATES = [
    {
      id: "bike", place: "MARKETPLACE", channel: "VENTA DE BICI", task: actor => `${actor} quiere comprar tu bici`,
      title: "La bici y la transferencia demorada",
      legit: actor => `${actor} quiere comprar tu bici para ir al trabajo. Transfirió desde otro banco y figura “pendiente”. Manda DNI, acepta esperar y dice que el cadete puede volver mañana.`,
      scam: actor => `${actor} quiere retirar tu bici hoy. Manda una captura de transferencia “pendiente” y dice que el cadete ya está en camino, aunque todavía no aparece nada en tu cuenta.`,
      legitClues: ["Banco distinto", "Acepta esperar", "El cadete puede volver"],
      scamClues: ["Sólo hay captura", "Cadete en camino", "Retiro antes de acreditar"],
      actions: [
        card("Esperar acreditación", "La bici sale cuando la plata figura en la cuenta.", "verify"),
        card("Aceptar y coordinar mañana", "Tomar los datos y reservarla sin entregarla hoy.", "approve"),
        card("Cancelar y bloquear", "Dar toda la operación por falsa.", "reject"),
        card("Pedir otra mirada", "Mostrar captura y chat en la mesa.", "consult")
      ],
      scamMove: "Editar un comprobante", scamCaption: "Mandar la captura y apurar el retiro antes de que acrediten.",
      realSignal: "La demora era real: nadie exigía entregar y la transferencia terminó acreditando.",
      falseSignal: "La captura no correspondía a una transferencia emitida y el cadete era parte del apuro."
    },
    {
      id: "fridge", place: "PUESTO DE USADOS", channel: "COMPRA DE HELADERA", task: actor => `${actor} ofrece una heladera`,
      title: "Heladera buena, mudanza encima",
      legit: actor => `${actor} se muda el viernes y vende una heladera usada a buen precio. Tiene marcas en la puerta, invita a probarla en su casa y acepta cobrar al retirarla.`,
      scam: actor => `${actor} ofrece una heladera casi nueva a mitad de precio porque “se muda hoy”. No puede mostrarla, usa fotos prolijas y pide una reserva para pasar la dirección.`,
      legitClues: ["Precio bajo por mudanza", "Se puede probar", "Pago al retirar"],
      scamClues: ["Fotos sin detalle", "Dirección después de señar", "Mudanza hoy"],
      actions: [
        card("Ir a probarla", "Revisar frío, burletes y número de serie.", "verify"),
        card("Reservar sin transferir", "Acordar horario y pagar al retirar.", "approve"),
        card("Bajar la compra", "El precio bajo alcanza para descartarla.", "reject"),
        card("Buscar las fotos", "Compararlas y consultar a otra persona.", "consult")
      ],
      scamMove: "Cobrar una seña fantasma", scamCaption: "Usar fotos ajenas y pedir una reserva antes de dar dirección.",
      realSignal: "La urgencia era una mudanza real; se podía probar y pagar recién al retirar.",
      falseSignal: "Las fotos eran de otra publicación y la dirección dependía de pagar primero."
    },
    {
      id: "bank", place: "BANCO", channel: "TRANSFERENCIA", task: actor => `${actor} trae un problema del banco`,
      title: "El banco está demorado de verdad... ¿o no?",
      legit: actor => `${actor} muestra un aviso dentro de la app: habrá demoras hasta las 18 por mantenimiento. No pide códigos ni links; propone esperar y revisar el estado desde cada cuenta.`,
      scam: actor => `${actor} dice tener un contacto que “destraba” transferencias demoradas. Pasa un link parecido al del banco y asegura que hay que validar con el código que llegue.`,
      legitClues: ["Aviso dentro de la app", "No pide códigos", "Propone esperar"],
      scamClues: ["Contacto informal", "Dominio casi igual", "Validación con código"],
      actions: [
        card("Revisar desde la app", "Entrar sin usar el link que llegó.", "verify"),
        card("Esperar el mantenimiento", "No mover nada hasta las 18.", "approve"),
        card("Acusar al que avisó", "Tratar el aviso como una maniobra.", "reject"),
        card("Llamar al número oficial", "Confirmar la demora por cuenta propia.", "consult")
      ],
      scamMove: "Mandar un acceso gemelo", scamCaption: "Compartir un sitio parecido al banco para capturar el código.",
      realSignal: "El mantenimiento constaba en la app y la demora se resolvió sin entregar datos.",
      falseSignal: "El dominio tenía una letra cambiada y el código autorizaba un acceso nuevo."
    },
    {
      id: "family", place: "COMEDOR FAMILIAR", channel: "NÚMERO NUEVO", task: actor => `${actor} cambió de teléfono`,
      title: "“Soy yo, guardame este número”",
      legit: actor => `${actor} escribe desde un número nuevo porque perdió el celular. Manda un audio, recuerda dónde fue el último almuerzo y acepta una videollamada antes de pedir que le paguen un remedio.`,
      scam: actor => `${actor} aparece desde un número nuevo. Usa nombres y datos del último almuerzo, pero evita llamadas porque “está en la guardia” y manda un alias de otra persona.`,
      legitClues: ["Número nuevo", "Acepta videollamada", "Dato familiar verificable"],
      scamClues: ["Sabe datos de la familia", "Evita llamadas", "Alias de otra persona"],
      actions: [
        card("Hacer videollamada", "Confirmar cara y contexto antes de pagar.", "verify"),
        card("Pagar el remedio directo", "Llamar a la farmacia y abonarlo ahí.", "approve"),
        card("Bloquear el número", "No dar lugar a ninguna explicación.", "reject"),
        card("Llamar al número anterior", "Cruzar la historia por otro canal.", "consult")
      ],
      scamMove: "Imitar al familiar", scamCaption: "Usar datos del grupo y mandar un alias prestado con urgencia.",
      realSignal: "El cambio de número era real y aceptó verificar sin controlar el canal ni el pago.",
      falseSignal: "Los detalles estaban en redes; evitó la llamada y el alias no tenía relación con la familia."
    },
    {
      id: "rental", place: "ALQUILER TEMPORARIO", channel: "FINDE LARGO", task: actor => `${actor} ofrece una cabaña`,
      title: "La cabaña liberada a último momento",
      legit: actor => `${actor} ofrece la cabaña de una tía más barata porque se cayó una reserva. Da dirección, permite que un vecino muestre el lugar y propone pago protegido.`,
      scam: actor => `${actor} ofrece una cabaña impecable barata por una cancelación. Manda ubicación aproximada, no consigue hacer video y pide seña directa porque hay otra familia esperando.`,
      legitClues: ["Precio por cancelación", "Dirección comprobable", "Pago protegido"],
      scamClues: ["Ubicación aproximada", "No hay video", "Otra familia espera"],
      actions: [
        card("Pedir recorrido en vivo", "Ver fachada, calle y entrada en la misma llamada.", "verify"),
        card("Reservar con protección", "Pagar sólo dentro de la plataforma.", "approve"),
        card("Denunciar la publicación", "Asumir que el descuento es falso.", "reject"),
        card("Llamar a un comercio cercano", "Confirmar dirección y referencias.", "consult")
      ],
      scamMove: "Señar una cabaña ajena", scamCaption: "Copiar fotos y cobrar la reserva fuera de la plataforma.",
      realSignal: "La cancelación existía, la dirección coincidía y el pago nunca salió de la plataforma.",
      falseSignal: "La ubicación era imprecisa y la seña iba a una cuenta sin relación con el alojamiento."
    },
    {
      id: "job", place: "OFICINA", channel: "TRABAJO REMOTO", task: actor => `${actor} comparte una búsqueda laboral`,
      title: "Trabajo remoto con ingreso rápido",
      legit: actor => `${actor} comparte una búsqueda de soporte remoto. Hay entrevista por video, correo del dominio de la empresa y capacitación paga por el empleador, aunque necesitan cubrir el puesto esta semana.`,
      scam: actor => `${actor} ofrece tareas remotas simples y buen pago. La entrevista es sólo por chat; para activar la cuenta hay que pagar un curso y recibir transferencias de clientes.`,
      legitClues: ["Ingreso esta semana", "Entrevista por video", "La empresa paga el curso"],
      scamClues: ["Entrevista por chat", "Pagar para entrar", "Recibir plata ajena"],
      actions: [
        card("Comprobar empresa y dominio", "Llamar al contacto publicado en su web.", "verify"),
        card("Hacer la entrevista", "Avanzar sin pagar ni prestar la cuenta.", "approve"),
        card("Reportar la búsqueda", "Dar por falsa toda oferta urgente.", "reject"),
        card("Consultar a alguien del rubro", "Comparar proceso y condiciones.", "consult")
      ],
      scamMove: "Vender una capacitación", scamCaption: "Cobrar el curso y usar cuentas ajenas para mover transferencias.",
      realSignal: "La empresa existía, entrevistaba por canales propios y cubría todos los gastos.",
      falseSignal: "El curso era el cobro y la cuenta del postulante iba a quedar como puente."
    },
    {
      id: "qr", place: "KIOSCO", channel: "PAGO CON QR", task: actor => `${actor} organiza el pago del almuerzo`,
      title: "El QR pegado junto a la caja",
      legit: actor => `${actor} propone pagar el almuerzo con el QR del mostrador. El alias coincide con el ticket, la cajera dice el monto antes de escanear y se puede pagar también en efectivo.`,
      scam: actor => `${actor} señala un QR pegado sobre el original. El alias es un nombre personal que nadie reconoce y dice que el comercio cambió de cuenta esa mañana.`,
      legitClues: ["Alias en el ticket", "Monto confirmado", "Hay otras formas de pago"],
      scamClues: ["Sticker sobre otro", "Alias personal", "Cambio de cuenta hoy"],
      actions: [
        card("Confirmar el alias en caja", "Leer destinatario y monto en voz alta.", "verify"),
        card("Pagar desde el ticket", "Usar el QR impreso en la cuenta.", "approve"),
        card("Cancelar todo el almuerzo", "No pagar hasta otro día.", "reject"),
        card("Guardar foto del QR", "Compararlo con el que tiene la cajera.", "consult")
      ],
      scamMove: "Cambiar el QR", scamCaption: "Pegar un código propio sobre el del comercio y cobrar la mesa.",
      realSignal: "El destinatario coincidía con el ticket y la caja confirmó el pago.",
      falseSignal: "Había un adhesivo encima del QR original y el alias era una cuenta personal."
    },
    {
      id: "phone", place: "PLAZA", channel: "CELULAR USADO", task: actor => `${actor} vende un celular`,
      title: "Celular usado con apuro razonable",
      legit: actor => `${actor} vende un celular porque ya compró otro. Tiene factura, permite revisar el IMEI y quiere cerrar hoy porque viaja mañana, pero acepta encontrarse en la plaza y cobrar ahí.`,
      scam: actor => `${actor} vende un celular nuevo a precio bajo. Dice que viaja mañana, manda una factura borrosa y pide una reserva antes de mostrar IMEI o coordinar encuentro.`,
      legitClues: ["Viaja mañana", "Factura legible", "Prueba antes de pagar"],
      scamClues: ["Factura borrosa", "Reserva primero", "No muestra IMEI"],
      actions: [
        card("Revisar IMEI y equipo", "Probarlo en persona antes de pagar.", "verify"),
        card("Coordinar en la plaza", "Cerrar hoy, pero cara a cara.", "approve"),
        card("Bloquear al vendedor", "Tomar el viaje como presión falsa.", "reject"),
        card("Comprobar la factura", "Llamar al comercio que figura en ella.", "consult")
      ],
      scamMove: "Cobrar una reserva", scamCaption: "Usar factura borrosa y desaparecer después de la seña.",
      realSignal: "El viaje era real, pero nunca impidió probar el equipo ni revisar su origen.",
      falseSignal: "La reserva era el objetivo; no había equipo ni IMEI para comprobar."
    }
  ];

  const STORY_EXTRAS = {
    bike: {
      questions: [
        question("¿Por qué necesitabas retirar la bici hoy?", "La quería para ir al trabajo, pero si no acredita la busco mañana.", "Había arreglado el flete hoy… igual no te voy a pedir que la entregues.", "El cadete ya hizo el viaje; si vuelve pierdo la plata del envío.", "La necesito hoy. Después vemos lo del banco."),
        question("¿Desde qué banco transferiste y qué estado figura?", "Desde Provincia; figura pendiente y tengo el número de operación.", "No recuerdo el código, pero lo busco desde la app.", "Desde una billetera, por eso no aparece como transferencia común.", "No puedo entrar ahora, pero la captura demuestra que salió."),
        question("¿Qué hacemos si mañana todavía no acreditó?", "Cancelamos o vuelvo a transferir cuando el banco libere la primera.", "Espero hasta mañana y llamo al banco, no hay drama.", "Seguro acredita antes; no haría falta esperar.", "Primero entregame la bici y después reclamo yo.")
      ]
    },
    fridge: {
      questions: [
        question("¿A dónde te mudás y por qué no te la llevás?", "A un departamento chico en Almagro; ya tiene heladera.", "Todavía no sé el piso, lo alquiló mi hermana, pero es amueblado.", "Me voy lejos y el flete sale más que otra heladera.", "Me voy lejos y no tengo la dirección acá."),
        question("¿Cuándo se puede probar?", "Hoy después de las seis; está enchufada y con botellas frías.", "A la noche; antes tengo que ordenar el pasillo.", "Está guardada en un depósito que cierra temprano.", "Después de señar te paso el contacto que tiene la llave."),
        question("¿Por qué está tan barata?", "Tiene un estante roto y necesito liberar el departamento.", "Le falla la luz de adentro, pero enfría bien.", "La puse baja para no pagar otro mes de depósito.", "El precio dura sólo diez minutos porque me voy hoy.")
      ]
    },
    bank: {
      questions: [
        question("¿Dónde viste el aviso de mantenimiento?", "En las notificaciones internas de la app.", "Me apareció al entrar; cerré rápido y no saqué captura.", "En una página de ayuda que parecía oficial.", "En el enlace que me mandó un supuesto asesor."),
        question("¿Qué número llamaste para confirmar?", "El que figura detrás de la tarjeta.", "No llamé todavía; prefiero hacerlo desde la app.", "Me llamó directamente el sector de seguridad.", "No sé el número; lo tenía agendado como Soporte."),
        question("¿Para qué serviría el código?", "No hace falta ningún código; sólo hay que esperar.", "La app manda códigos, pero no se los diría a nadie.", "Según soporte, confirma que sos titular.", "Para cancelar la transferencia demorada desde el sistema.")
      ]
    },
    family: {
      questions: [
        question("¿Qué pasó con tu teléfono anterior?", "Lo perdí en el colectivo y ya suspendí la línea.", "No sé si lo perdí o me lo sacaron; estaba sin batería.", "Se rompió y quedó en un local de reparación.", "Se rompió y no puedo llamar ni hacer video."),
        question("¿Cuál es tu número nuevo completo?", "Es el mismo desde el que escribo: termina en 4821.", "Esperá que lo miro… sí, termina en 4821.", "Es éste, aunque la línea todavía está a nombre de otra persona.", "Termina en 4281… o 4821, ahora no lo tengo agendado."),
        question("¿Por qué el alias pertenece a otra persona?", "Es la farmacia; si querés llamala y pagá el remedio directo.", "Es de la farmacia de turno, te paso el teléfono.", "Es un compañero que me hace el favor porque no tengo banco.", "Es un compañero; no lo llames porque está trabajando.")
      ]
    },
    rental: {
      questions: [
        question("¿Cuál es la dirección exacta?", "Los Aromos 184; enfrente hay un almacén con toldo verde.", "Creo que es 184 o 186; la factura municipal dice 184.", "Es entrando por la ruta, después mando la ubicación.", "Queda por la zona del lago; la dirección aparece al reservar."),
        question("¿Quién puede mostrar el lugar?", "El vecino del frente tiene la llave; hacemos video con él.", "Mi tía coordina con el vecino, ahora busco su número.", "La encargada puede ir después de la seña.", "Primero era el casero… creo que finalmente va mi tía."),
        question("¿Por qué no usamos pago protegido?", "Lo usamos; la comisión está incluida.", "Prefiero la plataforma aunque tarde en liberar el dinero.", "La plataforma me bloqueó temporalmente los cobros.", "Demora demasiado y necesito confirmar hoy por transferencia.")
      ]
    },
    job: {
      questions: [
        question("¿Cuál es la empresa y quién entrevista?", "Es Andén Sur SRL; entrevista Paula Méndez desde andensur.com.ar.", "No recuerdo el apellido, pero el correo usa el dominio de la empresa.", "Es una consultora que trabaja para varias marcas conocidas.", "Dicen ser Andén Sur, pero escriben desde un correo gratuito."),
        question("¿Quién paga la capacitación?", "La empresa; empieza después de firmar.", "La cubren ellos, aunque todavía no mandaron el cronograma.", "La pagás vos y se reintegra con el primer sueldo.", "Primero dijeron capacitación y después matrícula de ingreso."),
        question("¿Por qué necesitan una cuenta personal?", "No la necesitan; todos los cobros pasan por la empresa.", "Pidieron CBU para el sueldo, no para mover plata.", "Es una prueba corta para habilitar el panel.", "Hay que recibir plata y devolverla para activar el puesto.")
      ]
    },
    qr: {
      questions: [
        question("¿A nombre de quién aparece el alias?", "De Lo de Beto SRL, igual que en el ticket.", "Figura Beto Gómez; la cajera mostró que es el dueño.", "Es una cuenta de cobros que usa el comercio.", "Es una persona que nadie en caja reconoce."),
        question("¿Quién autorizó el cambio de QR?", "No hubo cambio; es el mismo del ticket.", "La cajera comparó ambos y confirmó el vigente.", "La encargada del turno mañana lo dejó listo.", "Primero me dijeron la cajera y después el dueño."),
        question("¿Por qué hay un adhesivo sobre otro?", "Taparon uno vencido y caja puede mostrar el alta del nuevo.", "Lo renovaron ayer; igual lo confirmamos en caja.", "Es una actualización del proveedor de cobros.", "Se desactualizó, pero no hace falta consultarlo en caja.")
      ]
    },
    phone: {
      questions: [
        question("¿Cuál es el IMEI?", "Lo abrimos desde ajustes y lo comparamos con la caja.", "No sé dónde está, pero marcamos el código para verlo.", "Prefiero mostrarlo en persona por seguridad.", "No lo muestro hasta recibir una reserva."),
        question("¿Dónde compraste el teléfono?", "En Casa Núñez, en marzo; acá está la factura completa.", "Fue en marzo o abril, la factura tiene la fecha exacta.", "En un comercio que cerró, por eso no se puede llamar.", "La factura no tiene número y ese local no vende el modelo."),
        question("¿Por qué necesitás cerrar hoy?", "Viajo mañana, pero si no se vende se lo dejo a mi hermano.", "Quería resolver antes del viaje, aunque puedo esperar.", "Otra persona lo quiere y ya prometió reservarlo.", "Si no reservás ahora se lo lleva alguien sin probarlo.")
      ]
    }
  };

  const SOCIAL_PROFILES = [
    { id: "store", label: "almacenero/a", place: "el almacén" },
    { id: "delivery", label: "cadete", place: "los repartos" },
    { id: "shelter", label: "voluntario/a de la protectora", place: "la protectora" },
    { id: "landlord", label: "propietario/a", place: "los alquileres" },
    { id: "technician", label: "técnico/a en frío", place: "el barrio haciendo arreglos a domicilio" },
    { id: "printer", label: "imprentero/a", place: "la imprenta" },
    { id: "reseller", label: "revendedor/a", place: "marketplace" },
    { id: "accountant", label: "administrativo/a", place: "la oficina" }
  ];

  const ECONOMY_CONFIG = {
    version: 2,
    pricesAsOf: "2026-07-26",
    storageKey: "chamuyo.campaign.v2",
    initialBank: 20000,
    initialCash: 10000,
    publicBands: [
      { max: 99999, label: "Justo" },
      { max: 299999, label: "Se maneja" },
      { max: Infinity, label: "Tiene resto" }
    ],
    prices: {
      bike: 190000, fridge: 300000, phone: 260000, printer: 350000, freezer: 650000,
      tools: 220000, freezerRepair: 120000, flyers: 65000, petFood: 90000,
      medicine: 48000, lunch: 36000, homeDeposit: 630000, shopDeposit: 1200000, carGoal: 800000
    },
    preparationCosts: { mule: 50000, "qr-sticker": 30000, "fake-flyers": 80000, "cloned-listing": 25000, "borrowed-identity": 120000, "edited-receipt": 45000 },
    weeklyAvailable: 55000,
    remoteWeeklyAvailable: 80000,
    remoteGrossSalary: 1248000,
    surplusThreshold: 25000
  };

  const PROFESSION_ECONOMY = {
    store: { grossSalary: 1250000, assets: [["fridge", "Heladera exhibidora", 300000], ["stock", "Mercadería del almacén", 150000]] },
    delivery: { grossSalary: 950000, assets: [["bike", "Bicicleta de reparto", 190000], ["phone", "Celular de trabajo", 260000]] },
    shelter: { grossSalary: 850000, assets: [["fridge", "Heladera donada", 300000], ["shelter-kit", "Alimento y materiales", 150000]] },
    landlord: { grossSalary: 1300000, assets: [["tools", "Herramientas de mantenimiento", 220000], ["repair-fund", "Fondo de reparación", 230000]] },
    technician: { grossSalary: 1200000, assets: [["tools", "Juego de herramientas", 220000], ["parts", "Repuestos de frío", 230000]] },
    printer: { grossSalary: 1150000, assets: [["printer", "Impresora de trabajo", 350000], ["paper", "Papel y adhesivos", 100000]] },
    reseller: { grossSalary: 1050000, assets: [["phone", "Celular usado", 260000], ["bike", "Bicicleta usada", 190000]] },
    accountant: { grossSalary: 1250000, assets: [["laptop", "Notebook de oficina", 350000], ["office-kit", "Equipo de oficina", 100000]] }
  };

  const SCENARIO_AMOUNTS = { bike: 57000, fridge: 90000, bank: 50000, family: 48000, rental: 189000, job: 75000, qr: 36000, phone: 78000 };
  const DECISION_SECONDS = 50;
  const DAY_SECONDS = 270;
  const HEARING_RADIUS = 120;
  const GOSSIP_VOTE_WEIGHT = .05;
  const DIRTY_SHOE_DURATION = 8000;
  const DIRTY_SHOE_ENTER_RADIUS = 95;
  const DIRTY_SHOE_EXIT_RADIUS = 130;
  const POOP_REACTION_CHANCE = .2;
  const POOP_REACTION_LINES = [
    "La suerte te persigue… qué baranda.",
    "Ufff… pisaste un regalito.",
    "Mamadera, no sé si lavando le podés sacar eso.",
    "Terrible olor. Prendé fuego las zapatillas, hacé algo.",
    "Pará un poco… dejaste media vereda en la suela.",
    "No te acerques tanto. Primero buscá un charco."
  ];
  const ROUTE_PRIORITY = { encounter: 100, counterpart: 80, settlement: 70, story: 60, agenda: 40, gossip: 20 };
  const ENTITY_BASE = 100;
  const URL_FLAGS = new URLSearchParams(location.search);
  const QA_MODE = URL_FLAGS.get("qa") === "1";
  const QA_RESET = QA_MODE && URL_FLAGS.get("reset") === "1";
  const DEBUG_MODE = URL_FLAGS.get("debug") === "1" || QA_MODE;
  const DEBUG_BOTS_IDLE = URL_FLAGS.get("debugBots") === "idle";
  const DEBUG_DAY_SECONDS = clampDebugSeconds(Number(URL_FLAGS.get("debugDay")));
  const DEBUG_SEED = (() => { const raw = Number(URL_FLAGS.get("debugSeed")); return Number.isFinite(raw) ? Math.abs(raw >>> 0) : null; })();
  const NPC_DECISION_DELAY = QA_MODE ? 90 : 1800;
  const NPC_CONTINUE_DELAY = QA_MODE ? 120 : 2400;
  const BOT_MOVE_SPEED = QA_MODE ? 720 : 95;

  function clampDebugSeconds(value) {
    return Number.isFinite(value) && value >= 5 && value <= DAY_SECONDS ? Math.round(value) : DAY_SECONDS;
  }

  const WORLD_GEOMETRY = [
    { id:"almacén", x:86, y:70, w:196, h:156, fp:{x:98,y:86,w:172,h:132}, door:{x:184,y:212}, ip:[184,255] },
    { id:"banco", x:400, y:64, w:200, h:162, fp:{x:412,y:80,w:176,h:138}, door:{x:500,y:212}, ip:[500,255] },
    { id:"farmacia", x:612, y:82, w:176, h:142, fp:{x:624,y:98,w:152,h:118}, door:{x:700,y:210}, ip:[700,250] },
    { id:"imprenta", x:996, y:68, w:210, h:156, fp:{x:1008,y:84,w:186,h:132}, door:{x:1101,y:210}, ip:[1100,250] },
    { id:"escuela", x:1246, y:56, w:228, h:168, fp:{x:1258,y:72,w:204,h:144}, door:{x:1360,y:210}, ip:[1360,260] },
    { id:"municipalidad", x:72, y:374, w:210, h:156, fp:{x:84,y:390,w:186,h:132}, door:{x:177,y:516}, ip:[178,570] },
    { id:"iglesia", x:1350, y:400, w:162, h:202, fp:{x:1362,y:416,w:138,h:178}, door:{x:1431,y:588}, ip:[1431,630] },
    { id:"protectora", x:66, y:678, w:230, h:160, fp:{x:78,y:694,w:206,h:136}, door:{x:181,y:824}, ip:[184,870] },
    { id:"oficina", x:346, y:684, w:202, h:148, fp:{x:358,y:700,w:178,h:124}, door:{x:447,y:818}, ip:[450,870] },
    { id:"comedor familiar", x:556, y:692, w:196, h:148, fp:{x:568,y:708,w:172,h:124}, door:{x:654,y:826}, ip:[654,875] },
    { id:"departamento", x:960, y:664, w:214, h:174, fp:{x:972,y:680,w:190,h:150}, door:{x:1067,y:824}, ip:[1067,865] },
    { id:"casa-4", x:1290, y:688, w:100, h:140, fp:{x:1302,y:704,w:76,h:116}, door:{x:1340,y:814}, ip:[1340,858] },
    { id:"casa-6", x:1406, y:688, w:100, h:140, fp:{x:1418,y:704,w:76,h:116}, door:{x:1456,y:814}, ip:[1456,858] },
    { id:"puesto de usados", x:966, y:392, w:150, h:96, fp:{x:966,y:392,w:150,h:96}, door:{x:1041,y:488}, ip:[1041,510] },
    { id:"parada de colectivo", x:320, y:320, w:62, h:78, fp:null, door:{x:351,y:398}, ip:[351,410] }
  ];
  const WORLD_COLLIDERS = [
    { id:"plaza-fountain", x:456, y:459, w:78, h:78 },
    { id:"plaza-bench-1", x:377, y:578, w:68, h:16 },
    { id:"plaza-bench-2", x:555, y:578, w:68, h:16 },
    { id:"detail-bench", x:1010, y:590, w:74, h:15 },
    { id:"detail-planters-1", x:950, y:650, w:33, h:23 }
  ];
  let LOCATION_POINTS = {};
  function buildLocationPoints() {
    const pts = { plaza: [500, 660], "los repartos": [314, 322], marketplace: [900, 500] };
    WORLD_GEOMETRY.forEach(g => { if (g.ip) pts[g.id] = g.ip; });
    pts.local = pts["almacén"];
    if (pts["departamento"]) pts["los alquileres"] = pts["departamento"];
    LOCATION_POINTS = pts;
  }
  const SPAWN_POINTS = [[620, 330], [680, 520], [680, 630], [1040, 560], [610, 650], [1080, 640]];

  const MOTIVATIONS = [
    "pagar remedios para un hijo", "llegar con un regalo para su pareja", "cubrir un viaje que reservó sin fondos",
    "ponerse al día con el alquiler", "comprar herramientas para volver a trabajar", "completar el dinero para un auto",
    "pagar una cirugía veterinaria", "ampliar el negocio familiar"
  ];

  const MISSION_LIBRARY = {
    bike: [
      mission("bike-test", "Probar la bici para los repartos", "Probé la bicicleta cerca del almacén.", "No la compré porque la transferencia seguía pendiente.", "la plaza", "bicicleta", { type: "income", amount: 25000 }),
      mission("bike-carry", "Ayudar con el traslado de la bici", "Coordiné el flete y revisé los frenos.", "El cadete cambió el horario y el traslado quedó pendiente.", "el almacén", "bicicleta", { type: "income", amount: 40000 })
    ],
    fridge: [
      mission("fridge-review", "Revisar una heladera usada", "Probé la heladera y anoté el número de serie.", "No pude probarla porque estaba desenchufada.", "el puesto de usados", "heladera", { type: "income", amount: 45000 }),
      mission("fridge-buy", "Comprar una heladera para el trabajo", "Compré la heladera después de probarla y guardé el recibo.", "No la compré porque no pude comprobar cómo enfriaba.", "el puesto de usados", "heladera", { type: "buy", assetType: "fridge", assetLabel: "Heladera usada", amount: 300000 }),
      mission("fridge-delivery", "Llevar una heladera a la protectora", "Organicé el traslado de la heladera vieja.", "El flete no llegó y la heladera quedó guardada.", "la protectora", "heladera", { type: "income", amount: 40000 }),
      mission("fridge-sell", "Vender una heladera para completar el auto", "Vendí la heladera después de que la probaran y guardé el recibo.", "La publicación quedó activa, pero nadie llegó a probarla.", "el puesto de usados", "heladera", { type: "sell", assetType: "fridge", amount: 300000 })
    ],
    bank: [
      mission("bank-delay", "Confirmar una demora bancaria", "Consulté la demora desde la aplicación oficial.", "La operación seguía pendiente cuando cerré la aplicación.", "el banco", "transferencia"),
      mission("bank-open-account", "Abrir una cuenta para cobrar un trabajo", "Abrí una cuenta para recibir un sueldo.", "No terminé el alta porque faltaba validar la identidad.", "el banco", "cuenta")
    ],
    family: [
      mission("family-line", "Ayudar con un teléfono nuevo", "Acompañé el cambio de línea y guardé el número nuevo.", "No compramos el teléfono porque no pudimos comprobar el titular.", "el comedor familiar", "teléfono", { type: "income", amount: 25000 }),
      mission("family-medicine", "Comprar los remedios de Marta", "Compré los remedios y se los llevé a Marta.", "La compra quedó pendiente y Marta conservó el adelanto.", "la farmacia", "remedio", { type: "medicine-errand", productCost: 48000, serviceFee: 15000 })
    ],
    rental: [
      mission("rental-local", "Visitar el local contiguo", "Fui a ver el local y revisé el contrato.", "No dejé seña porque faltaba confirmar al propietario.", "el local", "contrato"),
      mission("rental-home", "Buscar un departamento para mudarse", "Visité el departamento y guardé el contrato para seguir ahorrando la seña.", "La visita se hizo, pero el alquiler no se concretó.", "el departamento", "alquiler", { type: "goal", amount: 630000 })
    ],
    job: [
      mission("job-interview", "Hacer una entrevista de trabajo", "Hice la entrevista y guardé el correo de la empresa.", "No avancé porque pedían mover plata de clientes.", "la oficina", "empleo"),
      mission("job-shift", "Cubrir una carga administrativa", "Cargué pedidos durante un turno y guardé el recibo del jornal.", "El sistema estuvo caído y el turno quedó asentado sin pago.", "la oficina", "empleo", { type: "income", amount: 45000 })
    ],
    qr: [
      mission("qr-pickup", "Retirar folletos de la protectora", "Retiré la tanda original y la llevé a la protectora.", "No la repartí porque el QR salió borroso.", "la imprenta", "folletos", { type: "income", amount: 30000 }),
      mission("qr-delivery", "Repartir la colecta por el barrio", "Repartí folletos auténticos cerca del almacén.", "Suspendí el reparto hasta confirmar el alias.", "el almacén", "QR", { type: "income", amount: 30000 })
    ],
    phone: [
      mission("phone-buy", "Comprar un celular para trabajar en Usados", "Revisé el IMEI, compré el celular y guardé la factura.", "No lo compré porque no mostraron el IMEI.", "el puesto de usados", "celular", { type: "buy", assetType: "phone", assetLabel: "Celular usado", amount: 260000 }),
      mission("phone-sell", "Vender un celular usado en Usados", "El comprador revisó factura, IMEI y equipo antes de pagar.", "La venta quedó pendiente porque el comprador no llegó o el IMEI no cerró.", "el puesto de usados", "celular", { type: "sell", assetType: "phone", amount: 260000 })
    ]
  };

  const PROFILE_AFFINITIES = {
    store: ["bike", "fridge", "rental", "qr"], delivery: ["bike", "qr", "phone"], shelter: ["fridge", "qr", "family"],
    landlord: ["rental", "fridge", "bank"], technician: ["fridge", "phone", "bike"], printer: ["qr", "rental", "job"],
    reseller: ["bike", "fridge", "phone", "rental"], accountant: ["bank", "job", "family", "rental"]
  };

  const SCENARIO_TAGS = {
    bike: ["commerce", "bike", "transfer", "marketplace"], fridge: ["commerce", "appliance", "marketplace"],
    bank: ["bank", "transfer", "support"], family: ["identity", "phone", "transfer"],
    rental: ["listing", "rental", "transfer"], job: ["job", "bank", "identity"],
    qr: ["qr", "flyers", "commerce", "charity"], phone: ["listing", "phone", "identity", "marketplace"]
  };

  const PREPARATIONS = [
    preparation("mule", "Cuenta mula", "CUENTA", ["bank", "job", "transfer"], ["bank", "job", "family"], "Abriste una cuenta nueva mientras resolvías un cobro real.", "Pedir que la plata pase por una cuenta puente."),
    preparation("qr-sticker", "QR adhesivo", "STICKER", ["qr", "commerce", "flyers"], ["qr"], "Copiaste el tamaño y el alias de un QR legítimo.", "Pegar un QR propio sobre el de caja."),
    preparation("fake-flyers", "Folletos falsos", "VOLANTE", ["flyers", "charity", "qr"], ["qr"], "Encargaste una tanda casi igual a la de la protectora.", "Mezclar folletos con un alias distinto."),
    preparation("cloned-listing", "Publicación clonada", "AVISO", ["marketplace", "listing", "commerce", "rental"], ["bike", "fridge", "rental", "phone"], "Guardaste fotos y datos de una publicación auténtica.", "Cobrar una reserva por un objeto o lugar ajeno."),
    preparation("borrowed-identity", "Identidad prestada", "LÍNEA", ["identity", "phone", "support", "rental"], ["family", "bank", "rental", "job", "phone"], "Conseguiste una línea y datos prestados detrás de un trámite real.", "Hacerse pasar por un familiar, soporte o propietario."),
    preparation("edited-receipt", "Comprobante editado", "RECIBO", ["transfer", "bank", "commerce", "bike"], ["bike", "fridge", "bank"], "Fotografiaste un comprobante verdadero para copiar su formato.", "Mostrar una transferencia que nunca fue emitida.")
  ];

  const PREPARATION_BY_SCENARIO = {
    bike: ["cloned-listing", "edited-receipt", "mule"], fridge: ["cloned-listing", "edited-receipt", "fake-flyers"],
    bank: ["mule", "borrowed-identity", "edited-receipt"], family: ["borrowed-identity", "mule", "fake-flyers"],
    rental: ["cloned-listing", "borrowed-identity", "mule"], job: ["mule", "borrowed-identity", "edited-receipt"],
    qr: ["qr-sticker", "fake-flyers", "mule"], phone: ["borrowed-identity", "cloned-listing", "edited-receipt"]
  };

  function card(label, caption, stance, line = "") { return { label, caption, stance, line }; }
  function mission(id, text, completedFact, attemptedFact, location, asset, economy = null) { return { id, text, completedFact, attemptedFact, location, asset, economy }; }
  function missionPayment(values = {}) {
    return {
      bankDelta: values.bankDelta || 0,
      cashDelta: values.cashDelta || 0,
      advance: values.advance || 0,
      productCost: values.productCost || 0,
      serviceFee: values.serviceFee || 0,
      refund: values.refund || 0,
      retainedDifference: values.retainedDifference || 0,
      negotiatedPrice: values.negotiatedPrice || 0,
      requiredBank: values.requiredBank || 0,
      requiredCash: values.requiredCash || 0,
      requiredTotal: values.requiredTotal || 0
    };
  }
  function missionBenefit(type, text, amount = 0, unlock = null) { return { type, text, amount, unlock }; }
  function missionRisk(economic, social) { return { economic, social }; }
  function missionOption(values) {
    return {
      id: values.id,
      label: values.label,
      caption: values.caption,
      result: values.result,
      money: values.money || 0,
      payment: missionPayment(values.payment),
      benefit: values.benefit || missionBenefit("none", "No te deja plata ni bien nuevo.", 0, null),
      evidence: values.evidence || [],
      evidenceText: values.evidenceText || values.evidence?.join(" · ") || "Sin respaldo",
      risk: values.risk || missionRisk("Bajo", "Bajo"),
      riskLabel: values.riskLabel || `${values.risk?.economic || "Bajo"} / ${values.risk?.social || "Bajo"}`,
      steps: values.steps || [],
      paymentChannel: values.paymentChannel || "bank",
      medicine: Boolean(values.medicine),
      advanceAmount: values.advanceAmount || 0,
      productCost: values.productCost || 0,
      serviceFee: values.serviceFee || 0,
      refundAmount: values.refundAmount || 0,
      retainedDifference: values.retainedDifference || 0
    };
  }

  function missionCancelOption(item, overrides = {}) {
    return missionOption({
      id: `${item.id}-cancel`,
      label: overrides.label || "Retirarme con motivo",
      caption: overrides.caption || "No movés plata. Quedan la visita, el horario y el motivo.",
      result: "cancelled",
      payment: missionPayment(),
      benefit: missionBenefit("none", "No ganás plata, pero dejás un intento asentado."),
      evidence: [overrides.evidence || "Registro de visita"],
      evidenceText: overrides.evidence || "Registro de visita",
      risk: missionRisk(overrides.economicRisk || "Bajo", overrides.socialRisk || "Medio"),
      riskLabel: `${overrides.economicRisk || "Bajo"} / ${overrides.socialRisk || "Medio"}`,
      steps: overrides.steps || [item.location],
      paymentChannel: "none",
      money: 0
    });
  }

  function missionOptions(item) {
    const amount = item.economy?.amount || 0;
    const place = item.location;
    const cancel = missionCancelOption(item);
    switch (item.id) {
      case "bank-delay":
        return [
          missionOption({
            id: "wait",
            label: "Esperar la acreditación",
            caption: "Protegés una reserva o un pago pendiente sin regalar datos.",
            result: "verified",
            money: 0,
            payment: missionPayment(),
            benefit: missionBenefit("protection", "Te deja un reclamo abierto y una transferencia protegida."),
            evidence: ["Número de reclamo", "Captura del estado pendiente"],
            evidenceText: "Número de reclamo",
            risk: missionRisk("Bajo", "Bajo"),
            riskLabel: "Bajo / Bajo",
            steps: ["banco"],
            paymentChannel: "none"
          }),
          missionOption({
            id: "claim",
            label: "Abrir reclamo formal",
            caption: "Dejás sellado el problema y podés volver con comprobante.",
            result: "verified",
            money: 0,
            payment: missionPayment(),
            benefit: missionBenefit("protection", "Te deja un reclamo formal y más respaldo si la demora sigue."),
            evidence: ["Reclamo sellado", "Canal oficial"],
            evidenceText: "Reclamo sellado",
            risk: missionRisk("Bajo", "Bajo"),
            riskLabel: "Bajo / Bajo",
            steps: ["banco"],
            paymentChannel: "none"
          }),
          missionCancelOption(item, { label: "Cortar y seguir después", caption: "No ganás plata. Sólo queda asentado que la operación siguió demorada.", evidence: "Estado de operación", socialRisk: "Bajo" })
        ];
      case "family-medicine":
        return [
          missionOption({
            id: "medicine-normal",
            label: "Comprar al precio de lista",
            caption: "Usás el adelanto exacto y cobrás sólo el honorario.",
            result: "verified",
            money: 15000,
            payment: missionPayment({ advance: 48000, productCost: 48000, serviceFee: 15000, requiredBank: 0 }),
            benefit: missionBenefit("fee", "Te deja el honorario de Marta.", 15000),
            evidence: ["Ticket por $48.000", "Transferencia del adelanto", "Entrega en mano"],
            evidenceText: "Ticket por $48.000",
            risk: missionRisk("Bajo", "Bajo"),
            riskLabel: "Bajo / Bajo",
            steps: ["comedor familiar", "farmacia", "comedor familiar"],
            paymentChannel: "bank",
            medicine: true,
            advanceAmount: 48000,
            productCost: 48000,
            serviceFee: 15000
          }),
          missionOption({
            id: "medicine-cash",
            label: "Negociar efectivo a $30.000",
            caption: "Podés ahorrar fuerte y decidir después qué contás.",
            result: "informal",
            money: 33000,
            payment: missionPayment({ advance: 48000, productCost: 30000, serviceFee: 15000, retainedDifference: 18000, requiredCash: 30000, requiredTotal: 30000, negotiatedPrice: 30000 }),
            benefit: missionBenefit("difference", "Te deja el honorario y la diferencia negociada.", 33000),
            evidence: ["Ticket simple por $30.000", "Ida y vuelta al cajero", "Conversación con la farmacia"],
            evidenceText: "Ticket simple por $30.000",
            risk: missionRisk("Medio", "Medio"),
            riskLabel: "Medio / Medio",
            steps: ["comedor familiar", "farmacia", "comedor familiar"],
            paymentChannel: "cash",
            medicine: true,
            advanceAmount: 48000,
            productCost: 30000,
            serviceFee: 15000,
            retainedDifference: 18000
          }),
          missionOption({
            id: "medicine-generic",
            label: "Llevar marca equivalente",
            caption: "Resolvés el mandado, devolvés el ahorro y te queda el jornal limpio.",
            result: "verified",
            money: 15000,
            payment: missionPayment({ advance: 48000, productCost: 36000, serviceFee: 15000, refund: 12000, requiredBank: 0 }),
            benefit: missionBenefit("fee", "Te deja el honorario; el ahorro vuelve a Marta.", 15000),
            evidence: ["Ticket + reintegro", "Marca equivalente", "Entrega en mano"],
            evidenceText: "Ticket + reintegro",
            risk: missionRisk("Bajo", "Bajo"),
            riskLabel: "Bajo / Bajo",
            steps: ["comedor familiar", "farmacia", "comedor familiar"],
            paymentChannel: "bank",
            medicine: true,
            advanceAmount: 48000,
            productCost: 36000,
            serviceFee: 15000,
            refundAmount: 12000
          }),
          missionCancelOption(item, { label: "Volver sin comprar", caption: "No hay remedios ni honorario. Marta conserva el adelanto.", evidence: "Visita a farmacia", socialRisk: "Medio" })
        ];
      case "rental-local":
        return [
          missionOption({
            id: "review",
            label: "Revisar contrato y medidas",
            caption: "Es una averiguación seria para tu negocio; no inventa ingresos.",
            result: "verified",
            money: 0,
            payment: missionPayment(),
            benefit: missionBenefit("information", "Te deja una copia del contrato y medidas del frente."),
            evidence: ["Copia del contrato", "Notas de medidas"],
            evidenceText: "Copia del contrato",
            risk: missionRisk("Bajo", "Bajo"),
            riskLabel: "Bajo / Bajo",
            steps: [place],
            paymentChannel: "none"
          }),
          missionOption({
            id: "direct",
            label: "Hablar directo con el dueño",
            caption: "Ganás tiempo y margen de negociación, pero sin reserva ni respaldo formal.",
            result: "informal",
            money: 0,
            payment: missionPayment(),
            benefit: missionBenefit("information", "Te deja una charla directa y menos comisión futura."),
            evidence: ["Conversación", "Testigo ocasional"],
            evidenceText: "Conversación",
            risk: missionRisk("Bajo", "Medio"),
            riskLabel: "Bajo / Medio",
            steps: [place],
            paymentChannel: "none"
          }),
          missionCancelOption(item)
        ];
      case "rental-home":
        return [
          missionOption({
            id: "protected",
            label: "Reservar con protección",
            caption: "Pagás más, pero te queda contrato y canal claro para reclamar.",
            result: "verified",
            money: -(amount + 55000),
            payment: missionPayment({ bankDelta: -(amount + 55000), requiredBank: amount + 55000 }),
            benefit: missionBenefit("asset", "Te deja la reserva cerrada y el contrato protegido.", amount),
            evidence: ["Contrato", "Comprobante", "Identidad del propietario"],
            evidenceText: "Contrato + comprobante",
            risk: missionRisk("Bajo", "Bajo"),
            riskLabel: "Bajo / Bajo",
            steps: [place, "banco"],
            paymentChannel: "bank"
          }),
          missionOption({
            id: "direct",
            label: "Acordar directo",
            caption: "Ahorrás la gestión, pero el reclamo después queda más flojo.",
            result: "informal",
            money: -amount,
            payment: missionPayment({ bankDelta: -amount, requiredBank: amount }),
            benefit: missionBenefit("asset", "Te deja la reserva hecha sin comisión extra.", amount),
            evidence: ["Recibo simple", "Conversación con el dueño"],
            evidenceText: "Recibo simple",
            risk: missionRisk("Medio", "Medio"),
            riskLabel: "Medio / Medio",
            steps: [place],
            paymentChannel: "bank"
          }),
          missionOption({
            id: "deposit",
            label: "Dejar seña mínima",
            caption: "Conservás liquidez, pero esa seña puede quedar colgando si el trato cambia.",
            result: "informal",
            money: -80000,
            payment: missionPayment({ bankDelta: -80000, requiredBank: 80000 }),
            benefit: missionBenefit("reservation", "Te deja el lugar apalabrado por poco tiempo.", 80000),
            evidence: ["Reserva provisoria"],
            evidenceText: "Reserva provisoria",
            risk: missionRisk("Medio", "Alto"),
            riskLabel: "Medio / Alto",
            steps: [place],
            paymentChannel: "bank"
          }),
          missionCancelOption(item, { label: "No reservar todavía", caption: "Sólo queda la visita. Seguís juntando seña.", evidence: "Registro de visita", socialRisk: "Bajo" })
        ];
      case "bank-open-account":
        return [
          missionOption({
            id: "official",
            label: "Abrir la cuenta por canal formal",
            caption: "No cobrás hoy, pero te deja una cuenta usable para un trabajo real.",
            result: "verified",
            money: 0,
            payment: missionPayment(),
            benefit: missionBenefit("unlock", "Te deja la cuenta activa para cobrar un sueldo.", 0, "bank-account"),
            evidence: ["Alta de cuenta", "Constancia bancaria"],
            evidenceText: "Alta de cuenta",
            risk: missionRisk("Bajo", "Bajo"),
            riskLabel: "Bajo / Bajo",
            steps: ["banco"],
            paymentChannel: "none"
          }),
          missionOption({
            id: "retry",
            label: "Dejar el alta a medio cerrar",
            caption: "No cobrás, pero queda el intento y un horario verificable.",
            result: "informal",
            money: 0,
            payment: missionPayment(),
            benefit: missionBenefit("information", "Te deja un intento real y una excusa usable."),
            evidence: ["Formulario incompleto", "Número de trámite"],
            evidenceText: "Número de trámite",
            risk: missionRisk("Bajo", "Medio"),
            riskLabel: "Bajo / Medio",
            steps: ["banco"],
            paymentChannel: "none"
          }),
          missionCancelOption(item, { label: "Irte sin terminar", caption: "No hay cuenta nueva ni ingreso. Sólo queda el paso por el banco.", evidence: "Paso por el banco", socialRisk: "Medio" })
        ];
      default:
        break;
    }
    if (item.economy?.type === "buy") return [
      missionOption({
        id: "receipt",
        label: "Comprar con recibo",
        caption: `Pagás ${formatMoney(amount)} después de revisar el bien y dejás todo prolijo.`,
        result: "verified",
        money: -amount,
        payment: missionPayment({ bankDelta: -amount, requiredBank: amount, requiredTotal: amount }),
        benefit: missionBenefit("asset", `Te deja ${item.economy.assetLabel || item.asset} a tu nombre.`, amount),
        evidence: ["Factura", "Número de serie o IMEI"],
        evidenceText: "Factura y serie",
        risk: missionRisk("Bajo", "Bajo"),
        riskLabel: "Bajo / Bajo",
        steps: [place, "banco"],
        paymentChannel: "bank"
      }),
      missionOption({
        id: "cash",
        label: "Negociar en efectivo",
        caption: `Bajás el precio a ${formatMoney(Math.round(amount * .9))}, con menos respaldo si después falla.`,
        result: "informal",
        money: -Math.round(amount * .9),
        payment: missionPayment({ cashDelta: -Math.round(amount * .9), requiredCash: Math.round(amount * .9), requiredTotal: Math.round(amount * .9), negotiatedPrice: Math.round(amount * .9) }),
        benefit: missionBenefit("asset", `Te deja el bien un poco más barato.`, Math.round(amount * .1)),
        evidence: ["Conversación", "Testigo eventual"],
        evidenceText: "Conversación",
        risk: missionRisk("Medio", "Medio"),
        riskLabel: "Medio / Medio",
        steps: [place],
        paymentChannel: "cash"
      }),
      missionCancelOption(item, { label: "Retirarte sin comprar", caption: "No sale plata. Queda asentada la revisión.", evidence: "Visita y prueba" })
    ];
    if (item.economy?.type === "sell" && item.id === "phone-sell") return [
      missionOption({
        id: "phone-sale-transfer",
        label: "Vender con IMEI y transferencia",
        caption: `El comprador prueba el celular, compara IMEI y paga ${formatMoney(amount)} cuando acredita.`,
        result: "verified",
        money: amount,
        payment: missionPayment({ bankDelta: amount }),
        benefit: missionBenefit("income", "Te deja la venta completa y el equipo sale de tu inventario.", amount),
        evidence: ["Factura a tu nombre", "IMEI comparado", "Comprobante acreditado", "Entrega al comprador"],
        evidenceText: "Factura + IMEI + acreditación",
        risk: missionRisk("Bajo", "Bajo"),
        riskLabel: "Bajo / Bajo",
        steps: ["puesto de usados", "banco"],
        paymentChannel: "bank"
      }),
      missionOption({
        id: "phone-sale-cash",
        label: "Vender en efectivo después de revisar IMEI",
        caption: `El comprador verifica IMEI y factura; cerrás en mano por ${formatMoney(Math.round(amount * 1.05))}.`,
        result: "informal",
        money: Math.round(amount * 1.05),
        payment: missionPayment({ cashDelta: Math.round(amount * 1.05) }),
        benefit: missionBenefit("income", "Te deja un plus por cerrar en mano, con recibo simple.", Math.round(amount * .05)),
        evidence: ["Factura", "IMEI visible", "Recibo simple", "Testigo"],
        evidenceText: "IMEI + recibo simple",
        risk: missionRisk("Medio", "Medio"),
        riskLabel: "Medio / Medio",
        steps: ["puesto de usados"],
        paymentChannel: "cash"
      }),
      missionCancelOption(item, { label: "No mostrarlo sin comprador serio", caption: "No sale plata. La publicación queda activa y el equipo sigue con vos.", evidence: "Publicación y visita", socialRisk: "Bajo" })
    ];
    if (item.economy?.type === "sell") return [
      missionOption({
        id: "transfer",
        label: "Vender con transferencia",
        caption: `Cobrás ${formatMoney(amount)} cuando acredita y te queda respaldo de la operación.`,
        result: "verified",
        money: amount,
        payment: missionPayment({ bankDelta: amount }),
        benefit: missionBenefit("income", "Te deja la venta completa del bien.", amount),
        evidence: ["Comprobante", "Entrega del bien"],
        evidenceText: "Comprobante y entrega",
        risk: missionRisk("Bajo", "Bajo"),
        riskLabel: "Bajo / Bajo",
        steps: [place, "banco"],
        paymentChannel: "bank"
      }),
      missionOption({
        id: "cash",
        label: "Aceptar efectivo",
        caption: `Cobrás ${formatMoney(Math.round(amount * 1.05))} y ganás margen, pero el rastro queda más flojo.`,
        result: "informal",
        money: Math.round(amount * 1.05),
        payment: missionPayment({ cashDelta: Math.round(amount * 1.05) }),
        benefit: missionBenefit("income", "Te deja un plus por cerrar en mano.", Math.round(amount * .05)),
        evidence: ["Recibo simple", "Testigo de entrega"],
        evidenceText: "Recibo simple",
        risk: missionRisk("Bajo", "Medio"),
        riskLabel: "Bajo / Medio",
        steps: [place],
        paymentChannel: "cash"
      }),
      missionCancelOption(item, { label: "Dejar publicada la venta", caption: "No entra plata. Queda la publicación activa y la visita.", evidence: "Publicación activa", socialRisk: "Bajo" })
    ];
    if (item.economy?.type === "income") return [
      missionOption({
        id: "receipt",
        label: "Hacer el trabajo con recibo",
        caption: `El cliente paga ${formatMoney(amount)} y queda el servicio firmado.`,
        result: "verified",
        money: amount,
        payment: missionPayment({ bankDelta: amount }),
        benefit: missionBenefit("income", "Te deja el jornal completo.", amount),
        evidence: ["Recibo firmado", "Cliente identificable"],
        evidenceText: "Recibo firmado",
        risk: missionRisk("Bajo", "Bajo"),
        riskLabel: "Bajo / Bajo",
        steps: [place, "banco"],
        paymentChannel: "bank"
      }),
      missionOption({
        id: "cash",
        label: "Cobrar de palabra",
        caption: `Cobrás ${formatMoney(Math.round(amount * 1.1))} en efectivo y resolvés más rápido.`,
        result: "informal",
        money: Math.round(amount * 1.1),
        payment: missionPayment({ cashDelta: Math.round(amount * 1.1) }),
        benefit: missionBenefit("income", "Te deja un plus por cerrar informal.", Math.round(amount * .1)),
        evidence: ["Testigo", "Charla con el cliente"],
        evidenceText: "Testigo",
        risk: missionRisk("Bajo", "Medio"),
        riskLabel: "Bajo / Medio",
        steps: [place],
        paymentChannel: "cash"
      }),
      missionCancelOption(item, { label: "Suspender el trabajo", caption: "No cobrás. Quedan el traslado, la hora y el motivo.", evidence: "Registro de visita", socialRisk: "Medio" })
    ];
    return [
      missionOption({
        id: "verified",
        label: "Canal verificable",
        caption: "Guardás prueba. El trámite no inventa un ingreso.",
        result: "verified",
        money: 0,
        payment: missionPayment(),
        benefit: missionBenefit("information", "Te deja constancia útil y una coartada limpia."),
        evidence: ["Constancia"],
        evidenceText: "Constancia",
        risk: missionRisk("Bajo", "Bajo"),
        riskLabel: "Bajo / Bajo",
        steps: [place],
        paymentChannel: "none"
      }),
      missionOption({
        id: "informal",
        label: "Resolver de palabra",
        caption: "Terminás antes, con menos respaldo y sin inventar plata.",
        result: "informal",
        money: 0,
        payment: missionPayment(),
        benefit: missionBenefit("information", "Te deja una charla y menos papeles."),
        evidence: ["Conversación"],
        evidenceText: "Conversación",
        risk: missionRisk("Bajo", "Medio"),
        riskLabel: "Bajo / Medio",
        steps: [place],
        paymentChannel: "none"
      }),
      cancel
    ];
  }
  function optionPocketLabel(option) {
    if (option.paymentChannel === "cash") return option.payment.requiredCash ? `EFECTIVO ${formatMoney(option.payment.requiredCash)}` : "EFECTIVO";
    if (option.paymentChannel === "bank") return option.payment.requiredBank ? `BANCO ${formatMoney(option.payment.requiredBank)}` : "BANCO";
    if (option.paymentChannel === "none") return "NO MUEVE PLATA";
    return "BANCO Y EFECTIVO";
  }
  function optionBenefitLabel(option) {
    if (!option.benefit) return "Nada inmediato.";
    return option.benefit.text;
  }
  function optionEvidenceLabel(option) {
    return option.evidenceText || option.evidence?.join(" · ") || "Sin prueba";
  }
  function optionRiskText(option) {
    return `${option.risk?.economic || "Bajo"} económico · ${option.risk?.social || "Bajo"} social`;
  }
  function canAffordMissionOption(playerId, option) {
    const account = state.campaign?.economy?.[playerId];
    if (!account) return false;
    if ((option.payment?.requiredBank || 0) > account.bank) return false;
    if ((option.payment?.requiredCash || 0) > (account.cash + account.bank)) return false;
    if ((option.payment?.requiredTotal || 0) > totalBalance(playerId)) return false;
    if (!option.payment?.requiredBank && !option.payment?.requiredCash && !option.payment?.requiredTotal && option.money < 0 && totalBalance(playerId) < Math.abs(option.money)) return false;
    return true;
  }
  function preparation(type, label, stamp, sourceTags, scenarioIds, evidenceCreated, executionCaption) {
    return { type, label, stamp, sourceTags, scenarioIds, evidenceCreated, executionCaption, cost: ECONOMY_CONFIG.preparationCosts[type] };
  }
  function question(prompt, legitStrong, legitAwkward, scamPolished, scamWeak) {
    return { prompt, legitStrong, legitAwkward, scamPolished, scamWeak };
  }

  class LocalTransport {
    constructor() { this.listeners = new Map(); }
    connect() { return Promise.resolve({ room: "barrio-local", playerId: "nico" }); }
    on(event, handler) {
      if (!this.listeners.has(event)) this.listeners.set(event, new Set());
      this.listeners.get(event).add(handler);
      return () => this.listeners.get(event)?.delete(handler);
    }
    send(event, payload) {
      const packet = { event, payload, sentAt: Date.now() };
      (this.listeners.get(event) || []).forEach(handler => handler(packet));
    }
  }

  // Un transporte Socket.io futuro puede reemplazar este objeto sin tocar el motor.
  window.ChamuyoTransport = { LocalTransport };

  const $ = selector => document.querySelector(selector);
  const els = {
    securityValue: $("#securityValue"), securityMeter: $("#securityMeter"), trustValue: $("#trustValue"), trustMeter: $("#trustMeter"),
    progressValue: $("#progressValue"), progressMeter: $("#progressMeter"), timerValue: $("#timerValue"), timer: $(".timer"), meetingButton: $("#meetingButton"), meetingButtonLabel: $("#meetingButtonLabel"),
    taskList: $("#taskList"), tasksTitle: $("#tasksTitle"), roundLabel: $("#roundLabel"), roleDialog: $("#roleDialog"), rolePeekButton: $("#rolePeekButton"),
    roleSeal: $("#roleSeal"), humanRole: $("#humanRole"), roleDescription: $("#roleDescription"), roleObjective: $("#roleObjective"),
    roleProgress: $("#roleProgress"), rolePartner: $("#rolePartner"), publicMissionNote: $("#publicMissionNote"), inventoryPocket: $("#inventoryPocket"), economyPocket: $("#economyPocket"),
    missionDialog: $("#missionDialog"), missionRound: $("#missionRound"), socialIdentity: $("#socialIdentity"), missionChoices: $("#missionChoices"),
    missionExplainer: $("#missionExplainer"), missionActionPanel: $("#missionActionPanel"), missionActionTitle: $("#missionActionTitle"),
    missionActionChoices: $("#missionActionChoices"), missionOutcome: $("#missionOutcome"), strategyPanel: $("#strategyPanel"),
    strategyChoices: $("#strategyChoices"), preparationChoices: $("#preparationChoices"), delegationChoices: $("#delegationChoices"), missionConfirmButton: $("#missionConfirmButton"),
    playersLayer: $("#playersLayer"), animalsLayer: $("#animalsLayer"), residueLayer: $("#residueLayer"), eventFeed: $("#eventFeed"), caseNumber: $("#caseNumber"), casePlace: $("#casePlace"), caseChannel: $("#caseChannel"),
    pocketButton: $("#pocketButton"), fullscreenButton: $("#fullscreenButton"), pocketDialog: $("#pocketDialog"), pocketCloseButton: $("#pocketCloseButton"), pocketCash: $("#pocketCash"), pocketBank: $("#pocketBank"), pocketCashDetail: $("#pocketCashDetail"), pocketBankDetail: $("#pocketBankDetail"), pocketMission: $("#pocketMission"), pocketNextStep: $("#pocketNextStep"), pocketAssets: $("#pocketAssets"), pocketNotes: $("#pocketNotes"), pocketAvailable: $("#pocketAvailable"),
    atmDialog: $("#atmDialog"), atmBalance: $("#atmBalance"), atmChoices: $("#atmChoices"), atmCustomAmount: $("#atmCustomAmount"), atmCustomButton: $("#atmCustomButton"), atmMessage: $("#atmMessage"), atmCloseButton: $("#atmCloseButton"),
    casePanel: $(".case-panel"), actionsPanel: $("#actionsPanel"), caseTitle: $("#caseTitle"), caseText: $("#caseText"), clueStrip: $("#clueStrip"), actionCards: $("#actionCards"), resolutionBox: $("#resolutionBox"),
    resolutionTitle: $("#resolutionTitle"), resolutionText: $("#resolutionText"), continueButton: $("#continueButton"), meetingDialog: $("#meetingDialog"),
    suspiciousEvents: $("#suspiciousEvents"), meetingSeats: $("#meetingSeats"), voteGrid: $("#voteGrid"), voteResult: $("#voteResult"),
    verifierPanel: $("#verifierPanel"), questionCounter: $("#questionCounter"), verifierInstruction: $("#verifierInstruction"),
    interviewPeople: $("#interviewPeople"), questionOptions: $("#questionOptions"), interviewAnswer: $("#interviewAnswer"), closeNotebookButton: $("#closeNotebookButton"),
    skipVoteButton: $("#skipVoteButton"), resumeButton: $("#resumeButton"), resultDialog: $("#resultDialog"), resultFlag: $("#resultFlag"),
    resultTitle: $("#resultTitle"), resultSummary: $("#resultSummary"), finalSecurity: $("#finalSecurity"), finalTrust: $("#finalTrust"), finalTasks: $("#finalTasks"),
    roleReveal: $("#roleReveal"), replayList: $("#replayList"), finalTip: $("#finalTip"), restartButton: $("#restartButton"), toast: $("#toast"),
    alibiDialog: $("#alibiDialog"), alibiQuestion: $("#alibiQuestion"), alibiChoices: $("#alibiChoices"),
    judgmentDialog: $("#judgmentDialog"), judgmentTimeline: $("#judgmentTimeline"), judgmentVoteGrid: $("#judgmentVoteGrid"), judgmentInstruction: $("#judgmentInstruction"),
    villageMap: $("#villageMap"), villageWorld: $("#villageWorld"), locationLabel: $("#locationLabel"), campaignLabel: $("#campaignLabel"), dialogueNote: $("#dialogueNote"),
    objectiveMarker: $("#objectiveMarker"), interactionPrompt: $("#interactionPrompt"), errandSlip: $("#errandSlip"), errandSlipToggle: $("#errandSlipToggle"), slipMission: $("#slipMission"), slipStep: $("#slipStep"), slipDestination: $("#slipDestination"), slipCounterpart: $("#slipCounterpart"), slipAction: $("#slipAction"), slipMoney: $("#slipMoney"), slipEvidence: $("#slipEvidence"), slipNext: $("#slipNext"), payoutDialog: $("#payoutDialog"), payoutKicker: $("#payoutKicker"),
    payoutTitle: $("#payoutTitle"), payoutText: $("#payoutText"), payoutChoices: $("#payoutChoices"), profileDialog: $("#profileDialog"),
    profileTitle: $("#profileTitle"), profileBody: $("#profileBody"), newCampaignButton: $("#newCampaignButton")
  };

  const state = {
    security: 68, trust: 64, progress: 0, scenarioIndex: 0, completed: 0, currentResolved: false,
    timer: DECISION_SECONDS, timerId: null, dayTimer: DEBUG_DAY_SECONDS, dayTimerId: null, dayStartedAt: 0, dayExpired: false, storiesReady: false, roles: {}, scenarios: [], roundStories: [], decisions: [],
    ignoredSignals: [], audited: new Set(), suspicion: {}, scammerFrozen: false, scamAttempts: 0, scamScore: 0,
    meetings: 0, roundNumber: 0, templateQueue: [], dialogueLog: [], questionsRemaining: 0, botQuestionCompleted: false,
    questionedPlayers: new Set(), currentInterrogation: null, fraudProgress: 0, gameOver: false, accompliceFrozen: false,
    socialProfiles: {}, motivations: {}, roundRecords: {}, pendingMissionPair: [], selectedMission: null,
    selectedStrategy: null, selectedMissionAction: null, selectedMissionOption: null, selectedPreparation: null, selectedDelegation: "keep", pendingAlibi: null,
    fraudOccurred: false, pendingJudgment: false, judgmentHistory: [], inventories: {}, fraudExecutions: [], opportunityByScenario: {},
    campaign: null, accompliceDeals: [], pendingPayout: null, pendingEncounter: null, pendingConfrontation: null, falseClosing: false,
    botMissionRounds: new Set(),
    movement: { positions: {}, path: [], activeBotRoute: {}, botRouteQueues: {}, keys: new Set(), camera: { x: 0, y: 0 }, lastTime: 0, rafId: 0, objective: null, arrivalCallback: null, nearLocation: null },
    agendas: {}, humanAgenda: null, errandSlip: { visible: true, missionId: null, stepIndex: 0, savedAt: 0 }, activeCounterpart: null, observations: [], gossip: null, animals: [], residues: [], lastAnimalTick: 0, lastAnimalTextTime: 0,
    dirtyShoe: { active: false, incidentId: 0, until: 0, nearbyBots: {} },
    atmUI: { open: false, mode: "free" },
    freeAtmSession: { origin: null, withdrawn: 0 },
    missionAtmRequirement: null,
    delegatedPayoutRequirement: null,
    mapExpanded: false, meetingPhase: null, lastDinnerGateRefresh: 0, debugRequiredRoute: false,
    debugTrace: [], episodeToken: 0, isEpisodeResetting: false,
    transport: new LocalTransport()
  };

  const botRouteCallbacks = new Map();
  let botRouteSequence = 0;

  function makeId(prefix) { return `${prefix}-${Date.now().toString(36)}-${Math.floor(random() * 99999).toString(36)}`; }
  function formatMoney(value) { return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(Math.round(value || 0)); }
  function totalBalance(playerId) { const account = state.campaign?.economy?.[playerId]; return account ? account.bank + account.cash : 0; }
  function publicBand(playerId) { const total = totalBalance(playerId); return ECONOMY_CONFIG.publicBands.find(band => total <= band.max)?.label || "Tiene resto"; }
  function random() {
    if (!state.campaign) return Math.random();
    if (DEBUG_MODE && DEBUG_SEED !== null) {
      if (!state.campaign._debugSeeded) {
        state.campaign.rngState = DEBUG_SEED >>> 0;
        state.campaign._debugSeeded = true;
      }
    }
    state.campaign.rngState = (state.campaign.rngState + 0x6D2B79F5) >>> 0;
    let value = state.campaign.rngState;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  }

  function createCampaign() {
    const seed = (DEBUG_MODE && DEBUG_SEED !== null ? DEBUG_SEED : Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
    const profilePool = [...SOCIAL_PROFILES].sort(() => Math.random() - .5).slice(0, PLAYERS.length);
    const motivePool = [...MOTIVATIONS].sort(() => Math.random() - .5);
    const campaign = {
      version: ECONOMY_CONFIG.version, campaignId: makeId("camp"), episodeNumber: 1, pricesAsOf: ECONOMY_CONFIG.pricesAsOf,
      seed, rngState: seed, professions: {}, motivations: {}, economy: {}, resources: {}, transactions: [], deals: [], relationships: {}, roleHistory: [], positions: {}
    };
    PLAYERS.forEach((player, index) => {
      const profile = profilePool[index];
      const work = PROFESSION_ECONOMY[profile.id];
      campaign.professions[player.id] = profile.id;
      campaign.motivations[player.id] = motivePool[index];
      campaign.resources[player.id] = [];
      campaign.positions[player.id] = { x: SPAWN_POINTS[index][0], y: SPAWN_POINTS[index][1] };
      campaign.economy[player.id] = {
        bank: ECONOMY_CONFIG.initialBank, cash: ECONOMY_CONFIG.initialCash, grossSalary: work.grossSalary,
        weeklyAvailable: ECONOMY_CONFIG.weeklyAvailable, employment: profile.label, unexplained: 0,
        assets: work.assets.map(asset => ({ id: makeId("asset"), type: asset[0], label: asset[1], value: asset[2], ownerId: player.id, source: "kit inicial", acquiredEpisode: 1 }))
      };
    });
    PLAYERS.forEach((player, index) => PLAYERS.slice(index + 1).forEach(other => { campaign.relationships[[player.id, other.id].sort().join(":")] = 0; }));
    return campaign;
  }

  function validCampaign(candidate) {
    return candidate && candidate.version === ECONOMY_CONFIG.version && candidate.economy && candidate.resources && PLAYERS.every(player => candidate.economy[player.id] && Array.isArray(candidate.resources[player.id]));
  }

  function loadCampaign() {
    try {
      if (QA_RESET) localStorage.removeItem(ECONOMY_CONFIG.storageKey);
      const parsed = JSON.parse(localStorage.getItem(ECONOMY_CONFIG.storageKey));
      state.campaign = validCampaign(parsed) ? parsed : createCampaign();
      state.transport.send(validCampaign(parsed) ? "campaign:restored" : "campaign:created", { campaignId: state.campaign.campaignId, episodeNumber: state.campaign.episodeNumber });
    } catch (_) { state.campaign = createCampaign(); }
    state.campaign.rngState ||= state.campaign.seed || 1;
    state.campaign.episodeNumber ||= 1;
    state.campaign.professions ||= {};
    state.campaign.motivations ||= {};
    state.campaign.transactions ||= [];
    state.campaign.deals ||= [];
    state.campaign.relationships ||= {};
    state.campaign.roleHistory ||= [];
    state.campaign.positions ||= {};
    const availableProfiles = SOCIAL_PROFILES.map(profile => profile.id);
    PLAYERS.forEach((player, index) => {
      const profileId = state.campaign.professions[player.id] || availableProfiles[index % availableProfiles.length];
      state.campaign.professions[player.id] = profileId;
      state.campaign.motivations[player.id] ||= MOTIVATIONS[index % MOTIVATIONS.length];
      state.campaign.resources[player.id] ||= [];
      state.campaign.positions[player.id] ||= { x: SPAWN_POINTS[index][0], y: SPAWN_POINTS[index][1] };
      const account = state.campaign.economy[player.id];
      account.assets ||= [];
      account.unexplained ||= 0;
      account.weeklyAvailable ||= ECONOMY_CONFIG.weeklyAvailable;
      account.employment ||= SOCIAL_PROFILES.find(profile => profile.id === profileId)?.label || "oficio barrial";
    });
    state.accompliceDeals = state.campaign.deals;
  }

  function saveCampaign() {
    if (!state.campaign) return;
    PLAYERS.forEach(player => {
      const position = state.movement.positions[player.id];
      if (position) state.campaign.positions[player.id] = { x: Math.round(position.x), y: Math.round(position.y) };
    });
    try { localStorage.setItem(ECONOMY_CONFIG.storageKey, JSON.stringify(state.campaign)); } catch (_) { toast("No se pudo guardar la campaña en este navegador."); }
    state.transport.send("campaign:saved", { campaignId: state.campaign.campaignId, episodeNumber: state.campaign.episodeNumber });
  }

  function recordTransaction({ fromId = "barrio", toId = "barrio", amount = 0, channel = "bank", label, visibleLabel = label, legitimate = true, assetId = null, round = currentRound(), bankBefore = null, cashBefore = null, bankAfter = null, cashAfter = null, advanceAmount = 0, productCost = 0, serviceFee = 0, negotiatedPrice = 0, cashRequired = 0, cashWithdrawn = 0, retainedDifference = 0, reportedDifference = 0, discoveryRisk = 0 }) {
    const accountId = state.campaign.economy[toId] ? toId : state.campaign.economy[fromId] ? fromId : null;
    const account = accountId ? state.campaign.economy[accountId] : null;
    const transaction = { id: makeId("tx"), campaignId: state.campaign.campaignId, episodeId: state.campaign.episodeNumber, roundId: round, fromId, toId, amount: Math.round(amount), channel, label, visibleLabel, legitimate, assetId, createdAt: Date.now(),
      bankBefore: bankBefore ?? account?.bank ?? null, cashBefore: cashBefore ?? account?.cash ?? null, bankAfter: bankAfter ?? account?.bank ?? null, cashAfter: cashAfter ?? account?.cash ?? null,
      advanceAmount, productCost, serviceFee, negotiatedPrice, cashRequired, cashWithdrawn, retainedDifference, reportedDifference, discoveryRisk };
    state.campaign.transactions.push(transaction);
    state.transport.send("economy:transaction", { id: transaction.id, episodeId: transaction.episodeId, roundId: transaction.roundId, fromId, toId, amount: transaction.amount, channel, visibleLabel, assetId });
    saveCampaign();
    return transaction;
  }

  function debit(playerId, amount, label, legitimate = true) {
    const account = state.campaign.economy[playerId];
    if (!account || totalBalance(playerId) < amount) return false;
    const bankBefore = account.bank, cashBefore = account.cash;
    const fromBank = Math.min(account.bank, amount);
    account.bank -= fromBank;
    account.cash -= amount - fromBank;
    recordTransaction({ fromId: playerId, toId: "barrio", amount, channel: fromBank === amount ? "bank" : "mixed", label, visibleLabel: "Gasto del mandado", legitimate, bankBefore, cashBefore, bankAfter: account.bank, cashAfter: account.cash });
    renderEconomy();
    return true;
  }

  function debitBank(playerId, amount, label, legitimate = true, details = {}) {
    const account = state.campaign.economy[playerId];
    if (!account || account.bank < amount) return false;
    const bankBefore = account.bank, cashBefore = account.cash;
    account.bank -= amount;
    recordTransaction({ fromId: playerId, toId: "barrio", amount, channel: "bank", label, visibleLabel: label, legitimate, bankBefore, cashBefore, bankAfter: account.bank, cashAfter: account.cash, ...details });
    renderEconomy();
    return true;
  }

  function debitCash(playerId, amount, label, legitimate = true, details = {}) {
    const account = state.campaign.economy[playerId];
    if (!account || account.cash < amount) return false;
    const bankBefore = account.bank, cashBefore = account.cash;
    account.cash -= amount;
    recordTransaction({ fromId: playerId, toId: "barrio", amount, channel: "cash", label, visibleLabel: label, legitimate, bankBefore, cashBefore, bankAfter: account.bank, cashAfter: account.cash, discoveryRisk: legitimate ? 0 : .35, ...details });
    renderEconomy();
    return true;
  }

  function credit(playerId, amount, label, legitimate = true, channel = "bank", unexplained = false, details = {}) {
    const account = state.campaign.economy[playerId];
    if (!account) return false;
    const bankBefore = account.bank, cashBefore = account.cash;
    account[channel === "cash" ? "cash" : "bank"] += amount;
    if (unexplained) account.unexplained += amount;
    recordTransaction({ fromId: "barrio", toId: playerId, amount, channel, label, visibleLabel: legitimate ? label : "Ingreso sin concepto", legitimate, bankBefore, cashBefore, bankAfter: account.bank, cashAfter: account.cash, discoveryRisk: unexplained ? .45 : 0, ...details });
    renderEconomy();
    return true;
  }

  function transferMoney(fromId, toId, amount, label, legitimate = true, channel = "bank", unexplainedTo = false) {
    const available = totalBalance(fromId);
    const moved = Math.min(Math.max(0, Math.round(amount)), available);
    if (!moved) return 0;
    const from = state.campaign.economy[fromId];
    const to = state.campaign.economy[toId];
    const fromBank = Math.min(from.bank, moved);
    from.bank -= fromBank;
    from.cash -= moved - fromBank;
    to[channel === "cash" ? "cash" : "bank"] += moved;
    if (unexplainedTo) to.unexplained += moved;
    recordTransaction({ fromId, toId, amount: moved, channel, label, visibleLabel: legitimate ? label : "Transferencia sin comprobante", legitimate });
    renderEconomy();
    return moved;
  }

  function findAsset(playerId, type) { return state.campaign.economy[playerId]?.assets.find(asset => asset.type === type); }
  function relationship(a, b) { return state.campaign.relationships[[a, b].sort().join(":")] || 0; }
  function adjustRelationship(a, b, delta) {
    const key = [a, b].sort().join(":");
    state.campaign.relationships[key] = clamp((state.campaign.relationships[key] || 0) + delta, -5, 5);
  }
  function sellAsset(playerId, type, amount, label, channel = "bank") {
    const account = state.campaign.economy[playerId];
    const asset = findAsset(playerId, type);
    if (!asset) return false;
    account.assets = account.assets.filter(item => item.id !== asset.id);
    account[channel === "cash" ? "cash" : "bank"] += amount;
    recordTransaction({ fromId: "comprador", toId: playerId, amount, channel, label, visibleLabel: label, legitimate: true, assetId: asset.id });
    state.transport.send("asset:transferred", { assetId: asset.id, fromId: playerId, toId: "comprador", amount });
    renderEconomy();
    return true;
  }

  function unlockVerifiedJob(mission, option, playerId) {
    if (mission?.id !== "job-interview" || option?.result !== "verified") return false;
    const account = state.campaign.economy[playerId];
    if (!account || account.pendingJob?.employment === "soporte remoto") return false;
    account.pendingJob = {
      employment: "soporte remoto",
      grossSalary: ECONOMY_CONFIG.remoteGrossSalary,
      weeklyAvailable: ECONOMY_CONFIG.remoteWeeklyAvailable
    };
    recordTransaction({
      fromId: "empresa", toId: playerId, amount: 0, label: "Oferta laboral verificada",
      visibleLabel: `Oferta: ${formatMoney(ECONOMY_CONFIG.remoteGrossSalary)} mensuales`, legitimate: true
    });
    return true;
  }

  function renderEconomy() {
    if (!state.campaign || !els.economyPocket) return;
    const account = state.campaign.economy.nico;
    const receipts = state.campaign.transactions.filter(item => item.fromId === "nico" || item.toId === "nico").slice(-3).reverse();
    els.economyPocket.innerHTML = `<small>MI BILLETERA · APRETÁ I</small><div class="screen-balances"><span><i>BANCO</i><b>${formatMoney(account.bank)}</b></span><span><i>EFECTIVO</i><b>${formatMoney(account.cash)}</b></span></div><small>DISPONIBLE TOTAL ${formatMoney(account.bank + account.cash)} · ${escapeHTML(publicBand("nico").toUpperCase())}</small><details><summary>ÚLTIMOS MOVIMIENTOS</summary>${receipts.map(item => `<span>${item.toId === "nico" ? "+" : "−"}${formatMoney(item.amount)} · ${escapeHTML(item.label)}</span>`).join("") || "<span>Sin movimientos todavía.</span>"}</details>`;
    els.campaignLabel.textContent = `CAMPAÑA · PARTIDA ${state.campaign.episodeNumber}`;
    renderPocket();
  }

  function renderPocket() {
    if (!state.campaign || !els.pocketDialog) return;
    const account = state.campaign.economy.nico;
    const agenda = state.humanAgenda;
    const record = roundRecord("nico");
    const commitments = agenda?.medicine?.purchased ? 0 : (agenda?.medicine?.actualProductCost || agenda?.option?.productCost || (agenda?.option?.money < 0 ? Math.abs(agenda.option.money) : 0));
    const bankMoves = state.campaign.transactions.filter(item => (item.fromId === "nico" || item.toId === "nico") && item.channel === "bank").slice(-2).reverse();
    const cashMoves = state.campaign.transactions.filter(item => (item.fromId === "nico" || item.toId === "nico") && item.channel === "cash").slice(-2).reverse();
    els.pocketBank.textContent = formatMoney(account.bank); els.pocketCash.textContent = formatMoney(account.cash);
    els.pocketBankDetail.innerHTML = bankMoves.map(item => `<span>${item.toId === "nico" ? "+" : "−"}${formatMoney(item.amount)} · ${escapeHTML(item.visibleLabel)}</span>`).join("") || "Sin movimientos bancarios.";
    els.pocketCashDetail.innerHTML = cashMoves.map(item => `<span>${item.toId === "nico" ? "+" : "−"}${formatMoney(item.amount)} · ${escapeHTML(item.visibleLabel)}</span>`).join("") || "Sin movimientos en efectivo.";
    els.pocketMission.textContent = agenda?.mission?.text || record?.publicMission?.text || "Elegí un mandado para hoy.";
    const next = agenda?.steps?.[agenda.index];
    els.pocketNextStep.textContent = next ? `Próximo paso: ${cleanLocation(next.location)} · ${agenda.index}/${agenda.steps.length} hechos` : record?.missionCompleted ? "Mandado terminado." : "Todavía sin recorrido.";
    const assets = account.assets.slice(0, 4).map(item => `<span>${escapeHTML(item.label)} · ${formatMoney(item.value)}</span>`);
    const resources = (state.inventories.nico || []).slice(0, 3).map(item => `<span>${escapeHTML(item.label)} · ${escapeHTML(item.status)}</span>`);
    els.pocketAssets.innerHTML = [...assets, ...resources].join("") || "<span>El bolsillo está liviano.</span>";
    const notes = state.observations.filter(item => item.observerId === "nico").slice(-3).reverse();
    els.pocketNotes.innerHTML = notes.map(item => `<li><b>${escapeHTML(cleanLocation(item.location || "barrio"))}</b><span>${escapeHTML(item.text)}</span></li>`).join("") || "<li>Todavía no escuchaste nada de cerca.</li>";
    const requiredChannel = agenda?.option?.paymentChannel === "cash" ? "EFECTIVO" : "BANCO";
    els.pocketAvailable.textContent = `COMPROMETIDO ${formatMoney(commitments)} (${requiredChannel}) · LIBRE ${formatMoney(Math.max(0, account.bank + account.cash - commitments))}`;
    updateErrandSlip();
  }

  function togglePocket(force) {
    const open = force ?? !els.pocketDialog.open;
    if (open && !els.pocketDialog.open) { renderPocket(); els.pocketDialog.show(); }
    else if (!open && els.pocketDialog.open) { els.pocketDialog.close(); updateErrandSlip(); }
  }

  async function toggleMapFullscreen() {
    const host = document.querySelector(".village-wrap");
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      if (host.requestFullscreen) await host.requestFullscreen();
      else { state.mapExpanded = !state.mapExpanded; host.classList.toggle("map-expanded", state.mapExpanded); }
    } catch (_) { state.mapExpanded = !state.mapExpanded; host.classList.toggle("map-expanded", state.mapExpanded); }
    state.transport.send(document.fullscreenElement || state.mapExpanded ? "map:fullscreen-entered" : "map:fullscreen-exited", { playerId: "nico" });
    window.setTimeout(() => updateCamera(true), 100);
  }

  function renderProfile(playerId) {
    const player = PLAYERS.find(item => item.id === playerId);
    const account = state.campaign.economy[playerId];
    if (!player || !account) return;
    els.profileTitle.textContent = player.name;
    els.profileBody.innerHTML = `<div class="profile-ledger"><section><strong>OFICIO</strong><span>${escapeHTML(state.socialProfiles[playerId].label)}</span><span>${escapeHTML(state.socialProfiles[playerId].place)}</span></section><section><strong>PLATA QUE SE VE</strong><span>${escapeHTML(publicBand(playerId))}</span><span>Saldo exacto: ${playerId === "nico" ? formatMoney(totalBalance(playerId)) : "sólo con auditoría"}</span></section><section><strong>SUELDO DECLARADO</strong><span>${formatMoney(account.grossSalary)} por mes</span></section><section><strong>ANTECEDENTES</strong><span>${state.campaign.roleHistory.length - 1} partidas anteriores</span></section></div><ul class="profile-assets">${account.assets.map(asset => `<li>${escapeHTML(asset.label)} · valor de referencia ${formatMoney(asset.value)}</li>`).join("") || "<li>No tiene bienes registrados.</li>"}</ul>`;
    if (!els.profileDialog.open) els.profileDialog.showModal();
  }

  function shuffled(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function weightedRole() {
    const roll = random();
    if (roll < .26) return "Estafador";
    if (roll < .45) return "Cómplice";
    if (roll < .67) return "Verificador";
    return "Vecino";
  }

  function assignRoles() {
    const forcedRole = new URLSearchParams(location.search).get("role");
    const humanRole = ["Estafador", "Cómplice", "Verificador", "Vecino"].includes(forcedRole) ? forcedRole : weightedRole();
    const bots = shuffled(PLAYERS.filter(player => !player.human).map(player => player.id));
    state.roles = { nico: humanRole };
    if (humanRole === "Estafador") {
      state.roles[bots[0]] = "Cómplice";
      state.roles[bots[1]] = "Verificador";
      bots.slice(2).forEach(id => state.roles[id] = "Vecino");
    } else if (humanRole === "Cómplice") {
      state.roles[bots[0]] = "Estafador";
      state.roles[bots[1]] = "Verificador";
      bots.slice(2).forEach(id => state.roles[id] = "Vecino");
    } else {
      state.roles[bots[0]] = "Estafador";
      state.roles[bots[1]] = "Cómplice";
      state.roles[bots[2]] = humanRole === "Verificador" ? "Vecino" : "Verificador";
      bots.slice(3).forEach(id => state.roles[id] = "Vecino");
    }
    PLAYERS.forEach(player => { state.suspicion[player.id] = 0; });
    assignSocialProfiles();
    PLAYERS.forEach(player => { state.inventories[player.id] = state.campaign.resources[player.id]; });
    const historyEntry = { episodeId: state.campaign.episodeNumber, roles: { ...state.roles } };
    const existingHistory = state.campaign.roleHistory.findIndex(item => item.episodeId === state.campaign.episodeNumber);
    if (existingHistory >= 0) state.campaign.roleHistory[existingHistory] = historyEntry;
    else state.campaign.roleHistory.push(historyEntry);
    renderRolePaper();
  }

  function assignSocialProfiles() {
    PLAYERS.forEach(player => {
      state.socialProfiles[player.id] = SOCIAL_PROFILES.find(profile => profile.id === state.campaign.professions[player.id]) || SOCIAL_PROFILES[0];
      state.motivations[player.id] = state.campaign.motivations[player.id];
    });
  }

  function renderRolePaper() {
    const role = state.roles.nico;
    const copy = {
      Vecino: {
        seal: "V", description: "Hacé un mandado y escuchá cuatro movimientos. Puede no haber fraude o pueden cruzarse dos.",
        objective: "Hacé tus compras y ventas, cuidá la plata y ayudá a la mesa a congelar al Estafador."
      },
      Verificador: {
        seal: "✓", description: "Tu voto ordena un poco más a los bots y las verificaciones que elegís dejan pistas más claras.",
        objective: "Separá una urgencia real de una maniobra sin hacer caer la confianza del barrio."
      },
      Estafador: {
        seal: "$", description: "Primero resolvés un mandado real. Después podés cubrirte o preparar un recurso concreto para otra ronda.",
        objective: "Guardá recursos, esperá una situación compatible y sostené tu coartada si llega la auditoría."
      },
      Cómplice: {
        seal: "%", description: "Conocés al Estafador y podés recibir recursos o plata. Cumplir el trato no es tu única opción.",
        objective: "Elegí cuánto devolver. Si te quedás con un excedente, también podés terminar como chivo expiatorio."
      }
    }[role];
    els.humanRole.textContent = role;
    els.roleSeal.textContent = copy.seal;
    els.roleDialog.classList.toggle("scammer-role", role === "Estafador");
    els.roleDescription.textContent = copy.description;
    els.roleObjective.textContent = copy.objective;
    const partner = role === "Estafador" ? PLAYERS.find(player => state.roles[player.id] === "Cómplice") : role === "Cómplice" ? PLAYERS.find(player => state.roles[player.id] === "Estafador") : null;
    els.rolePartner.hidden = !partner;
    if (partner) els.rolePartner.innerHTML = `<strong>${role === "Estafador" ? "Tu Cómplice" : "El Estafador"}: ${escapeHTML(partner.name)}</strong>${escapeHTML(state.socialProfiles[partner.id].label)} · ${role === "Estafador" ? "podés delegarle recursos y negociar su parte" : "si te deja plata, vos decidís cuánto vuelve"}.`;
    renderEconomy();
  }

  function buildScenarioDeck() {
    state.scenarios = [];
    state.templateQueue = [];
    state.roundNumber = 0;
    appendRound();
  }

  function appendRound() {
    if (state.templateQueue.length < 4) {
      const lastId = state.templateQueue.at(-1)?.id;
      const byId = Object.fromEntries(TEMPLATES.map(template => [template.id, template]));
      let refill = [
        ...shuffled([byId.bike, byId.fridge, byId.rental, byId.qr]),
        ...shuffled([byId.phone, byId.job, byId.bank, byId.family])
      ];
      if (lastId && refill[0]?.id === lastId) refill.push(refill.shift());
      state.templateQueue.push(...refill);
    }
    const round = state.roundNumber;
    const group = state.templateQueue.splice(0, 4);
    const actorPool = PLAYERS.filter(player => !player.human);
    const roundCases = group.map(template => {
      const ranked = shuffled(actorPool).sort((a, b) => actorSuitability(template.id, b) - actorSuitability(template.id, a));
      const actor = ranked[0];
      actorPool.splice(actorPool.findIndex(item => item.id === actor.id), 1);
      return hydrateScenario(template, actor, round);
    });
    state.scenarios.push(...shuffled(roundCases));
    createRoundRecords(round);
    state.roundNumber += 1;
    if (els.playersLayer?.children.length) window.setTimeout(() => scheduleBotMissions(round), 120);
  }

  function actorSuitability(templateId, player) {
    const profile = state.socialProfiles[player.id]?.id;
    const preferred = {
      bike: ["delivery", "store", "reseller"], fridge: ["store", "shelter", "reseller"], bank: ["accountant", "store"],
      family: ["landlord", "technician", "delivery"], rental: ["landlord", "store"], job: ["accountant", "printer", "delivery"],
      qr: ["shelter", "printer", "store"], phone: ["reseller", "delivery", "technician"]
    }[templateId] || [];
    const assetBonus = templateId === "fridge" && findAsset(player.id, "fridge") ? 5 : templateId === "phone" && findAsset(player.id, "phone") ? 5 : 0;
    return assetBonus + (preferred.includes(profile) ? 3 - preferred.indexOf(profile) * .5 : 0);
  }

  function createRoundRecords(round) {
    state.roundRecords[round] = {};
    PLAYERS.forEach((player, index) => {
      const used = Object.values(state.roundRecords).map(records => records[player.id]?.publicMission?.text).filter(Boolean);
      const fullPool = compatibleMissions(player.id);
      const unused = fullPool.filter(item => !used.includes(item.text));
      const compatible = unused.length ? unused : fullPool;
      const feasibleMissions = compatible.filter(item => missionFeasible(player.id, item));
      const primary = feasibleMissions[(index + round) % feasibleMissions.length] || compatible[(index + round) % compatible.length];
      state.roundRecords[round][player.id] = {
        publicMission: primary, missionResolution: player.human ? null : "pending", missionCompleted: false, publicActions: [], attemptedActions: [],
        completedTransactions: [], witnesses: [], visitedLocations: [], heldAssets: [], hiddenPreparation: null,
        timeline: [],
        generatedAlibis: [], selectedAlibis: [], frauds: [], coverStrength: 0, strategy: "publica"
      };
    });
    const usedHumanMissions = Object.values(state.roundRecords).map(records => records.nico?.publicMission?.text).filter(Boolean);
    const fullHumanPool = compatibleMissions("nico");
    const unusedHumanPool = fullHumanPool.filter(item => !usedHumanMissions.includes(item.text));
    const humanMissions = shuffled(unusedHumanPool.length >= 2 ? unusedHumanPool : fullHumanPool);
    const feasible = humanMissions.filter(item => missionFeasible("nico", item));
    const earning = feasible.filter(item => ["income", "sell"].includes(item.economy?.type));
    const aspirational = humanMissions.filter(item => !missionFeasible("nico", item));
    const firstMission = earning[0] || feasible[0] || humanMissions[0];
    const secondMission = aspirational[0] || feasible.find(item => item.text !== firstMission?.text) || humanMissions.find(item => item.text !== firstMission?.text);
    state.pendingMissionPair = [firstMission, secondMission].filter(Boolean);
    state.selectedMission = null;
    state.selectedStrategy = null;
    state.selectedMissionAction = null;
    state.selectedPreparation = null;
    state.selectedDelegation = "keep";
    state.roundRecords[round].nico.publicMission = null;
    const actorsThisRound = new Set(state.scenarios.filter(item => item.round === round).map(item => item.actorId));
    const gossipPool = PLAYERS.filter(player => !player.human && !actorsThisRound.has(player.id));
    const gossip = gossipPool[Math.floor(random() * gossipPool.length)];
    state.gossip = { playerId: gossip.id, round, reliability: .45 + random() * .35, influence: GOSSIP_VOTE_WEIGHT, rumor: null };
  }

  function resolveBotMission(playerId, round, forcedResult = null) {
    const record = roundRecord(playerId, round);
    if (!record || record.missionResolution !== "pending") return;
    const options = missionOptions(record.publicMission).filter(option => canAffordMissionOption(playerId, option));
    const preferred = forcedResult ? options.find(option => option.result === forcedResult) : null;
    const chosen = preferred || options[Math.floor(random() * Math.max(1, options.length))] || missionOptions(record.publicMission).at(-1);
    const result = chosen.result;
    const fact = result === "cancelled" ? record.publicMission.attemptedFact : result === "informal"
      ? `${record.publicMission.completedFact} El acuerdo quedó de palabra.` : record.publicMission.completedFact;
    record.missionResolution = result;
    record.missionCompleted = result !== "cancelled";
    record.publicActions = record.missionCompleted ? [fact] : [];
    record.attemptedActions = record.missionCompleted ? [] : [fact];
    record.heldAssets = [record.publicMission.asset];
    record.timeline.push({ order: record.timeline.length + 1, text: fact, observable: true, time: Date.now() });
    applyMissionOptionEconomy(record.publicMission, chosen, playerId);
    state.transport.send("mission:resolved", { playerId, missionId: record.publicMission.scenarioId, result, round });
    if (state.roles[playerId] === "Estafador" && record.strategy === "publica") setupBotScammerTurn(playerId, round);
    refreshDinnerGate("bot-mission");
  }

  function scheduleBotMissions(round) {
    if (state.botMissionRounds.has(round)) return;
    state.botMissionRounds.add(round);
    if (DEBUG_BOTS_IDLE) {
      state.debugTrace.push({ event: "bots-deliberately-idle", round, at: Date.now() });
      addSystemFeed("PRUEBA A/B: los bots no harán sus mandados; el reloj debe seguir independiente.");
      return;
    }
    const episodeToken = state.episodeToken;
    PLAYERS.filter(player => !player.human).forEach((player, index) => {
      const record = roundRecord(player.id, round);
      window.setTimeout(() => {
        if (!record || state.gameOver || episodeToken !== state.episodeToken) return;
        record.timeline.push({ order: 1, text: `Salió rumbo a ${record.publicMission.location}.`, observable: true, time: Date.now() });
        enqueueBotRoute(player.id, record.publicMission.location, { purpose: "agenda", stableKey: `mission:${round}:${record.publicMission.id}`, note: `${player.name} llegó por: ${record.publicMission.text}`, callback: () => {
          if (episodeToken !== state.episodeToken) return;
          resolveBotMission(player.id, round);
          if (state.gossip?.round === round && state.gossip.playerId === player.id) scheduleGossipWalk(player.id, round);
        } });
      }, 180 + index * 180);
    });
  }

  function scheduleGossipWalk(playerId, round) {
    const places = ["banco", "plaza", "almacén", "imprenta", "departamento", "puesto de usados"];
    const place = places[Math.floor(random() * places.length)];
    const episodeToken = state.episodeToken;
    window.setTimeout(() => {
      if (episodeToken !== state.episodeToken) return;
      enqueueBotRoute(playerId, place, { purpose: "gossip", stableKey: `round:${round}:${place}`, note: `${PLAYERS.find(player => player.id === playerId).name} salió a barrer y mirar la cuadra`, callback: () => {
        if (episodeToken === state.episodeToken) createGossipRumor(playerId, round, place);
      } });
    }, 500);
  }

  function createGossipRumor(playerId, round, place) {
    const player = PLAYERS.find(item => item.id === playerId);
    const nearby = PLAYERS.filter(item => item.id !== playerId && item.id !== "nico").sort((a, b) => {
      const p = state.movement.positions[playerId], pa = state.movement.positions[a.id], pb = state.movement.positions[b.id];
      return Math.hypot(p.x - pa.x, p.y - pa.y) - Math.hypot(p.x - pb.x, p.y - pb.y);
    }).slice(0, 2);
    const accurate = random() < state.gossip.reliability;
    const names = accurate && nearby.length ? nearby.map(item => item.name) : shuffled(PLAYERS.filter(item => item.id !== playerId)).slice(0, 2).map(item => item.name);
    const topics = ["una transferencia", "un alquiler", "unos folletos", "una cuenta nueva", "una venta usada"];
    state.gossip.rumor = `Salí a barrer por ${cleanLocation(place)} y vi a ${names[0]} charlando con ${names[1]} sobre ${topics[Math.floor(random() * topics.length)]}. Capaz no era nada, qué sé yo.`;
    state.observations.push({ id: makeId("obs"), observerId: playerId, participants: names, location: place, reliability: state.gossip.reliability, round, kind: "rumor", text: state.gossip.rumor });
    state.transport.send("rumor:reported", { observerId: playerId, location: place, round });
    speak(playerId, "Yo vi movimiento por acá. Después cuento en la mesa.", "gossip");
  }

  function compatibleMissions(playerId) {
    const profileId = state.socialProfiles[playerId].id;
    const allowed = PROFILE_AFFINITIES[profileId] || Object.keys(MISSION_LIBRARY);
    return allowed.flatMap(scenarioId => MISSION_LIBRARY[scenarioId].map(item => ({ ...item, scenarioId, tags: SCENARIO_TAGS[scenarioId] })));
  }

  function missionFeasible(playerId, missionItem) {
    if (!missionItem.economy) return true;
    if (missionItem.economy.type === "sell") return Boolean(findAsset(playerId, missionItem.economy.assetType));
    if (missionItem.economy.type === "buy") return totalBalance(playerId) >= missionItem.economy.amount;
    return true;
  }

  function missionMoneyPreview(item) {
    const options = missionOptions(item).filter(option => option.result !== "cancelled");
    if (item.id === "family-medicine") return `ADELANTO ${formatMoney(48000)} · HONORARIO ${formatMoney(15000)} · AHORRO POSIBLE ${formatMoney(18000)}`;
    const positive = options.find(option => option.money > 0);
    if (positive) return positive.benefit?.text?.toUpperCase() || `INGRESO POSIBLE ${formatMoney(positive.money)}`;
    const cost = options.find(option => option.money < 0);
    if (cost) return cost.benefit?.text?.toUpperCase() || `GASTO DESDE ${formatMoney(Math.abs(cost.money))}`;
    return options[0]?.benefit?.text?.toUpperCase() || "TRÁMITE · SIN INGRESO AUTOMÁTICO";
  }

  function missionRoute(item) {
    const routes = {
      "phone-sell": "PUESTO DE USADOS → VER IMEI → BANCO: ESPERAR ACREDITACIÓN",
      "phone-buy": "PUESTO DE USADOS → REVISAR IMEI Y FACTURA",
      "fridge-buy": "PUESTO DE USADOS → PROBAR HELADERA → BANCO",
      "fridge-sell": "PUESTO DE USADOS → PRUEBA DEL COMPRADOR → BANCO",
      "bank-delay": "BANCO → CONSULTAR ESTADO OFICIAL",
      "bank-open-account": "BANCO → CAJERO/VENTANILLA → CONFIRMAR ALTA",
      "family-medicine": "FARMACIA → NEGOCIAR → CASA DE MARTA",
      "rental-home": "DEPARTAMENTO → DOCUMENTACIÓN → BANCO SI RESERVÁS"
    };
    return routes[item.id] || `${cleanLocation(item.location).toUpperCase()} → INTERACTUAR → CERRAR O DEJAR ASENTADO`;
  }

  const MISSION_COUNTERPARTS = {
    "phone-sell": ["marta", "compradora del puesto"], "phone-buy": ["tano", "vendedor del puesto"],
    "fridge-buy": ["luli", "vendedora de usados"], "fridge-sell": ["carla", "compradora"],
    "family-medicine": ["marta", "Marta · quien encargó el remedio"], "rental-home": ["carla", "propietaria de la cabaña"],
    "rental-local": ["raul", "dueño del local"], "bank-delay": ["carla", "empleada del banco"],
    "bank-open-account": ["carla", "empleada del banco"], "job-shift": ["tano", "responsable del turno"],
    "job-interview": ["tano", "entrevistador"], "qr-pickup": ["tano", "imprentero"], "qr-delivery": ["luli", "encargada de la colecta"]
  };

  function counterpartForMission(mission, location) {
    if (cleanLocation(location) === "banco") return { id: "carla", name: "Carla", role: "empleada del banco" };
    if (cleanLocation(location) === "farmacia") return { id: "raul", name: "Don Raúl", role: "farmacéutico" };
    if (cleanLocation(location) === "comedor familiar") return { id: "marta", name: "Marta", role: "quien encargó el mandado" };
    if (cleanLocation(location) === "protectora") return { id: "raul", name: "Don Raúl", role: "responsable de la protectora" };
    if (cleanLocation(location) === "imprenta") return { id: "tano", name: "Tano", role: "imprentero" };
    const pair = MISSION_COUNTERPARTS[mission.id] || ["raul", `referente de ${cleanLocation(location)}`];
    const player = PLAYERS.find(item => item.id === pair[0] && item.id !== "nico") || PLAYERS.find(item => item.id !== "nico");
    return { id: player.id, name: player.name, role: pair[1] };
  }

  function updateErrandSlip() {
    const agenda = state.humanAgenda;
    if (!els.errandSlip) return;
    els.errandSlip.classList.toggle("is-saved", state.errandSlip?.visible === false);
    if (!agenda) {
      els.slipMission.textContent = "Elegí un mandado";
      els.slipStep.textContent = "Sin recorrido todavía";
      [els.slipDestination, els.slipCounterpart, els.slipAction, els.slipMoney, els.slipEvidence, els.slipNext].forEach(node => node.textContent = "");
      return;
    }
    const step = agenda.steps[agenda.index];
    const next = agenda.steps[agenda.index + 1];
    els.slipMission.textContent = agenda.mission.text;
    els.slipStep.textContent = `PASO ${Math.min(agenda.index + 1, agenda.steps.length)}/${agenda.steps.length}`;
    els.slipDestination.textContent = step ? `IR A: ${cleanLocation(step.location).toUpperCase()}` : "MANDADO TERMINADO";
    els.slipCounterpart.textContent = step ? `HABLAR CON: ${step.counterpartName} · ${step.counterpartRole}` : "";
    els.slipAction.textContent = step ? `${state.activeCounterpart?.interacted ? "HECHO" : "HACER"}: ${step.actionLabel}` : "";
    els.slipMoney.textContent = step?.requiredAmount ? `PLATA: ${step.requiredChannel || "BANCO"} · ${formatMoney(step.requiredAmount)}` : (step ? `PLATA: ${step.requiredChannel || "SEGÚN OPCIÓN"}` : "");
    els.slipEvidence.textContent = step?.evidence?.length ? `PRUEBA: ${step.evidence.join(", ")}` : "";
    els.slipNext.textContent = next ? `SIGUIENTE: ${cleanLocation(next.location)}` : "ÚLTIMO PASO";
  }

  function toggleErrandSlip() {
    state.errandSlip.visible = !state.errandSlip.visible;
    state.errandSlip.savedAt = Date.now();
    els.errandSlip.classList.toggle("is-saved", !state.errandSlip.visible);
  }

  function hydrateScenario(template, actor, round) {
    const base = ({ bike: ECONOMY_CONFIG.prices.bike, fridge: ECONOMY_CONFIG.prices.fridge, phone: ECONOMY_CONFIG.prices.phone,
      rental: ECONOMY_CONFIG.prices.homeDeposit, job: ECONOMY_CONFIG.remoteGrossSalary, qr: ECONOMY_CONFIG.prices.lunch,
      family: ECONOMY_CONFIG.prices.medicine })[template.id] || SCENARIO_AMOUNTS[template.id];
    const quotePrice = Math.round(base * (.85 + random() * .3) / 1000) * 1000;
    return {
      ...template, actorId: actor.id, actorName: actor.name, isScam: false, round,
      quotePrice,
      text: template.legit(actor.name), clues: template.legitClues,
      taskText: template.task(actor.name), extras: STORY_EXTRAS[template.id]
    };
  }

  function currentRound() { return state.scenarios[state.scenarioIndex]?.round ?? Math.max(0, state.roundNumber - 1); }
  function roundRecord(playerId, round = currentRound()) { return state.roundRecords[round]?.[playerId]; }

  function openMissionDialog() {
    if (state.gameOver || state.selectedMission || els.missionDialog.open) return;
    stopTimer();
    const round = currentRound();
    const profile = state.socialProfiles.nico;
    els.missionRound.textContent = round + 1;
    els.socialIdentity.textContent = `Sos ${profile.label}; tenés ${formatMoney(totalBalance("nico"))} disponibles y te movés por ${profile.place}. Tu mandado tiene que dejar rastros reales.`;
    els.missionChoices.innerHTML = state.pendingMissionPair.map((item, index) => `<button type="button" data-mission="${index}"><strong>${escapeHTML(item.text)}</strong><span>${escapeHTML(item.completedFact)}</span><small>${missionMoneyPreview(item)}</small><small class="mission-route">RECORRIDO: ${escapeHTML(missionRoute(item))}</small></button>`).join("");
    els.missionExplainer.textContent = "Elegí uno. Después jugás cómo lo resolvés; todavía no hay nada marcado como cumplido.";
    els.missionActionPanel.hidden = true;
    els.strategyPanel.hidden = true;
    els.missionOutcome.textContent = "";
    els.preparationChoices.innerHTML = "";
    els.delegationChoices.innerHTML = "";
    els.missionConfirmButton.disabled = true;
    els.missionDialog.showModal();
  }

  function chooseMission(index) {
    state.selectedMission = state.pendingMissionPair[index];
    state.selectedMissionAction = null;
    state.selectedMissionOption = null;
    state.selectedStrategy = null;
    state.selectedPreparation = null;
    state.selectedDelegation = "keep";
    els.missionChoices.querySelectorAll("button").forEach((button, buttonIndex) => button.classList.toggle("selected", buttonIndex === index));
    els.missionActionPanel.hidden = false;
    els.missionActionTitle.textContent = state.selectedMission.text;
    els.missionActionChoices.innerHTML = missionOptions(state.selectedMission).map((item, index) => {
      const unaffordable = !canAffordMissionOption("nico", item);
      return `<button type="button" data-mission-action="${index}" ${unaffordable ? "disabled" : ""}>
        <strong>${escapeHTML(item.label)}</strong>
        <span>${escapeHTML(item.caption)}</span>
        <small class="mission-line"><b>BOLSILLO</b>${escapeHTML(optionPocketLabel(item))}</small>
        <small class="mission-line"><b>TE DEJA</b>${escapeHTML(optionBenefitLabel(item))}</small>
        <small class="mission-line"><b>PRUEBA</b>${escapeHTML(optionEvidenceLabel(item))}</small>
        <small class="mission-line"><b>RIESGO</b>${escapeHTML(optionRiskText(item))}</small>
      </button>`;
    }).join("");
    els.strategyPanel.hidden = true;
    els.preparationChoices.innerHTML = "";
    els.delegationChoices.innerHTML = "";
    refreshMissionConfirm();
    state.transport.send("mission:selected", { playerId: "nico", missionId: state.selectedMission.scenarioId, round: currentRound() });
  }

  function chooseMissionAction(actionIndex) {
    const option = missionOptions(state.selectedMission)[Number(actionIndex)];
    if (!option) return;
    state.selectedMissionOption = option;
    state.selectedMissionAction = option.result;
    els.missionActionChoices.querySelectorAll("button").forEach(button => button.classList.toggle("selected", button.dataset.missionAction === String(actionIndex)));
    els.missionOutcome.textContent = `${option.label} · ${optionBenefitLabel(option)} Recorrido: ${option.steps.map(cleanLocation).join(" → ")}. ${option.paymentChannel === "cash" ? "Si no tenés efectivo, el primer paso es el cajero." : option.steps.includes("banco") ? "El banco queda marcado para acreditar o confirmar." : "La interacción queda registrada en el lugar."}`;
    if (state.roles.nico === "Estafador") renderPrivateStrategy();
    refreshMissionConfirm();
  }

  function renderPrivateStrategy() {
    const round = currentRound();
    const ready = readyResources("nico", round).filter(resource => roundScenarioIds(round).some(id => resource.compatibleScenarioTags.includes(id)));
    const forced = round >= 1 && state.scamAttempts === 0;
    if (forced && ready.length === 0) {
      const scenarioId = roundScenarioIds(round)[0];
      const blueprint = PREPARATIONS.find(item => item.scenarioIds.includes(scenarioId)) || PREPARATIONS.find(item => item.type === "edited-receipt");
      state.inventories.nico.push(makeResource(blueprint, round, "nico", "prepared", true, state.selectedMission.scenarioId));
      ready.push(state.inventories.nico.at(-1));
    }
    els.strategyPanel.hidden = false;
    const choices = forced ? [["seek", "Buscar oportunidad", "La primera vuelta cerró sin intento. Aparece una ocasión compatible, pero deja más rastros."]]
      : [["cover", "Construir cobertura", "Sumás otra actividad legítima y un testigo."], ["prepare", "Preparar maniobra", "Elegís un recurso concreto para usar desde la ronda siguiente."], ...(ready.length ? [["seek", "Buscar oportunidad", "Armás un recurso guardado para una historia compatible."]] : [])];
    els.strategyChoices.innerHTML = choices.map(item => `<button type="button" data-strategy="${item[0]}"><strong>${item[1]}</strong><span>${item[2]}</span></button>`).join("");
  }

  function chooseStrategy(strategy) {
    state.selectedStrategy = strategy;
    state.selectedPreparation = null;
    state.selectedDelegation = "keep";
    els.strategyChoices.querySelectorAll("button").forEach(button => button.classList.toggle("selected", button.dataset.strategy === strategy));
    els.delegationChoices.innerHTML = "";
    if (strategy === "prepare") renderPreparationChoices(compatiblePreparations(state.selectedMission));
    else if (strategy === "seek") renderPreparationChoices(readyResources("nico", currentRound()).filter(resource => roundScenarioIds(currentRound()).some(id => resource.compatibleScenarioTags.includes(id))), true);
    else els.preparationChoices.innerHTML = "";
    refreshMissionConfirm();
  }

  function compatiblePreparations(missionItem) {
    return PREPARATION_BY_SCENARIO[missionItem.scenarioId].map(type => PREPARATIONS.find(item => item.type === type));
  }

  function projectedMissionBalance() {
    return Math.max(0, totalBalance("nico") + (state.selectedMissionOption?.money || 0));
  }

  function renderPreparationChoices(items, inventory = false) {
    els.preparationChoices.innerHTML = `<p>${inventory ? "ELEGÍ QUÉ RECURSO ARMAR" : `TRES PREPARATIVOS · SALDO DESPUÉS DEL MANDADO ${formatMoney(projectedMissionBalance())}`}</p>${items.map(item => {
      const cost = item.cost ?? ECONOMY_CONFIG.preparationCosts[item.type];
      const disabled = !inventory && projectedMissionBalance() < cost;
      return `<button type="button" data-preparation="${inventory ? item.executionId : item.type}" ${disabled ? "disabled" : ""}><small>${escapeHTML(item.stamp)}</small><strong>${escapeHTML(item.label)}</strong><span>${escapeHTML(inventory ? `Guardado desde partida ${item.preparedEpisode || state.campaign.episodeNumber}, ronda ${item.preparedRound + 1}` : item.evidenceCreated)}</span>${!inventory ? `<b class="preparation-price">${formatMoney(cost)}${disabled ? " · NO ALCANZA" : ""}</b>` : ""}</button>`;
    }).join("")}`;
  }

  function choosePreparation(id) {
    state.selectedPreparation = state.selectedStrategy === "seek" ? state.inventories.nico.find(item => item.executionId === id) : PREPARATIONS.find(item => item.type === id);
    if (!state.selectedPreparation || (state.selectedStrategy === "prepare" && projectedMissionBalance() < state.selectedPreparation.cost)) { state.selectedPreparation = null; return; }
    els.preparationChoices.querySelectorAll("button").forEach(button => button.classList.toggle("selected", button.dataset.preparation === id));
    if (state.selectedStrategy === "prepare") {
      const accomplice = currentAccomplice();
      els.delegationChoices.innerHTML = `<p>¿QUIÉN LO GUARDA?</p><button type="button" data-delegation="keep" class="selected">Me lo quedo</button>${accomplice ? `<button type="button" data-delegation="delegate">Se lo encargo a ${escapeHTML(accomplice.name)}</button><small>La plata y el porcentaje se hablan después, cara a cara.</small>` : `<small>El Cómplice ya quedó auditado y no puede recibir nuevos encargos.</small>`}`;
    }
    refreshMissionConfirm();
  }

  function chooseDelegation(value) {
    state.selectedDelegation = value;
    els.delegationChoices.querySelectorAll("[data-delegation]").forEach(button => button.classList.toggle("selected", button.dataset.delegation === value));
  }

  function refreshMissionConfirm() {
    const privateReady = state.roles.nico !== "Estafador" || (state.selectedStrategy && (!["prepare", "seek"].includes(state.selectedStrategy) || state.selectedPreparation));
    els.missionConfirmButton.disabled = !state.selectedMission || !state.selectedMissionAction || !privateReady;
  }

  function confirmMission() {
    if (els.missionConfirmButton.disabled) return;
    const round = currentRound();
    const record = roundRecord("nico", round);
    const mission = state.selectedMission;
    let preparedResource = null;
    const witness = PLAYERS.find(player => player.id !== "nico" && player.id === record.witnesses[0]) || PLAYERS[0];
    record.publicMission = mission;
    record.missionResolution = "in-progress";
    record.missionCompleted = false;
    record.publicActions = [];
    record.attemptedActions = [];
    record.visitedLocations = [];
    record.heldAssets = [mission.asset];
    record.timeline = [{ order: 1, text: `Salió a cumplir: ${mission.text}.`, observable: true, time: Date.now() }];
    record.strategy = state.selectedStrategy || "publica";
    if (state.selectedStrategy === "cover") {
      record.coverStrength = 2;
      roundRecord(witness.id, round).visitedLocations.push(mission.location);
      record.publicActions.push(`${witness.name} me acompañó a cerrar otro trámite del ${state.socialProfiles.nico.place}.`);
    }
    if (state.selectedStrategy === "prepare") {
      const accomplice = currentAccomplice();
      const delegated = state.selectedDelegation === "delegate" && accomplice;
      const holderId = delegated ? accomplice.id : "nico";
      const status = delegated ? "delegated" : "prepared";
      if (projectedMissionBalance() < state.selectedPreparation.cost) return toast("No te alcanza después de resolver el mandado.");
      const resource = makeResource(state.selectedPreparation, round, holderId, delegated ? "delegating" : "procuring", false, mission.scenarioId);
      preparedResource = resource;
      resource.finalStatus = status;
      resource.pendingCost = state.selectedPreparation.cost;
      state.inventories[holderId].push(resource);
      record.hiddenPreparation = resource;
      state.transport.send("preparation:selected", { playerId: "nico", type: resource.type, availableFromRound: resource.availableFromRound });
      if (accomplice) {
        const deal = { id: makeId("deal"), episodeId: state.campaign.episodeNumber, round, scammerId: "nico", accompliceId: accomplice.id, holderId, resourceId: resource.executionId, delegated, offeredShare: null, gross: 0, reportedAmount: null, expected: 0, paid: 0, retained: 0, truthfulness: "unknown", explanationId: null, behavior: "pending", proof: false, pressure: 0, encounterState: "pending", dialogueKeys: [] };
        resource.dealId = deal.id;
        state.accompliceDeals.push(deal);
        if (status === "delegated") {
          state.transport.send("accomplice:deal-offered", { id: deal.id, fromId: "nico", toId: holderId, resourceId: resource.executionId });
          state.transport.send("preparation:delegated", { fromId: "nico", toId: holderId, executionId: resource.executionId });
        }
      }
    } else if (state.selectedStrategy === "seek") {
      state.selectedPreparation.status = "armed";
    }
    assignOpportunitiesForRound(round);
    let agendaSteps = [...state.selectedMissionOption.steps];
    if (state.selectedStrategy === "prepare") {
      const prepPlace = ({ mule: "banco", "qr-sticker": "imprenta", "fake-flyers": "imprenta", "cloned-listing": "oficina", "borrowed-identity": "plaza", "edited-receipt": "imprenta" })[state.selectedPreparation.type];
      if (prepPlace) agendaSteps.push(prepPlace);
      if (state.selectedPreparation.type === "mule") agendaSteps.push("banco");
      if (state.selectedDelegation === "delegate") {
        agendaSteps.push("plaza");
        const accomplice = currentAccomplice();
        if (accomplice && preparedResource) enqueueBotRoute(accomplice.id, "plaza", { purpose: "encounter", stableKey: `brief:${preparedResource.dealId || preparedResource.executionId}`, note: `${accomplice.name} fue a encontrarse con Nico` });
      }
    }
    const stepKinds = state.selectedMissionOption.medicine ? ["advance", "negotiate", "deliver"] : agendaSteps.map(() => "regular");
    const requiredCash = state.selectedMissionOption.payment?.requiredCash || 0;
    if (!state.selectedMissionOption.medicine && requiredCash > state.campaign.economy.nico.cash) {
      agendaSteps.unshift("banco");
      stepKinds.unshift("atm");
    }
    state.humanAgenda = { mission, option: state.selectedMissionOption, steps: agendaSteps.map((location, index) => makeAgendaStep(mission, state.selectedMissionOption, location, index, stepKinds[index] || "regular", round)), index: 0, round, medicine: state.selectedMissionOption.medicine ? { advancePaid: false, purchased: false, atmVisits: 0, offerExpiresAt: Date.now() + 90000 } : null };
    if (!state.selectedMissionOption.medicine && requiredCash > state.campaign.economy.nico.cash) {
      const atmStep = state.humanAgenda.steps[0];
      state.missionAtmRequirement = {
        agendaId: `${state.campaign.episodeNumber}:${round}:${mission.id}`,
        stepId: atmStep.stableId,
        requiredCash: requiredCash - state.campaign.economy.nico.cash,
        targetCash: requiredCash,
        returnStepId: state.humanAgenda.steps[1]?.stableId || null,
        returnLocation: cleanLocation(state.selectedMissionOption.steps[0]),
        withdrawn: 0,
        status: "pending"
      };
    }
    state.agendas.nico = state.humanAgenda;
    state.errandSlip = { visible: true, missionId: mission.id, stepIndex: 0, savedAt: Date.now() };
    state.activeCounterpart = null;
    els.publicMissionNote.textContent = `${mission.text} · 0/${agendaSteps.length} pasos`;
    els.missionDialog.close();
    addSystemFeed(`Mandado jugado: ${mission.text}`);
    state.transport.send("agenda:step-started", { playerId: "nico", missionId: mission.scenarioId, step: 0, round });
    renderTasks();
    renderInventory();
    updateMeters();
    saveCampaign();
    startDayClock();
    updateErrandSlip();
    advanceHumanAgenda();
  }

  let _stepCounter = 0;
  function makeAgendaStep(mission, option, location, index, kind, round) {
    const counterpart = counterpartForMission(mission, location);
    const amount = option.payment?.requiredCash || option.payment?.requiredBank || 0;
    const action = kind === "atm" ? "retirar el monto indicado" : kind === "deliver" ? "entregar y rendir el comprobante" : index === 0 ? (mission.id.includes("phone") ? "revisar IMEI y factura" : `hablar sobre ${mission.asset || "el trámite"}`) : "confirmar y dejar evidencia";
    const semanticKey = kind === "atm" ? "atm-withdrawal" : kind === "deliver" ? "delivery" : kind === "advance" ? "origin-contact" : kind === "negotiate" ? "inspection" : kind === "purchase" ? "payment" : "settlement";
    const stableId = `${state.campaign?.episodeNumber || 0}:${round}:${mission.id}:${semanticKey}:${++_stepCounter}`;
    return {
      id: stableId, stableId, location, kind, semanticKey,
      status: "pending",
      counterpartId: kind === "atm" ? null : counterpart.id,
      counterpartName: kind === "atm" ? "cajero del barrio" : counterpart.name,
      counterpartRole: kind === "atm" ? "cajero" : counterpart.role,
      interaction: kind === "atm" ? "Elegí cuánto retirar" : mission.completedFact,
      actionLabel: action,
      requiredChannel: kind === "atm" ? "BANCO" : option.paymentChannel === "cash" ? "EFECTIVO" : option.paymentChannel === "bank" ? "BANCO" : "SIN PAGO",
      requiredAmount: amount,
      evidence: option.evidence || [],
      duration: 4
    };
  }

  function advanceHumanAgenda() {
    const agenda = state.humanAgenda;
    if (!agenda) return;
    const step = agenda.steps[agenda.index];
    if (!step) return finishHumanAgenda();
    travelToLocation(step.location, () => {
      const interact = () => {
      announceAgendaInteraction(agenda, step);
      if (step.kind === "atm") {
        openATMForAgenda(agenda, step);
        return;
      }
      if (step.kind === "advance" && agenda.medicine && !agenda.medicine.advancePaid) {
        credit("nico", agenda.option.advanceAmount, "Adelanto de Marta para los remedios", true, "bank", false, { advanceAmount: agenda.option.advanceAmount });
        agenda.medicine.advancePaid = true;
        speak("marta", `Te pasé ${formatMoney(agenda.option.advanceAmount)}. Traeme el ticket y después te pago el mandado.`, "medicine-advance", "family");
        const cashNeeded = agenda.option.paymentChannel === "cash" ? (agenda.option.productCost || agenda.option.payment?.requiredCash || 0) : 0;
        if (cashNeeded > state.campaign.economy.nico.cash) {
          step.status = "done";
          agenda.index += 1;
          agenda.steps.splice(agenda.index, 0, makeAgendaStep(agenda.mission, agenda.option, "banco", agenda.index, "atm", agenda.round));
          const atmStep = agenda.steps[agenda.index];
          state.missionAtmRequirement = { agendaId: `${state.campaign.episodeNumber}:${agenda.round}:${agenda.mission.id}`, stepId: atmStep.stableId, requiredCash: cashNeeded - state.campaign.economy.nico.cash, targetCash: cashNeeded, returnStepId: agenda.steps[agenda.index + 1]?.stableId || null, returnLocation: "farmacia", withdrawn: 0, status: "pending" };
          toast(`Marta adelantó la plata en el banco. Antes de la farmacia, te faltan ${formatMoney(state.missionAtmRequirement.requiredCash)} en efectivo.`);
          state.transport.send("agenda:step-completed", { playerId: "nico", missionId: agenda.mission.scenarioId, step: 0, location: "comedor familiar", round: agenda.round });
          updateErrandSlip();
          advanceHumanAgenda();
          return;
        }
      }
      if (["negotiate", "purchase"].includes(step.kind) && agenda.medicine && !agenda.medicine.purchased) {
        if (agenda.option.id === "medicine-cash" && Date.now() > agenda.medicine.offerExpiresAt && !agenda.medicine.priceChanged) {
          agenda.medicine.actualProductCost = 36000;
          agenda.medicine.priceChanged = true;
          speak("marta", "El farmacéutico no sostuvo los treinta. Te lo deja a treinta y seis porque tardaste en volver.", "medicine-offer-changed", "family");
          toast("La oferta cambió: ahora necesitás $36.000 en efectivo.");
        }
        const actualCost = agenda.medicine.actualProductCost || agenda.option.productCost;
        const neededCash = agenda.option.paymentChannel === "cash" ? actualCost : 0;
        if (neededCash && state.campaign.economy.nico.cash < neededCash) {
          step.status = "settling";
          agenda.medicine.atmVisits += 1;
          const existingAtm = agenda.steps.find(candidate => candidate.kind === "atm" && candidate.status !== "done");
          const atmStep = existingAtm || makeAgendaStep(agenda.mission, agenda.option, "banco", agenda.index, "atm", agenda.round);
          if (!existingAtm) agenda.steps.splice(agenda.index, 0, atmStep);
          state.missionAtmRequirement = { agendaId: `${state.campaign.episodeNumber}:${agenda.round}:${agenda.mission.id}`, stepId: atmStep.stableId, requiredCash: neededCash - state.campaign.economy.nico.cash, targetCash: neededCash, returnStepId: step.stableId, returnLocation: "farmacia", withdrawn: 0, status: "pending" };
          toast(`La farmacia mantiene la oferta. Te faltan ${formatMoney(state.missionAtmRequirement.requiredCash)} en efectivo.`);
          advanceHumanAgenda();
          return;
        }
        purchaseMedicine(agenda);
      }
      if (step.kind === "deliver" && agenda.medicine?.purchased) settleMedicineDelivery(agenda);
      recordVisit("nico", step.location, `Paso ${agenda.index + 1}: ${agenda.mission.text}`);
      commitAgendaStep(step, { ok: true });
      if (agenda.index < agenda.steps.length) {
        toast(`Paso hecho. Ahora andá a ${cleanLocation(agenda.steps[agenda.index].location)}.`);
        advanceHumanAgenda();
      }
      };
      prepareAgendaInteraction(agenda, step, interact);
    }, `AGENDA · ${agenda.mission.text}`);
  }

  function prepareAgendaInteraction(agenda, step, onInteract) {
    const counterpart = step.counterpartId ? PLAYERS.find(player => player.id === step.counterpartId) : null;
    let interaction = onInteract;
    if (step.location === "plaza" && state.selectedDelegation === "delegate" && state.roles.nico === "Estafador") {
      interaction = () => openDelegationBriefing(agenda, step, onInteract);
    }
    step.status = counterpart && counterpart.id !== "nico" ? "waiting-counterpart" : "ready-to-interact";
    state.activeCounterpart = { playerId: step.counterpartId, counterpartName: step.counterpartName, missionId: agenda.mission.id, stepId: step.id, available: !(counterpart && counterpart.id !== "nico"), interacted: false, kind: step.kind, onInteract: interaction };
    updateErrandSlip();
    if (step.kind === "atm") {
      els.interactionPrompt.textContent = "APRETÁ E PARA USAR EL CAJERO";
      toast("Llegaste al banco. Acercate al cajero y apretá E para retirar.");
      return;
    }
    els.interactionPrompt.textContent = `APRETÁ E PARA HABLAR CON ${step.counterpartName.toUpperCase()}`;
    if (counterpart && counterpart.id !== "nico") {
      enqueueBotRoute(counterpart.id, step.location, { purpose: "counterpart", stableKey: step.stableId, note: `${counterpart.name} espera para: ${agenda.mission.text}`, callback: () => {
        if (step.status === "waiting-counterpart") {
          step.status = "ready-to-interact";
          state.activeCounterpart.available = true;
          els.interactionPrompt.hidden = false;
        }
      } });
      speak(counterpart.id, `Estoy acá para ${step.actionLabel}. Hablemos y dejamos constancia.`, "counterpart-arrival", agenda.mission.id);
      els.interactionPrompt.hidden = true;
      toast(`Llegaste a ${cleanLocation(step.location)}. Esperá a ${step.counterpartName} y apretá E.`);
    } else {
      els.interactionPrompt.hidden = false;
      toast(`Llegaste a ${cleanLocation(step.location)}. Apretá E para hablar con ${step.counterpartName}.`);
    }
  }

  function openDelegationBriefing(agenda, step, continueInteraction) {
    const resource = state.inventories.nico.find(item => item.dealId && item.status === "delegating") || state.inventories[currentAccomplice()?.id || ""]?.find(item => item.dealId);
    const deal = resource ? state.accompliceDeals.find(item => item.id === resource.dealId) : null;
    if (!deal || deal.briefed) return continueInteraction();
    const accomplice = currentAccomplice();
    state.pendingEncounter = { mode: "delegation-brief", deal, resource, continueInteraction };
    els.payoutKicker.textContent = "CHARLA EN LA PLAZA";
    els.payoutTitle.textContent = `${accomplice?.name || "El Cómplice"} quiere saber el arreglo`;
    els.payoutText.textContent = "Le contás qué vas a preparar y negociás ahora cuánto le reconocerías si aparece plata. La decisión queda entre ustedes.";
    els.payoutChoices.innerHTML = [0, .2, .35, .5].map(value => `<button type="button" data-delegation-share="${value}"><strong>${Math.round(value * 100)}%</strong><span>${value ? `Le ofrecés ${Math.round(value * 100)}% si funciona.` : "Te reservás todo; igual tiene que saber el plan."}</span></button>`).join("");
    els.payoutDialog.showModal();
  }

  function announceAgendaInteraction(agenda, step) {
    if (step.interactionShown) return;
    step.interactionShown = true;
    const id = agenda.mission.id;
    if (id === "phone-sell" && step.location === "puesto de usados") {
      const buyer = PLAYERS.find(player => player.id !== "nico") || PLAYERS[0];
      addSystemFeed(`Puesto de usados · ${buyer.name} quiere comprar tu celular.`);
      speak(buyer.id, "Antes de pagar quiero ver la factura, prenderlo y comparar el IMEI con la caja.", "phone-buyer-check", "phone");
      toast("El comprador te pide factura, equipo encendido e IMEI visible.");
    } else if (id === "phone-buy" && step.location === "puesto de usados") {
      addSystemFeed("Puesto de usados · el vendedor te ofrece probar el equipo antes de hablar de precio.");
      speak("tano", "Lo probamos acá. Si el IMEI no coincide con la caja, no hay trato.", "phone-seller-check", "phone");
      toast("Primero revisá IMEI, factura y estado del equipo.");
    } else if (step.location === "banco") {
      addSystemFeed(`Banco · paso necesario para ${agenda.mission.text.toLowerCase()}.`);
      toast("Este paso sirve para acreditar, retirar efectivo o confirmar el trámite.");
    } else if (id === "fridge-buy" && step.location === "puesto de usados") {
      addSystemFeed("Puesto de usados · la heladera se prueba enchufada antes de pagar.");
      toast("Esperá que enfríe y anotá el número de serie.");
    } else if (step.kind === "regular") {
      addSystemFeed(`Interacción registrada en ${cleanLocation(step.location)} · ${agenda.mission.text}.`);
      toast(`Llegaste a ${cleanLocation(step.location)}. La visita y la contraparte quedan asentadas.`);
    }
  }

  function purchaseMedicine(agenda) {
    const option = agenda.option;
    const actualCost = agenda.medicine.actualProductCost || option.productCost;
    const paid = option.paymentChannel === "cash"
      ? debitCash("nico", actualCost, `Farmacia · ${option.label}`, option.result === "verified", { productCost: actualCost, negotiatedPrice: actualCost })
      : debitBank("nico", actualCost, `Farmacia · ${option.label}`, option.result === "verified", { productCost: actualCost, negotiatedPrice: actualCost });
    if (!paid) return false;
    agenda.medicine.purchased = true;
    agenda.medicine.actualCost = actualCost;
    if (option.retainedDifference) {
      const retained = Math.max(0, option.advanceAmount - actualCost);
      agenda.medicine.retainedDifference = retained;
      state.campaign.economy.nico.unexplained = (state.campaign.economy.nico.unexplained || 0) + retained;
      const account = state.campaign.economy.nico;
      recordTransaction({ fromId: "adelanto-marta", toId: "nico", amount: retained, channel: "difference", label: "Diferencia negociada retenida", visibleLabel: "Diferencia del mandado", legitimate: false, bankBefore: account.bank, cashBefore: account.cash, bankAfter: account.bank, cashAfter: account.cash, advanceAmount: option.advanceAmount, productCost: actualCost, negotiatedPrice: actualCost, retainedDifference: retained, discoveryRisk: .55 });
    }
    speak("nico", `Cerré los remedios en ${formatMoney(actualCost)}. Guardame la bolsa y el ticket.`, "medicine-purchase", "family");
    return true;
  }

  function settleMedicineDelivery(agenda) {
    if (agenda.medicine.delivered) return;
    const option = agenda.option;
    if (option.refundAmount) debitBank("nico", option.refundAmount, "Devolución del ahorro a Marta", true, { reportedDifference: option.refundAmount });
    credit("nico", option.serviceFee, "Honorario de Marta por el mandado", true, "cash", false, { serviceFee: option.serviceFee });
    agenda.medicine.delivered = true;
    speak("marta", `Gracias. Acá tenés ${formatMoney(option.serviceFee)} por el viaje.`, "medicine-delivery", "family");
  }

  function commitAgendaStep(step, result) {
    if (step.status === "done" || step.status === "cancelled" || step.status === "failed") return false;
    step.status = result.ok ? "done" : "failed";
    const agenda = state.humanAgenda;
    if (!agenda) return false;
    agenda.index += 1;
    els.publicMissionNote.textContent = `${agenda.mission.text} · ${agenda.index}/${agenda.steps.length} pasos`;
    state.transport.send("agenda:step-completed", { playerId: "nico", missionId: agenda.mission.scenarioId, step: agenda.index - 1, location: step.location, round: agenda.round });
    if (agenda.index >= agenda.steps.length) finishHumanAgenda();
    return true;
  }

  function finishHumanAgenda() {
    const agenda = state.humanAgenda;
    if (!agenda) return;
    const record = roundRecord("nico", agenda.round);
    const { mission, option } = agenda;
    if (!agenda.economyApplied) {
      const economyResult = applyMissionOptionEconomy(mission, option);
      if (!economyResult.ok) {
        const lastStep = agenda.steps[Math.max(0, agenda.index - 1)];
        if (lastStep) lastStep.status = "settling";
        agenda.index = Math.max(0, agenda.index - 1);
        els.publicMissionNote.textContent = `${mission.text} · falta resolver el pago o la propiedad`;
        toast(economyResult.reason || "La operación no se pudo cerrar todavía.");
        updateErrandSlip();
        return;
      }
      agenda.economyApplied = true;
    }
    record.missionResolution = option.result;
    record.missionCompleted = option.result !== "cancelled";
    const fact = option.result === "cancelled" ? mission.attemptedFact : option.result === "informal" ? `${mission.completedFact} El acuerdo quedó de palabra.` : mission.completedFact;
    (record.missionCompleted ? record.publicActions : record.attemptedActions).push(fact);
    if (record.hiddenPreparation) {
      if (!debit("nico", record.hiddenPreparation.pendingCost, `Materiales y trámite: ${record.hiddenPreparation.label}`, false)) {
        record.hiddenPreparation.status = "failed";
      } else record.hiddenPreparation.status = record.hiddenPreparation.finalStatus;
    }
    state.trust = clamp(state.trust + (option.result === "verified" ? 2 : option.result === "cancelled" ? 0 : 1), 0, 100);
    if (option.result === "verified") state.security = clamp(state.security + 1, 0, 100);
    els.publicMissionNote.textContent = `${mission.text} · ${record.missionCompleted ? "hecho" : "intento asentado"}`;
    state.transport.send("mission:resolved", { playerId: "nico", missionId: mission.scenarioId, result: option.result, round: agenda.round });
    state.humanAgenda = null;
    state.activeCounterpart = null;
    state.errandSlip.missionId = null;
    state.errandSlip.stepIndex = 0;
    state.errandSlip.visible = true;
    updateErrandSlip();
    renderEconomy(); renderInventory(); updateMeters(); saveCampaign();
    addSystemFeed(`Terminaste tu agenda. Los demás siguen con la suya.`);
    startDayClock();
    renderScenario();
  }

  function applyMissionOptionEconomy(mission, option, playerId = "nico") {
    unlockVerifiedJob(mission, option, playerId);
    if (option.medicine) {
      if (playerId !== "nico" && option.result !== "cancelled") credit(playerId, option.money, `Mandado completo: ${mission.text}`, option.result === "verified", "cash");
      return { ok: true };
    }
    if (!option.money) return { ok: true };
    const effect = mission.economy;
    if (effect?.type === "sell") {
      const asset = findAsset(playerId, effect.assetType);
      if (!asset) return { ok: false, reason: `No podés cerrar la venta: ${PLAYERS.find(player => player.id === playerId)?.name || "el jugador"} no posee ese bien.` };
      return { ok: Boolean(sellAsset(playerId, effect.assetType, option.money, `Venta: ${mission.text}`, option.paymentChannel)), reason: "La transferencia de propiedad no se pudo registrar." };
    }
    if (effect?.type === "buy") {
      const cost = Math.abs(option.money);
      const paid = option.paymentChannel === "cash"
        ? debitCash(playerId, cost, `Compra: ${mission.text}`, option.result === "verified", { productCost: cost, negotiatedPrice: cost })
        : debit(playerId, cost, `Compra: ${mission.text}`, option.result === "verified");
      if (paid) {
        const asset = { id: makeId("asset"), type: effect.assetType, label: effect.assetLabel, value: cost, ownerId: playerId, source: mission.text, acquiredEpisode: state.campaign.episodeNumber };
        state.campaign.economy[playerId].assets.push(asset);
        state.transport.send("asset:transferred", { assetId: asset.id, fromId: "vendedor", toId: playerId, amount: cost });
      }
      return { ok: Boolean(paid), reason: `No alcanza el saldo del canal ${option.paymentChannel === "cash" ? "efectivo" : "bancario"}.` };
    }
    if (option.money > 0) credit(playerId, option.money, `Trabajo encargado: ${mission.text}`, option.result === "verified", option.result === "informal" ? "cash" : "bank");
    else if (!debit(playerId, Math.abs(option.money), `Pago: ${mission.text}`, option.result === "verified")) return { ok: false, reason: "No alcanza el saldo para completar el pago." };
    return { ok: true };
  }

  function makeResource(blueprint, round, holderId, status = "prepared", improvised = false, sourceMissionId = null) {
    return { type: blueprint.type, label: blueprint.label, stamp: blueprint.stamp, preparedRound: round, availableFromRound: improvised ? round : round + 1,
      preparedEpisode: state.campaign.episodeNumber, availableFromEpisode: state.campaign.episodeNumber, cost: blueprint.cost || ECONOMY_CONFIG.preparationCosts[blueprint.type],
      sourceMissionId: sourceMissionId || roundRecord(holderId, round)?.publicMission?.scenarioId, compatibleScenarioTags: [...blueprint.scenarioIds],
      evidenceCreated: blueprint.evidenceCreated, executionCaption: blueprint.executionCaption, holderId, status, improvised,
      executionId: `${blueprint.type}-${round}-${random().toString(36).slice(2, 7)}` };
  }

  function readyResources(playerId, round) {
    return state.inventories[playerId].filter(item => ["prepared", "armed", "delegated"].includes(item.status) && ((item.preparedEpisode || 1) < state.campaign.episodeNumber || item.availableFromRound <= round));
  }
  function roundScenarioIds(round) { return state.scenarios.filter(item => item.round === round).map(item => item.id); }

  function setupBotScammerTurn(playerId, round) {
    const record = roundRecord(playerId, round);
    const ready = readyResources(playerId, round).filter(resource => roundScenarioIds(round).some(id => resource.compatibleScenarioTags.includes(id)));
    const forced = round >= 1 && state.scamAttempts === 0;
    if (forced && ready.length === 0) {
      const scenarioId = roundScenarioIds(round)[0];
      const blueprint = PREPARATIONS.find(item => item.scenarioIds.includes(scenarioId));
      const improvised = makeResource(blueprint, round, playerId, "armed", true, record.publicMission.scenarioId);
      state.inventories[playerId].push(improvised);
      ready.push(improvised);
    }
    if (ready.length && (forced || random() < .8)) ready[0].status = "armed";
    else if (random() < .78) {
      const blueprint = compatiblePreparations(record.publicMission).find(item => totalBalance(playerId) >= item.cost);
      if (!blueprint) { record.strategy = "cover"; record.coverStrength = 2; assignOpportunitiesForRound(round); return; }
      const accomplice = currentAccomplice();
      const delegate = Boolean(accomplice && random() < .35);
      const holderId = delegate ? accomplice.id : playerId;
      debit(playerId, blueprint.cost, `Retiro y materiales para ${blueprint.label}`, false);
      const resource = makeResource(blueprint, round, holderId, delegate ? "delegated" : "prepared", false, record.publicMission.scenarioId);
      state.inventories[holderId].push(resource);
      record.hiddenPreparation = resource;
      state.transport.send("preparation:selected", { playerId, type: resource.type, availableFromRound: resource.availableFromRound });
      if (accomplice) {
        const deal = { id: makeId("deal"), episodeId: state.campaign.episodeNumber, round, scammerId: playerId, accompliceId: accomplice.id, holderId, resourceId: resource.executionId, delegated: delegate, offeredShare: null, gross: 0, reportedAmount: null, expected: 0, paid: 0, retained: 0, truthfulness: "unknown", explanationId: null, behavior: "pending", proof: false, pressure: 0, encounterState: "pending", dialogueKeys: [] };
        resource.dealId = deal.id;
        state.accompliceDeals.push(deal);
        if (delegate) {
          state.transport.send("accomplice:deal-offered", { id: deal.id, fromId: playerId, toId: holderId, resourceId: resource.executionId });
          state.transport.send("preparation:delegated", { fromId: playerId, toId: holderId, executionId: resource.executionId });
        }
      }
      record.strategy = "prepare";
    } else { record.strategy = "cover"; record.coverStrength = 2; }
    assignOpportunitiesForRound(round);
  }

  function assignOpportunitiesForRound(round) {
    const stories = state.scenarios.filter(item => item.round === round);
    const assigned = new Set(Object.values(state.opportunityByScenario).filter(item => item.round === round).map(item => item.scenarioId));
    PLAYERS.forEach(holder => {
      if (assigned.size >= 2) return;
      const resource = state.inventories[holder.id].find(item => {
        const available = (item.preparedEpisode || 1) < state.campaign.episodeNumber || item.availableFromRound <= round;
        const ownExecution = state.roles[holder.id] === "Estafador" && item.status === "armed";
        const deal = item.dealId && state.accompliceDeals.find(entry => entry.id === item.dealId);
        const delegatedExecution = state.roles[holder.id] === "Cómplice" && item.status === "delegated"
          && deal?.episodeId === state.campaign.episodeNumber && state.roles[deal.scammerId] === "Estafador";
        return available && item.status !== "used" && (ownExecution || delegatedExecution);
      });
      if (!resource) return;
      const story = stories.find(item => !assigned.has(item.id) && resource.compatibleScenarioTags.includes(item.id));
      if (!story) return;
      assigned.add(story.id);
      const opportunity = { round, scenarioId: story.id, holderId: holder.id, resourceId: resource.executionId, delegated: state.roles[holder.id] === "Cómplice" };
      state.opportunityByScenario[`${round}:${story.id}`] = opportunity;
      // A bot holder can replace the public actor because its decision is
      // resolved autonomously. A human Cómplice must keep the public actor in
      // place and receive an explicit private choice in renderScenario();
      // otherwise the scene has no enabled action and the round deadlocks.
      if (!holder.human) {
        const displacedId = story.actorId;
        const displacedName = story.actorName;
        const holderStory = stories.find(item => item !== story && item.actorId === holder.id);
        if (holderStory) {
          holderStory.actorId = displacedId; holderStory.actorName = displacedName;
          holderStory.text = holderStory.legit(displacedName); holderStory.clues = holderStory.legitClues; holderStory.taskText = holderStory.task(displacedName);
        }
        story.actorId = holder.id; story.actorName = holder.name; story.text = story.scam(holder.name); story.clues = story.scamClues; story.isScam = true;
        story.taskText = story.task(holder.name);
      }
      state.transport.send("fraud:opportunity", opportunity);
    });
  }

  function renderInventory() {
    const own = state.inventories.nico.filter(item => item.status !== "used");
    const delegated = PLAYERS.filter(player => state.roles[player.id] === "Cómplice").flatMap(player => state.inventories[player.id].filter(item => item.status === "delegated"));
    const statusCopy = { prepared: "guardado", armed: "buscando ocasión", delegated: "con Cómplice" };
    els.inventoryPocket.hidden = false;
    if (state.roles.nico === "Estafador") {
      els.inventoryPocket.innerHTML = `<b>INVENTARIO PRIVADO</b>${[...own, ...delegated].map(item => `<span>${escapeHTML(item.label)} · ${item.holderId === "nico" ? statusCopy[item.status] : `con ${escapeHTML(currentAccomplice()?.name || "Cómplice")}`}</span>`).join("") || "<span>Vacío</span>"}`;
    } else if (own.length) {
      els.inventoryPocket.innerHTML = `<b>OBJETOS COMPROMETEDORES</b>${own.map(item => `<span>${escapeHTML(item.label)} · viene de la partida ${item.preparedEpisode || 1}</span><span class="resource-actions"><button type="button" data-resource-action="surrender" data-resource-id="${item.executionId}">Entregar</button><button type="button" data-resource-action="sell" data-resource-id="${item.executionId}">Vender</button></span>`).join("")}`;
    } else {
      els.inventoryPocket.innerHTML = `<b>INVENTARIO</b><span>Sin objetos comprometidos</span>`;
    }
    renderEconomy();
  }

  function disposeResource(action, resourceId) {
    const resource = state.inventories.nico.find(item => item.executionId === resourceId && item.status !== "used");
    if (!resource || state.roles.nico === "Estafador") return;
    if (action === "sell") {
      const resale = Math.round((resource.cost || 0) * .5);
      credit("nico", resale, `Venta de material heredado: ${resource.label}`, false, "cash", true);
      state.suspicion.nico += .8;
      addSystemFeed(`Vendiste ${resource.label} por ${formatMoney(resale)}. Quedó un ingreso difícil de explicar.`);
    } else {
      state.trust = clamp(state.trust + 3, 0, 100);
      addSystemFeed(`Entregaste ${resource.label}. Su origen anterior quedó asentado.`);
    }
    resource.status = "used";
    saveCampaign(); renderInventory(); updateMeters();
  }

  function professionPropSVG(profileId) {
    switch (profileId) {
      case "store": return `<rect x="23" y="16" width="7" height="10" rx="1" fill="#d0b369" stroke="#2a261f" stroke-width="1.6"/><path d="M23 18h7" stroke="#2a261f" stroke-width="1.4"/><path d="M26.5 16v10" stroke="#2a261f" stroke-width="1.4"/>`;
      case "delivery": return `<path d="M22 17h7l2 4v7h-9z" fill="#7b5b40" stroke="#2a261f" stroke-width="1.6"/><path d="M24 18v10" stroke="#2a261f" stroke-width="1.2"/>`;
      case "shelter": return `<path d="M24 17c2 0 3 2 3 4 0-2 1-4 3-4s4 2 4 4c0 3-3 5-7 8-4-3-7-5-7-8 0-2 2-4 4-4z" fill="#b34e45" stroke="#2a261f" stroke-width="1.4"/>`;
      case "landlord": return `<rect x="24" y="16" width="7" height="12" fill="#efe0b7" stroke="#2a261f" stroke-width="1.4"/><path d="M26 20h3M26 23h3" stroke="#2a261f" stroke-width="1.1"/>`;
      case "technician": return `<path d="M23 18l3-3 5 5-3 3z" fill="#787f7a" stroke="#2a261f" stroke-width="1.4"/><path d="M28 21l3 3" stroke="#2a261f" stroke-width="1.2"/>`;
      case "printer": return `<rect x="23" y="18" width="9" height="7" fill="#efe0b7" stroke="#2a261f" stroke-width="1.4"/><path d="M23 21h9" stroke="#2a261f" stroke-width="1.2"/><path d="M26 18v7M29 18v7" stroke="#2a261f" stroke-width="1.1"/>`;
      case "reseller": return `<rect x="23" y="17" width="8" height="11" rx="1.5" fill="#8aa39d" stroke="#2a261f" stroke-width="1.4"/><circle cx="27" cy="25.5" r="1" fill="#2a261f"/>`;
      default: return `<rect x="23" y="17" width="8" height="11" rx="1" fill="#c4b58c" stroke="#2a261f" stroke-width="1.4"/><path d="M25 20h4M25 23h4" stroke="#2a261f" stroke-width="1.1"/>`;
    }
  }

  function playerAccessorySVG(player) {
    switch (player.id) {
      case "marta": return `<circle cx="24.5" cy="8.5" r="3.8" fill="${player.hair}" stroke="#2a261f" stroke-width="1.4"/><path d="M8 26h5l2 4H7z" fill="#d8c596" stroke="#2a261f" stroke-width="1.4"/>`;
      case "nico": return `<path d="M7 7h14v4H8l-3 2z" fill="#d0b34e" stroke="#2a261f" stroke-width="1.4"/><rect x="23" y="15" width="7" height="10" fill="#e3dcc0" stroke="#2a261f" stroke-width="1.4"/>`;
      case "luli": return `<path d="M9 7h14l3 8h-4l-2-5H9z" fill="#d8b047" stroke="#2a261f" stroke-width="1.4"/><rect x="7" y="18" width="18" height="14" rx="2" fill="#ead9b0" stroke="#2a261f" stroke-width="1.4" opacity=".6"/>`;
      case "raul": return `<path d="M10 15h12l-2 3H12z" fill="#5d4a3a" stroke="#2a261f" stroke-width="1.1"/><rect x="6" y="18" width="20" height="15" rx="2" fill="#5d704f" stroke="#2a261f" stroke-width="1.4" opacity=".45"/>`;
      case "carla": return `<path d="M10 12h5M17 12h5M14.5 12h2" stroke="#2a261f" stroke-width="1.3"/><path d="M24 18l3-3 3 3-5 6z" fill="#76857d" stroke="#2a261f" stroke-width="1.2"/>`;
      case "tano": return `<path d="M7 8h15v3H9l-3 2z" fill="#745446" stroke="#2a261f" stroke-width="1.4"/><path d="M23 18h8l-2 10h-8z" fill="#efe0b7" stroke="#2a261f" stroke-width="1.3"/>`;
      default: return "";
    }
  }

  function playerSpriteMarkup(player) {
    const profileId = state.socialProfiles[player.id]?.id || "store";
    return `<svg class="player-svg" viewBox="0 0 32 40" aria-hidden="true">
      <ellipse class="player-shadow" cx="16" cy="36.5" rx="9.5" ry="3.2" fill="rgba(36,42,31,.24)"/>
      <g class="player-legs">
        <rect x="10.5" y="27" width="4.8" height="8.8" rx="1" fill="#43525b" stroke="#2a261f" stroke-width="1.4"/>
        <rect x="17.5" y="27" width="4.8" height="8.8" rx="1" fill="#43525b" stroke="#2a261f" stroke-width="1.4"/>
        <rect x="9.6" y="34.5" width="6.2" height="2.8" rx="1" fill="#47382e"/>
        <rect x="17.2" y="34.5" width="6.2" height="2.8" rx="1" fill="#47382e"/>
      </g>
      <g class="player-arm arm-left"><rect x="6.2" y="17" width="4.4" height="10.5" rx="1" fill="${player.shirt}" stroke="#2a261f" stroke-width="1.3"/><rect x="6.8" y="25.4" width="3.3" height="3.4" rx="1" fill="${player.skin}" stroke="#2a261f" stroke-width="1"/></g>
      <g class="player-arm arm-right"><rect x="21.4" y="17" width="4.4" height="10.5" rx="1" fill="${player.shirt}" stroke="#2a261f" stroke-width="1.3"/><rect x="21.8" y="25.4" width="3.3" height="3.4" rx="1" fill="${player.skin}" stroke="#2a261f" stroke-width="1"/></g>
      <path class="player-torso" d="M10 15h12l2 12-2 2H10l-2-2z" fill="${player.shirt}" stroke="#2a261f" stroke-width="1.6"/>
      <path d="M12 17h8v3h-8z" fill="rgba(255,255,255,.12)"/>
      <rect x="12.5" y="11.2" width="7" height="5" rx="1" fill="${player.skin}" stroke="#2a261f" stroke-width="1.2"/>
      <path class="player-head" d="M8 7.5c0-3 3.1-5.5 8-5.5s8 2.5 8 5.5v5.3c0 4.4-3.6 8-8 8s-8-3.6-8-8z" fill="${player.skin}" stroke="#2a261f" stroke-width="1.7"/>
      <path class="player-hair" d="M8 9c.5-4.7 4.6-7 8-7 4.2 0 7.4 2 8.1 7l-2.3-1.7-2.1 1.5-2.4-1.4-2.6 1.5-2.1-1.3L10 9.9z" fill="${player.hair}" stroke="#2a261f" stroke-width="1.2"/>
      <path class="player-nuca" d="M8 7.5c0-3 3.1-5.5 8-5.5s8 2.5 8 5.5v5.3c0 4.4-3.6 8-8 8s-8-3.6-8-8z" fill="${player.hair}" stroke="#2a261f" stroke-width="1.7" opacity="0"/>
      <circle class="eye eye-left" cx="13.2" cy="13.3" r="1.1" fill="#2a261f"/>
      <circle class="eye eye-right" cx="18.8" cy="13.3" r="1.1" fill="#2a261f"/>
      <path class="mouth" d="M13 17.3c1.2 1 4.7 1 6 0" fill="none" stroke="#7a5647" stroke-width="1.1" stroke-linecap="round"/>
      ${playerAccessorySVG(player)}
      <g class="profession-prop">${professionPropSVG(profileId)}</g>
    </svg>`;
  }

  function animalSpriteMarkup(animal) {
    if (animal.species === "cat") {
      const coat = animal.variant === "gray" ? "#7e8079" : "#aa915f";
      return `<svg class="animal-svg cat-svg" viewBox="0 0 40 28" aria-hidden="true">
        <g class="animal-body">
        <ellipse cx="20" cy="23" rx="10" ry="3" fill="rgba(36,42,31,.24)"/>
        <path class="tail" d="M8 13c-4 1-6 5-5 8" fill="none" stroke="#2a261f" stroke-width="2.4" stroke-linecap="round"/>
        <path class="tail-color" d="M8 13c-4 1-6 5-5 8" fill="none" stroke="${coat}" stroke-width="1.2" stroke-linecap="round"/>
        <ellipse class="body" cx="19" cy="15" rx="11" ry="6.5" fill="${coat}" stroke="#2a261f" stroke-width="1.8"/>
        <circle class="head" cx="29" cy="12" r="5" fill="${coat}" stroke="#2a261f" stroke-width="1.8"/>
        <path d="M26 8l2-4 3 3M31 7l2-3 3 4" fill="none" stroke="#2a261f" stroke-width="1.4"/>
        <path class="legs" d="M13 20v5M18 20v5M23 20v5" stroke="#2a261f" stroke-width="1.8" stroke-linecap="round"/>
        </g>
      </svg>`;
    }
    if (animal.species === "hen") {
      const body = animal.variant === "white" ? "#e8dcc1" : animal.variant === "gold" ? "#c69342" : "#9a5b3c";
      return `<svg class="animal-svg hen-svg" viewBox="0 0 34 28" aria-hidden="true">
        <g class="animal-body">
        <ellipse cx="17" cy="23" rx="8" ry="2.4" fill="rgba(36,42,31,.22)"/>
        <ellipse class="body" cx="13.5" cy="15" rx="8.5" ry="6.7" fill="${body}" stroke="#2a261f" stroke-width="1.7"/>
        <circle class="head" cx="23.5" cy="11.5" r="4.6" fill="${body}" stroke="#2a261f" stroke-width="1.7"/>
        <path d="M26 6l1.6-2 1.7 2 .9-2.1 1.8 2.7" fill="none" stroke="#b44838" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M28.5 12.5h4" stroke="#d7a33c" stroke-width="2" stroke-linecap="round"/>
        <path class="legs" d="M11 20v4.5M16.5 20v4.5" stroke="#8d6e37" stroke-width="1.4" stroke-linecap="round"/>
        </g>
      </svg>`;
    }
    const coat = animal.variant === "tan" ? "#c78a55" : "#734e39";
    return `<svg class="animal-svg dog-svg" viewBox="0 0 44 30" aria-hidden="true">
      <g class="animal-body">
      <ellipse cx="22" cy="24" rx="11" ry="3" fill="rgba(36,42,31,.24)"/>
      <path class="tail" d="M8 11c-4-3-6-3-7-1" fill="none" stroke="#2a261f" stroke-width="2.6" stroke-linecap="round"/>
      <path class="tail-color" d="M8 11c-4-3-6-3-7-1" fill="none" stroke="${coat}" stroke-width="1.3" stroke-linecap="round"/>
      <ellipse class="body" cx="20" cy="15" rx="12" ry="7" fill="${coat}" stroke="#2a261f" stroke-width="1.8"/>
      <circle class="head" cx="31.5" cy="11.5" r="5.5" fill="${coat}" stroke="#2a261f" stroke-width="1.8"/>
      <path d="M29 6l3-4 3 5" fill="none" stroke="#2a261f" stroke-width="1.4"/>
      <path class="legs" d="M14 20v5M19 20v5M24 20v5M29 20v5" stroke="#2a261f" stroke-width="1.8" stroke-linecap="round"/>
      </g>
    </svg>`;
  }

  function renderPlayers() {
    PLAYERS.forEach(player => {
      const saved = state.campaign.positions[player.id];
      const fallback = SPAWN_POINTS[PLAYERS.indexOf(player)];
      const safe = nearestWalkable(saved?.x ?? fallback[0], saved?.y ?? fallback[1]);
      state.movement.positions[player.id] = { x: safe[0], y: safe[1] };
    });
    els.playersLayer.innerHTML = PLAYERS.map(player => `
      <div class="walker${player.human ? " is-human" : ""}" data-player="${player.id}" data-detail="${player.detail}" style="left:${state.movement.positions[player.id].x}px;top:${state.movement.positions[player.id].y}px">
        <div class="speech-bubble"></div>
        <button class="profile-peek" type="button" data-profile-player="${player.id}" aria-label="Ver ficha económica de ${player.name}">$</button>
        <button class="dialogue-peek" type="button" data-dialogue-player="${player.id}" aria-label="Ver diálogos de ${player.name}" hidden>…</button>
        ${playerSpriteMarkup(player)}
        <span class="name-tag">${player.name}${player.human ? " · VOS" : ""}<small>${escapeHTML(state.socialProfiles[player.id]?.label || "vecino/a")}</small></span>
      </div>`).join("");
    updateCamera(true);
  }

  function applyWorldGeometry() {
    const geoById = {};
    WORLD_GEOMETRY.forEach(g => { geoById[g.id] = g; });
    els.villageWorld.querySelectorAll("[data-location]").forEach(node => {
      const id = node.dataset.location;
      const g = geoById[id];
      if (g && g.x !== undefined) {
        node.style.setProperty("--x", g.x + "px");
        node.style.setProperty("--y", g.y + "px");
        node.style.setProperty("--w", g.w + "px");
        node.style.setProperty("--h", g.h + "px");
      }
    });
    buildLocationPoints();
  }

  const HITBOX_W = 18, HITBOX_H = 10;

  function footprintRects() {
    const result = [];
    WORLD_GEOMETRY.forEach(g => {
      if (g.fp) result.push({ left: g.fp.x, top: g.fp.y, right: g.fp.x + g.fp.w, bottom: g.fp.y + g.fp.h });
    });
    WORLD_COLLIDERS.forEach(c => {
      result.push({ left: c.x, top: c.y, right: c.x + c.w, bottom: c.y + c.h });
    });
    return result;
  }

  function pointWalkable(x, y) {
    if (x < 28 || y < 32 || x > 1508 || y > 928) return false;
    const rects = footprintRects();
    const corners = [
      [x - HITBOX_W / 2, y - HITBOX_H],
      [x + HITBOX_W / 2, y - HITBOX_H],
      [x - HITBOX_W / 2, y],
      [x + HITBOX_W / 2, y]
    ];
    return corners.every(([cx, cy]) => !rects.some(r => cx > r.left && cx < r.right && cy > r.top && cy < r.bottom));
  }

  function nearestWalkable(x, y) {
    if (pointWalkable(x, y)) return [x, y];
    for (let radius = 32; radius <= 192; radius += 32) {
      const candidates = [[x + radius, y], [x - radius, y], [x, y + radius], [x, y - radius], [x + radius, y + radius], [x - radius, y + radius]];
      const found = candidates.find(point => pointWalkable(point[0], point[1]));
      if (found) return found;
    }
    return [...LOCATION_POINTS.plaza];
  }

  function findPath(start, end) {
    const cell = 32;
    const finish = nearestWalkable(end[0], end[1]);
    const sx = Math.round(start.x / cell), sy = Math.round(start.y / cell), ex = Math.round(finish[0] / cell), ey = Math.round(finish[1] / cell);
    const key = (x, y) => `${x},${y}`;
    const open = [{ x: sx, y: sy, g: 0, f: Math.abs(ex - sx) + Math.abs(ey - sy) }];
    const came = new Map();
    const costs = new Map([[key(sx, sy), 0]]);
    const closed = new Set();
    while (open.length) {
      open.sort((a, b) => a.f - b.f);
      const current = open.shift();
      const currentKey = key(current.x, current.y);
      if (closed.has(currentKey)) continue;
      if (current.x === ex && current.y === ey) {
        const path = [];
        let cursor = currentKey;
        while (cursor && cursor !== key(sx, sy)) {
          const [x, y] = cursor.split(",").map(Number);
          path.unshift({ x: x * cell, y: y * cell });
          cursor = came.get(cursor);
        }
        path.push({ x: finish[0], y: finish[1] });
        return { ok: true, path };
      }
      closed.add(currentKey);
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx, dy]) => {
        const nx = current.x + dx, ny = current.y + dy;
        const worldX = nx * cell, worldY = ny * cell;
        const nextKey = key(nx, ny);
        if ((!pointWalkable(worldX, worldY) && nextKey !== key(ex, ey)) || closed.has(nextKey)) return;
        const nextCost = current.g + 1;
        if (nextCost >= (costs.get(nextKey) ?? Infinity)) return;
        costs.set(nextKey, nextCost);
        came.set(nextKey, currentKey);
        open.push({ x: nx, y: ny, g: nextCost, f: nextCost + Math.abs(ex - nx) + Math.abs(ey - ny) });
      });
    }
    return { ok: false, path: [] };
  }

  function cleanLocation(value) {
    const text = String(value || "plaza").toLowerCase().trim().replace(/^(el|la|los|las)\s+/, "");
    const match = Object.keys(LOCATION_POINTS).find(key => text === key || text.includes(key) || key.includes(text));
    return match || "plaza";
  }

  function locationPoint(value) { return LOCATION_POINTS[cleanLocation(value)] || LOCATION_POINTS.plaza; }

  function travelToLocation(location, callback, label = "DESTINO") {
    const point = locationPoint(location);
    if (QA_MODE) {
      state.movement.positions.nico = { x: point[0], y: point[1] };
      paintWalker("nico", 0, 1, false);
      updateCamera(true);
      stopTimer();
      window.setTimeout(callback, 20);
      return;
    }
    state.movement.objective = { location: cleanLocation(location), x: point[0], y: point[1], label };
    state.movement.arrivalCallback = callback;
    els.objectiveMarker.hidden = false;
    els.objectiveMarker.style.left = `${point[0] - 17}px`;
    els.objectiveMarker.style.top = `${point[1] - 44}px`;
    els.interactionPrompt.hidden = true;
    state.movement.path = [];
    stopTimer();
    if (!state.dayTimerId) { state.timer = 0; paintTimer(); }
    els.actionCards.querySelectorAll("button").forEach(button => { button.disabled = true; });
    toast(`${label}. Caminá hasta ${cleanLocation(location)}.`);
    els.villageMap.focus({ preventScroll: true });
  }

  function setDestination(point) {
    const position = state.movement.positions.nico;
    const result = findPath(position, point);
    state.movement.path = result.ok ? result.path : [];
    if (!result.ok && result.path.length === 0) toast("No se puede llegar ahí.");
  }

  function botRouteId(playerId, purpose, location, stableKey) {
    if (stableKey) return `${state.episodeToken}:${playerId}:${purpose}:${stableKey}`;
    botRouteSequence += 1;
    return `${state.episodeToken}:${state.roundNumber}:${playerId}:${purpose}:${cleanLocation(location)}:${botRouteSequence}`;
  }

  function enqueueBotRoute(playerId, location, { purpose = "agenda", note = "", callback = null, priority, stableKey = null } = {}) {
    const position = state.movement.positions[playerId];
    if (!position) return null;
    const prio = priority !== undefined ? priority : (ROUTE_PRIORITY[purpose] || 40);
    const id = botRouteId(playerId, purpose, location, stableKey);
    const queue = state.movement.botRouteQueues[playerId] || (state.movement.botRouteQueues[playerId] = []);
    if (queue.some(job => job.id === id) || state.movement.activeBotRoute[playerId]?.id === id) return null;
    const pathResult = findPath(position, locationPoint(location));
    const job = {
      id, playerId, location: cleanLocation(location),
      path: pathResult.ok ? pathResult.path : [],
      purpose, priority: prio, createdAt: Date.now(),
      episodeToken: state.episodeToken, round: state.roundNumber,
      status: "queued", callbackKey: callback ? id : null
    };
    if (callback) botRouteCallbacks.set(id, callback);
    const active = state.movement.activeBotRoute[playerId];
    if (active && prio > active.priority) {
      active.status = "queued";
      queue.push(active);
      delete state.movement.activeBotRoute[playerId];
    }
    queue.push(job);
    queue.sort((a, b) => b.priority - a.priority || a.createdAt - b.createdAt);
    if (!state.movement.activeBotRoute[playerId]) startNextBotRoute(playerId);
    return id;
  }

  function startNextBotRoute(playerId) {
    const queue = state.movement.botRouteQueues[playerId];
    if (!queue || !queue.length) {
      delete state.movement.activeBotRoute[playerId];
      return;
    }
    const job = queue.shift();
    if (job.episodeToken !== state.episodeToken) return startNextBotRoute(playerId);
    job.status = "active";
    state.movement.activeBotRoute[playerId] = job;
  }

  function cancelBotRoutes(playerId, opts = {}) {
    const queue = state.movement.botRouteQueues[playerId];
    if (queue) {
      const removed = opts.purpose ? queue.filter(job => job.purpose === opts.purpose) : [...queue];
      removed.forEach(job => botRouteCallbacks.delete(job.callbackKey));
      const filtered = opts.purpose ? queue.filter(job => job.purpose !== opts.purpose) : [];
      state.movement.botRouteQueues[playerId] = filtered;
    }
    const active = state.movement.activeBotRoute[playerId];
    if (active && (!opts.purpose || active.purpose === opts.purpose)) {
      botRouteCallbacks.delete(active.callbackKey);
      delete state.movement.activeBotRoute[playerId];
      startNextBotRoute(playerId);
    }
  }

  function stepPath(playerId, path, speed, delta) {
    const position = state.movement.positions[playerId];
    const target = path[0];
    if (!position || !target) return true;
    if (!pointWalkable(target.x, target.y)) {
      if (playerId === "nico") {
        const start = { x: position.x, y: position.y };
        const result = findPath(start, { x: target.x, y: target.y });
        if (result.ok) { path.length = 0; result.path.forEach(p => path.push(p)); }
        else { path.length = 0; return true; }
      } else {
        path.length = 0;
        return true;
      }
    }
    const dx = target.x - position.x, dy = target.y - position.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= speed * delta) { position.x = target.x; position.y = target.y; path.shift(); }
    else { position.x += dx / distance * speed * delta; position.y += dy / distance * speed * delta; }
    paintWalker(playerId, dx, dy, true);
    return path.length === 0;
  }

  function paintWalker(playerId, dx = 0, dy = 0, walking = false) {
    const position = state.movement.positions[playerId];
    const walker = els.playersLayer.querySelector(`[data-player="${playerId}"]`);
    if (!position || !walker) return;
    walker.style.left = `${position.x}px`; walker.style.top = `${position.y}px`;
    walker.style.zIndex = ENTITY_BASE + Math.floor(position.y);
    walker.classList.toggle("is-walking", walking);
    if (Math.abs(dx) > Math.abs(dy)) walker.classList.toggle("facing-left", dx < 0);
    walker.dataset.direction = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : (dy < 0 ? "up" : "down");
  }

  function moveHumanByKeys(delta) {
    const keys = state.movement.keys;
    let dx = 0, dy = 0;
    if (keys.has("left")) dx -= 1; if (keys.has("right")) dx += 1; if (keys.has("up")) dy -= 1; if (keys.has("down")) dy += 1;
    if (!dx && !dy) return false;
    state.movement.path = [];
    const length = Math.hypot(dx, dy) || 1;
    const position = state.movement.positions.nico;
    const next = { x: position.x + dx / length * 170 * delta, y: position.y + dy / length * 170 * delta };
    if (pointWalkable(next.x, position.y)) position.x = next.x;
    if (pointWalkable(position.x, next.y)) position.y = next.y;
    paintWalker("nico", dx, dy, true);
    return true;
  }

  function updateMovement(time) {
    const delta = Math.min(.05, ((time - state.movement.lastTime) || 16) / 1000);
    state.movement.lastTime = time;
    const blocked = [els.roleDialog, els.missionDialog, els.meetingDialog, els.alibiDialog, els.judgmentDialog, els.resultDialog, els.payoutDialog, els.profileDialog, els.atmDialog].some(dialog => dialog?.open);
    if (!blocked) {
      const keyed = moveHumanByKeys(delta);
      if (!keyed && state.movement.path.length) stepPath("nico", state.movement.path, 170, delta);
      if (!keyed && !state.movement.path.length) paintWalker("nico", 0, 0, false);
      Object.entries(state.movement.activeBotRoute).forEach(([playerId, job]) => {
        if (!job || job.episodeToken !== state.episodeToken) {
          delete state.movement.activeBotRoute[playerId];
          startNextBotRoute(playerId);
          return;
        }
        const done = stepPath(playerId, job.path, BOT_MOVE_SPEED, delta);
        if (done) {
          recordVisit(playerId, job.location, job.note || `Pasó por ${job.location}`);
          delete state.movement.activeBotRoute[playerId];
          paintWalker(playerId, 0, 0, false);
          const callback = job.callbackKey ? botRouteCallbacks.get(job.callbackKey) : null;
          if (job.callbackKey) botRouteCallbacks.delete(job.callbackKey);
          if (callback) callback();
          startNextBotRoute(playerId);
        }
      });
      checkArrival();
    }
    if (time - state.lastDinnerGateRefresh >= 250) {
      state.lastDinnerGateRefresh = time;
      refreshDinnerGate("tick");
    }
    updateCamera();
    applyEntityOffsets();
    updateProximityVisuals();
    updateAnimals(time);
    state.movement.rafId = requestAnimationFrame(updateMovement);
  }

  function applyEntityOffsets() {
    const ENTITY_PROXIMITY = 20;
    const OFFSET_DISTANCE = 16;
    const walkers = PLAYERS.map(p => ({
      id: p.id,
      node: els.playersLayer.querySelector(`[data-player="${p.id}"]`),
      pos: state.movement.positions[p.id]
    })).filter(w => w.node && w.pos);
    const offsets = walkers.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < walkers.length; i++) {
      for (let j = i + 1; j < walkers.length; j++) {
        const a = walkers[i], b = walkers[j];
        const dx = a.pos.x - b.pos.x, dy = a.pos.y - b.pos.y;
        const dist = Math.hypot(dx, dy);
        if (dist < ENTITY_PROXIMITY) {
          const angle = dist > 1 ? null : ((i * 7 + j * 3) % 8) * (Math.PI / 4);
          const nx = dist > 1 ? -dy / dist : Math.cos(angle);
          const ny = dist > 1 ? dx / dist : Math.sin(angle);
          offsets[i].x += nx * OFFSET_DISTANCE;
          offsets[i].y += ny * OFFSET_DISTANCE;
          offsets[j].x -= nx * OFFSET_DISTANCE;
          offsets[j].y -= ny * OFFSET_DISTANCE;
        }
      }
    }
    walkers.forEach((walker, index) => {
      const offset = offsets[index];
      const length = Math.hypot(offset.x, offset.y);
      const scale = length > 24 ? 24 / length : 1;
      walker.node.style.setProperty("--ox", `${offset.x * scale}px`);
      walker.node.style.setProperty("--oy", `${offset.y * scale}px`);
    });
  }

  function updateProximityVisuals() {
    const human = state.movement.positions.nico;
    if (!human) return;
    PLAYERS.forEach(player => {
      const node = els.playersLayer.querySelector(`[data-player="${player.id}"]`);
      const position = state.movement.positions[player.id];
      if (!node || !position) return;
      const close = player.id === "nico" || Math.hypot(position.x - human.x, position.y - human.y) < 150;
      node.classList.toggle("near-human", close);
    });
    if (state.activeCounterpart?.playerId && state.activeCounterpart.playerId !== "nico") {
      const counterpartPos = state.movement.positions[state.activeCounterpart.playerId];
      if (counterpartPos && Math.hypot(counterpartPos.x - human.x, counterpartPos.y - human.y) > 74) {
        els.interactionPrompt.hidden = true;
      } else if (state.activeCounterpart.available && state.activeCounterpart.kind !== "atm") {
        els.interactionPrompt.hidden = false;
      }
    }
    updateDirtyShoeReactions(human);
  }

  function initAnimals() {
    state.lastAnimalTextTime = 0;
    const specs = [
      ["dog", "Moro", 705, 620, "dark"], ["dog", "Pipa", 250, 650, "tan"], ["cat", "Michi", 1230, 610, "gray"],
      ["hen", "Pepa", 180, 860, "white"], ["hen", "Tota", 220, 875, "brown"], ["hen", "Rita", 260, 850, "gold"]
    ];
    const now = performance.now();
    state.animals = specs.map(([species, name, x, y, variant], index) => ({
      id: `animal-${index}`, species, name, x, y, variant, tx: x, ty: y, action: "idle", frame: 0,
      nextAction: now + 900 + random() * 2200, lastMovedAt: now, stationaryTurns: 0, lastResidueAt: 0,
      path: [], pathIndex: 0, lastDx: 1
    }));
    els.animalsLayer.innerHTML = state.animals.map(animal => `<div class="world-animal ${animal.species} ${animal.variant}" data-animal="${animal.id}" style="left:${animal.x}px;top:${animal.y}px">${animalSpriteMarkup(animal)}<em class="animal-sound" aria-hidden="true"></em></div>`).join("");
  }

  function updateAnimals(time) {
    if (!state.animals.length || time - state.lastAnimalTick < 90) return;
    const delta = Math.min(.18, (time - state.lastAnimalTick) / 1000 || .09);
    state.lastAnimalTick = time;
    state.animals.forEach(animal => {
      if (time >= animal.nextAction) chooseAnimalAction(animal, time);
      if (["walk", "chase", "flee"].includes(animal.action)) {
        if (animal.path && animal.pathIndex < animal.path.length) {
          const target = animal.path[animal.pathIndex];
          const dx = target.x - animal.x, dy = target.y - animal.y, dist = Math.hypot(dx, dy);
          if (dist <= 4) {
            animal.pathIndex++;
          } else {
            const speed = animal.action === "flee" ? 48 : animal.action === "chase" ? 54 : animal.species === "hen" ? 28 : animal.species === "cat" ? 38 : 44;
            animal.x += dx / dist * speed * delta; animal.y += dy / dist * speed * delta;
            animal.lastDx = dx; animal.frame = (animal.frame + 1) % 4;
            animal.lastMovedAt = time;
          }
        } else {
          animal.nextAction = Math.min(animal.nextAction, time + 250);
        }
      }
      const node = els.animalsLayer.querySelector(`[data-animal="${animal.id}"]`);
      if (node) {
        const facingLeft = animal.lastDx < -1;
        node.style.left = `${animal.x}px`; node.style.top = `${animal.y}px`;
        node.dataset.frame = String(Math.floor(animal.frame));
        node.className = `world-animal ${animal.species} ${animal.variant} action-${animal.action}${facingLeft ? " facing-left" : ""}`;
      }
    });
    if (time % 900 < 100) checkResidueSteps();
  }

  function chooseAnimalAction(animal, time) {
    const nearbyDog = animal.species === "hen" && state.animals.find(item => item.species === "dog" && Math.hypot(item.x - animal.x, item.y - animal.y) < 95);
    const mustWalk = animal.species === "hen" && (time - animal.lastMovedAt > 5200 || animal.stationaryTurns >= 1);
    const actions = animal.species === "hen" ? ["walk", "walk", "walk", "peck", "peck", "flutter"] : animal.species === "cat" ? ["walk", "walk", "sit", "stretch", "sleep", "meow"] : ["walk", "walk", "sniff", "jump", "bark", "chase", "pee", "poop", "idle"];
    animal.action = nearbyDog ? "flee" : mustWalk ? "walk" : actions[Math.floor(random() * actions.length)];
    if (["walk", "flee"].includes(animal.action)) {
      const preferred = animal.species === "hen" ? [[160,820],[260,760],[840,610],[1300,820]] : [[700,610],[850,660],[330,620],[1120,600],[1400,620]];
      const target = animal.action === "flee" && nearbyDog
        ? [animal.x + Math.sign(animal.x - nearbyDog.x || 1) * 130, animal.y + Math.sign(animal.y - nearbyDog.y || 1) * 90]
        : preferred[Math.floor(random() * preferred.length)];
      const safe = nearestWalkable(target[0] + (random() - .5) * 100, target[1] + (random() - .5) * 80);
      animal.tx = safe[0]; animal.ty = safe[1];
      const pathResult = findPath({ x: animal.x, y: animal.y }, [animal.tx, animal.ty]);
      if (pathResult.ok && pathResult.path.length > 1) {
        animal.path = pathResult.path; animal.pathIndex = 0;
        animal.lastDx = pathResult.path[0].x - animal.x || 1;
      } else {
        animal.action = "peck";
      }
    }
    if (animal.action === "chase") {
      const hen = state.animals.filter(item => item.species === "hen").sort((a, b) => Math.hypot(a.x - animal.x, a.y - animal.y) - Math.hypot(b.x - animal.x, b.y - animal.y))[0];
      if (hen) { animal.tx = hen.x; animal.ty = hen.y; }
      else animal.action = "sniff";
    }
    animal.stationaryTurns = ["walk", "flee", "chase"].includes(animal.action) ? 0 : animal.stationaryTurns + 1;
    if ((animal.action === "poop" || animal.action === "pee") && time - animal.lastResidueAt > 18000) {
      createResidue(animal, animal.action);
      animal.lastResidueAt = time;
    }
    if (["bark", "meow"].includes(animal.action) && time - state.lastAnimalTextTime > 12000) {
      showAnimalSound(animal, animal.action === "bark" ? "¡guau!" : "¡miau!");
      state.lastAnimalTextTime = time;
    }
    animal.nextAction = time + (animal.species === "hen" ? 3000 + random() * 4000 : 5000 + random() * 7000);
    state.transport.send("animal:acted", { animalId: animal.id, species: animal.species, action: animal.action, x: Math.round(animal.x), y: Math.round(animal.y) });
  }

  function showAnimalSound(animal, text) {
    const node = els.animalsLayer.querySelector(`[data-animal="${animal.id}"] em`);
    if (!node) return;
    window.clearTimeout(node.soundTimer);
    node.textContent = text;
    node.classList.add("show");
    node.soundTimer = window.setTimeout(() => {
      node.classList.remove("show");
      node.textContent = "";
    }, 1200);
  }

  function createResidue(animal, type) {
    const residue = { id: makeId("residue"), type, x: animal.x, y: animal.y, createdAt: Date.now(), steppedBy: [] };
    state.residues.push(residue);
    els.residueLayer.insertAdjacentHTML("beforeend", `<i class="world-residue ${type}" data-residue="${residue.id}" style="left:${residue.x}px;top:${residue.y}px"></i>`);
    state.transport.send("world:residue-created", { id: residue.id, type, x: Math.round(residue.x), y: Math.round(residue.y) });
    window.setTimeout(() => { state.residues = state.residues.filter(item => item.id !== residue.id); els.residueLayer.querySelector(`[data-residue="${residue.id}"]`)?.remove(); }, 90000);
  }

  function checkResidueSteps() {
    state.residues.filter(item => item.type === "poop").forEach(residue => PLAYERS.forEach(player => {
      const pos = state.movement.positions[player.id];
      if (!pos || residue.steppedBy.includes(player.id) || Math.hypot(pos.x - residue.x, pos.y - residue.y) > 20) return;
      residue.steppedBy.push(player.id);
      const walker = els.playersLayer.querySelector(`[data-player="${player.id}"]`);
      walker?.classList.add("stepped-poop");
      if (player.human) activateDirtyShoe();
      else window.setTimeout(() => walker?.classList.remove("stepped-poop"), DIRTY_SHOE_DURATION);
      state.transport.send("world:residue-stepped", { residueId: residue.id, playerId: player.id });
    }));
  }

  function activateDirtyShoe() {
    state.dirtyShoe.active = true;
    state.dirtyShoe.incidentId += 1;
    state.dirtyShoe.until = Date.now() + DIRTY_SHOE_DURATION;
    state.dirtyShoe.nearbyBots = {};
    const incidentId = state.dirtyShoe.incidentId;
    window.setTimeout(() => {
      if (state.dirtyShoe.incidentId !== incidentId) return;
      state.dirtyShoe.active = false;
      state.dirtyShoe.until = 0;
      state.dirtyShoe.nearbyBots = {};
      els.playersLayer.querySelector('[data-player="nico"]')?.classList.remove("stepped-poop");
    }, DIRTY_SHOE_DURATION);
  }

  function attemptDirtyShoeReaction(bot, roll = random()) {
    if (!bot || roll >= POOP_REACTION_CHANCE) return false;
    const line = POOP_REACTION_LINES[Math.floor(random() * POOP_REACTION_LINES.length)];
    speakAmbient(bot.id, line);
    return true;
  }

  function updateDirtyShoeReactions(human, forcedRolls = null) {
    const dirty = state.dirtyShoe;
    if (!dirty.active || Date.now() >= dirty.until) return;
    PLAYERS.filter(player => !player.human).forEach(bot => {
      const position = state.movement.positions[bot.id];
      if (!position) return;
      const distance = Math.hypot(position.x - human.x, position.y - human.y);
      const wasNear = Boolean(dirty.nearbyBots[bot.id]);
      if (!wasNear && distance <= DIRTY_SHOE_ENTER_RADIUS) {
        dirty.nearbyBots[bot.id] = true;
        attemptDirtyShoeReaction(bot, forcedRolls?.[bot.id] ?? random());
      } else if (wasNear && distance >= DIRTY_SHOE_EXIT_RADIUS) {
        dirty.nearbyBots[bot.id] = false;
      }
    });
  }

  function updateCamera(immediate = false) {
    if (!els.villageMap || !els.villageWorld || !state.movement.positions.nico) return;
    const viewportWidth = els.villageMap.clientWidth, viewportHeight = els.villageMap.clientHeight;
    const position = state.movement.positions.nico;
    const x = clamp(position.x - viewportWidth / 2, 0, 1536 - viewportWidth);
    const y = clamp(position.y - viewportHeight / 2, 0, 960 - viewportHeight);
    state.movement.camera.x = x; state.movement.camera.y = y;
    els.villageWorld.style.transition = immediate ? "none" : "transform .08s linear";
    els.villageWorld.style.transform = `translate(${-x}px,${-y}px)`;
    const nearest = Object.entries(LOCATION_POINTS).sort((a, b) => Math.hypot(position.x - a[1][0], position.y - a[1][1]) - Math.hypot(position.x - b[1][0], position.y - b[1][1]))[0];
    if (nearest) els.locationLabel.textContent = nearest[0].toUpperCase();
  }

  function checkArrival(force = false) {
    const objective = state.movement.objective;
    if (!objective) return;
    const position = state.movement.positions.nico;
    const distance = Math.hypot(position.x - objective.x, position.y - objective.y);
    els.interactionPrompt.hidden = distance > 74;
    if (distance > 48 && !force) return;
    const callback = state.movement.arrivalCallback;
    state.movement.objective = null; state.movement.arrivalCallback = null; state.movement.path = [];
    els.objectiveMarker.hidden = true; els.interactionPrompt.hidden = true;
    const agenda = state.humanAgenda;
    if (agenda) {
      const step = agenda.steps[agenda.index];
      if (step && step.status === "pending") step.status = step.counterpartId ? "waiting-counterpart" : "ready-to-interact";
    }
    if (callback) window.setTimeout(callback, 120);
  }

  function interactNearby() {
    const step = state.humanAgenda?.steps[state.humanAgenda.index];
    if (step && step.status !== "ready-to-interact" && step.status !== "waiting-counterpart") {
      if (step.status === "settling") toast("Estamos cerrando la operación. Esperá un momento.");
      else if (step.status === "done") toast("Este paso ya está completado.");
      else toast("Todavía no llegaste a tu destino.");
      return;
    }
    if (state.activeCounterpart?.interacted) return;
    if (state.activeCounterpart?.available) {
      const pending = state.activeCounterpart;
      if (pending.playerId) {
        const me = state.movement.positions.nico;
        const other = state.movement.positions[pending.playerId];
        if (!other || !me || Math.hypot(me.x - other.x, me.y - other.y) > 130) {
          toast(`${pending.counterpartName || "La contraparte"} todavía no llegó. Esperá un momento.`);
          return;
        }
      }
      state.activeCounterpart.interacted = true;
      pending.available = false;
      els.interactionPrompt.hidden = true;
      updateErrandSlip();
      if (pending.kind === "atm") {
        state.activeCounterpart = null;
        openATMForAgenda(state.humanAgenda, state.humanAgenda?.steps[state.humanAgenda.index]);
        return;
      }
      if (step) step.status = "settling";
      if (pending.onInteract) pending.onInteract();
      state.activeCounterpart = null;
      return;
    }
    if (state.movement.objective) {
      const position = state.movement.positions.nico;
      const objective = state.movement.objective;
      if (Math.hypot(position.x - objective.x, position.y - objective.y) <= 74) checkArrival(true);
      else toast(`Todavía estás lejos de ${objective.location}.`);
      return;
    }
    const position = state.movement.positions.nico;
    const nearest = Object.entries(LOCATION_POINTS).sort((a, b) => Math.hypot(position.x - a[1][0], position.y - a[1][1]) - Math.hypot(position.x - b[1][0], position.y - b[1][1]))[0];
    if (nearest && Math.hypot(position.x - nearest[1][0], position.y - nearest[1][1]) < 90) {
      if (nearest[0] === "banco") {
        openATMForAgenda(null, null);
        toast("Cajero del barrio: elegí cuánto pasar del banco al efectivo.");
        return;
      }
      recordVisit("nico", nearest[0], `Entró a ${nearest[0]}`); toast(`Quedó asentada tu visita a ${nearest[0]}.`);
    }
  }

  function recordVisit(playerId, location, note) {
    const record = roundRecord(playerId);
    if (record) {
      if (!record.visitedLocations.includes(location)) record.visitedLocations.push(location);
      record.timeline.push({ order: record.timeline.length + 1, text: note, observable: true, time: Date.now() });
      const position = state.movement.positions[playerId];
      PLAYERS.filter(player => player.id !== playerId).forEach(other => {
        const otherPosition = state.movement.positions[other.id];
        if (position && otherPosition && Math.hypot(position.x - otherPosition.x, position.y - otherPosition.y) < 105) {
          if (!record.witnesses.includes(other.id)) record.witnesses.push(other.id);
          const otherRecord = roundRecord(other.id);
          if (otherRecord && !otherRecord.witnesses.includes(playerId)) otherRecord.witnesses.push(playerId);
        }
      });
    }
    state.transport.send("movement:location-entered", { playerId, location, episodeId: state.campaign.episodeNumber, roundId: currentRound(), time: Date.now() });
  }

  function renderTasks() {
    const roundStart = Math.floor(state.scenarioIndex / 4) * 4;
    const round = Math.floor(state.scenarioIndex / 4) + 1;
    els.roundLabel.textContent = `RONDA ${round} · LIBRETA DE NICO`;
    els.tasksTitle.textContent = round === 1 ? "Cuatro movimientos" : `Vuelta ${round}`;
    els.taskList.innerHTML = state.scenarios.slice(roundStart, roundStart + 4).map((scenario, localIndex) => {
      const globalIndex = roundStart + localIndex;
      const status = globalIndex < state.completed ? "done" : globalIndex === state.scenarioIndex ? "current" : "";
      return `<li class="${status}"><span class="task-box">${globalIndex < state.completed ? "✓" : ""}</span><span><b>${scenario.actorName}</b>: ${scenario.taskText.replace(`${scenario.actorName} `, "")}</span></li>`;
    }).join("");
    const mission = roundRecord("nico")?.publicMission;
    const record = roundRecord("nico");
    if (state.humanAgenda) {
      const agenda = state.humanAgenda;
      const next = agenda.steps[agenda.index];
      els.publicMissionNote.textContent = `${agenda.mission.text} · ${agenda.index}/${agenda.steps.length} pasos${next ? ` · ahora: ${cleanLocation(next.location)}` : ""}`;
      updateErrandSlip();
    } else {
      els.publicMissionNote.textContent = mission ? `${mission.text} · ${record.missionCompleted ? "hecho" : "intento asentado"}${state.roles.nico === "Estafador" && state.selectedStrategy ? ` · plan privado: ${strategyLabel(state.selectedStrategy)}` : ""}` : "Elegí y jugá tu mandado al empezar la ronda.";
    }
  }

  function strategyLabel(value) { return ({ cover: "cobertura", prepare: "preparación", seek: "buscando oportunidad", publica: "actividad pública" })[value] || value; }

  function renderScenario() {
    let scenario = state.scenarios[state.scenarioIndex];
    const botScammer = PLAYERS.find(player => !player.human && state.roles[player.id] === "Estafador");
    if (!DEBUG_BOTS_IDLE && state.selectedMission && botScammer && roundRecord(botScammer.id, scenario.round)?.missionResolution === "pending") {
      resolveBotMission(botScammer.id, scenario.round, "informal");
      scenario = state.scenarios[state.scenarioIndex];
    }
    state.currentResolved = false;
    state.transitionPending = false;
    els.resolutionBox.hidden = true;
    els.resolutionBox.className = "resolution-box";
    els.caseNumber.textContent = `RONDA ${scenario.round + 1} · ${state.scenarioIndex % 4 + 1}/4`;
    els.casePlace.textContent = scenario.place;
    els.caseChannel.textContent = `${scenario.channel} · ${scenario.actorName.toUpperCase()} · ${formatMoney(scenario.quotePrice)}`;
    const opportunity = state.opportunityByScenario[`${scenario.round}:${scenario.id}`];
    const humanOpportunity = opportunity?.holderId === "nico"
      && ["Estafador", "Cómplice"].includes(state.roles.nico);
    const humanAccompliceOpportunity = humanOpportunity && state.roles.nico === "Cómplice";
    const interactiveHumanScene = scenario.actorId === "nico" || humanOpportunity;
    const hideForBot = scenario.actorId !== "nico" && !humanOpportunity;
    els.casePanel.hidden = hideForBot;
    els.actionsPanel.hidden = hideForBot;
    els.casePanel.classList.toggle("bot-case", hideForBot);
    els.caseTitle.textContent = scenario.title;
    els.caseText.textContent = interactiveHumanScene
      ? scenario.text
      : `${scenario.actorName} resuelve su operación por su cuenta. Acercate al mapa si querés escuchar; la radio sólo resume el movimiento.`;
    els.clueStrip.innerHTML = interactiveHumanScene ? scenario.clues.map(clue => `<span class="clue">${escapeHTML(clue)}</span>`).join("") : "";
    let actions = scenario.actions.map(item => ({ ...item }));
    if (humanOpportunity && !state.scammerFrozen) {
      const resource = state.inventories.nico.find(item => item.executionId === opportunity.resourceId);
      actions = [
        { label: `Usar ${resource.label}`, caption: resource.executionCaption, stance: "fraudExecute", resourceId: resource.executionId, line: resource.executionCaption },
        { label: "Dejar pasar", caption: "No intervenís en la operación y conservás el recurso.", stance: "consult" }
      ];
    }
    els.actionCards.classList.toggle("six-cards", humanOpportunity && actions.length > 4);
    const actionsTitle = document.getElementById("actionsTitle");
    if (actionsTitle) actionsTitle.textContent = humanOpportunity
      ? (humanAccompliceOpportunity ? "Tu encargo privado" : "Tu oportunidad privada")
      : (interactiveHumanScene ? "Lo que alcanzás a ver" : "");
    const botTask = String(scenario.taskText || "").replace(new RegExp(`^${scenario.actorName}\\s*${scenario.actorName}\\s*`), "").replace(new RegExp(`^${scenario.actorName}\\s*`), "");
    if (interactiveHumanScene) {
      els.actionCards.innerHTML = actions.map((item, index) => `
        <button class="action-card${item.stance === "fraudExecute" ? " crooked-card" : ""}" type="button" data-action="${index}" data-key="${index + 1}" disabled>
          <strong>${escapeHTML(item.label)}</strong><span>${escapeHTML(item.caption)}</span>
        </button>`).join("");
    } else {
      els.actionCards.innerHTML = `<div class="bot-observation"><span class="observation-eye" aria-hidden="true"></span><div><small>${escapeHTML(scenario.place)} · ${escapeHTML(scenario.actorName)}</small><strong>${escapeHTML(botTask)}</strong><p>La decisión es de ${escapeHTML(scenario.actorName)}. Acercate para escuchar; desde lejos sólo ves el recorrido y los objetos.</p></div><b>${escapeHTML(cleanLocation(scenarioLocation(scenario.id))).toUpperCase()}</b></div>`;
    }
    els.actionCards.querySelectorAll(".action-card").forEach(button => button.addEventListener("click", () => resolveAction(actions[Number(button.dataset.action)])));
    renderTasks();
    addSystemFeed(`Ronda ${scenario.round + 1} · historia de ${scenario.actorName}`);
    const awaitingMission = state.scenarioIndex % 4 === 0 && !state.selectedMission;
    if (awaitingMission) {
      stopTimer();
      state.dayTimer = DEBUG_DAY_SECONDS;
      paintDayClock();
    }
    else if (humanOpportunity) {
      travelToLocation(scenarioLocation(scenario.id), () => {
        els.actionCards.querySelectorAll("button").forEach(button => { button.disabled = false; });
        startTimer(); openingConversation(scenario);
      }, `OPORTUNIDAD · ${scenario.place}`);
    } else {
      els.actionCards.querySelectorAll("button").forEach(button => { button.disabled = true; });
      if (scenario.actorId === "nico") els.caseText.textContent += " La decisión pertenece a quienes están haciendo la operación; podés acercarte a escucharla.";
      moveActor(scenario, () => {
        const episodeToken = state.episodeToken;
        openingConversation(scenario);
        window.setTimeout(() => {
          if (episodeToken === state.episodeToken && state.scenarios[state.scenarioIndex] === scenario) resolveNpcScenario(scenario);
        }, NPC_DECISION_DELAY);
      });
    }
  }

  function moveActor(scenario, callback = null) {
    const destination = scenarioLocation(scenario.id);
    if (scenario.actorId !== "nico") {
      if (DEBUG_BOTS_IDLE) {
        state.debugTrace.push({ event: "story-bot-held-idle", actorId: scenario.actorId, scenarioId: scenario.id, at: Date.now() });
        addSystemFeed(`PRUEBA A/B: ${scenario.actorName} no inicia su operación.`);
        return;
      }
      if (state.selectedMission) resolveBotMission(scenario.actorId, scenario.round, "informal");
      enqueueBotRoute(scenario.actorId, destination, { purpose: "story", stableKey: `${scenario.round}:${scenario.id}:${state.scenarioIndex}`, note: `${scenario.actorName} llegó por ${scenario.title}`, callback });
    }
  }

  function resolveNpcScenario(scenario) {
    if (state.currentResolved || state.gameOver) return;
    const actor = PLAYERS.find(player => player.id === scenario.actorId);
    const cautious = state.roles[actor.id] === "Verificador" || totalBalance(actor.id) < 100000;
    const options = scenario.actions;
    const picked = scenario.isScam ? (cautious ? options.find(item => item.stance === "verify") : options.find(item => item.stance === "approve"))
      : (random() < .72 ? options.find(item => item.stance === "approve") : options.find(item => item.stance === "verify"));
    resolveAction(picked || options[0], false, true);
  }

  function scenarioLocation(id) {
    return ({ bike: "puesto de usados", fridge: "puesto de usados", bank: "banco", family: "comedor familiar", rental: "departamento", job: "oficina", qr: "almacén", phone: "plaza" })[id] || "plaza";
  }

  function openingConversation(scenario) {
    if (state.currentResolved || els.missionDialog.open || els.meetingDialog.open || els.resultDialog.open) return;
    const actorLine = scenario.isScam
      ? subtleScamLine(scenario)
      : subtleLegitLine(scenario);
    speak(scenario.actorId, actorLine, scenario.isScam ? "cover" : "claim", scenario.id);
    window.setTimeout(() => {
      if (state.currentResolved) return;
      const actorPosition = state.movement.positions[scenario.actorId];
      const commenter = PLAYERS.filter(player => player.id !== scenario.actorId && !player.human).find(player => {
        const pos = state.movement.positions[player.id];
        return actorPosition && pos && Math.hypot(actorPosition.x - pos.x, actorPosition.y - pos.y) < 145;
      });
      if (commenter) speak(commenter.id, ambiguousComment(scenario, commenter), state.roles[commenter.id] === "Cómplice" ? "deflect" : "comment", scenario.id);
    }, 1300);
  }

  function subtleScamLine(scenario) {
    const lines = {
      bike: "A mí me figura emitida. Igual, si quieren esperamos un ratito.", fridge: "No tengo cómo filmarla ahora, pero las fotos son de ayer.",
      bank: "El enlace me lo pasó alguien que trabaja ahí, por eso confío.", family: "Después llamo tranquilo; ahora necesito resolver esto.",
      rental: "La otra familia todavía no confirmó. No quiero apurarlos, pero avisen.", job: "El curso se recupera rápido; a un conocido le funcionó.",
      qr: "La cajera me dijo que hoy cambiaron el alias.", phone: "No muestro el IMEI por chat, en persona sí. Con una reserva lo guardo."
    };
    return lines[scenario.id];
  }

  function subtleLegitLine(scenario) {
    const lines = {
      bike: "Mi banco está lento. No entregues nada hasta verlo, cero problema.", fridge: "Me urge por la mudanza, pero vení a probarla antes.",
      bank: "Lo vi dentro de la app. Mejor que cada uno entre por su cuenta.", family: "Hagamos videollamada; perdí el celu, no la cara.",
      rental: "Se cayó una reserva. Si quieren, el vecino abre la cabaña.", job: "Necesitan cubrirlo ya, pero la empresa paga la capacitación.",
      qr: "Antes de pagar, comparemos el alias con el ticket.", phone: "Viajo mañana. Lo probamos hoy y me pagás ahí."
    };
    return lines[scenario.id];
  }

  function pickCommenter(actorId) {
    const pool = PLAYERS.filter(player => player.id !== actorId && !player.human);
    return pool[(state.scenarioIndex + state.meetings) % pool.length];
  }

  function ambiguousComment(scenario, commenter) {
    const comments = [
      "La urgencia sola no prueba nada. Miremos qué deja verificar.",
      "Yo no lo descartaría, pero tampoco movería plata todavía.",
      "Puede ser real. Lo que no entiendo es por qué ese canal.",
      "Hay un detalle raro, aunque el resto cierra bastante.",
      "A mí me pasó algo parecido y era legítimo. Igual revisemos."
    ];
    if (state.roles[commenter.id] === "Cómplice" && !state.accompliceFrozen && scenario.isScam) return "Tiene detalles concretos. Capaz estamos desconfiando de más.";
    if (state.roles[commenter.id] === "Verificador") return "No decidamos por el apuro: confirmemos una cosa por otro canal.";
    return comments[state.scenarioIndex % comments.length];
  }

  function resolveAction(picked, timedOut = false, autonomous = false) {
    if (state.currentResolved || state.transitionPending) return;
    const scenario = state.scenarios[state.scenarioIndex];
    state.currentResolved = true;
    state.transitionPending = true;
    stopTimer();
    els.actionCards.querySelectorAll("button").forEach(button => { button.disabled = true; });

    let fraudExecution = null;
    if (picked.stance === "fraudExecute") fraudExecution = executeFraud("nico", scenario, picked.resourceId, random() < (state.inventories.nico.find(item => item.executionId === picked.resourceId)?.improvised ? .45 : .72) ? "successful" : "blocked");
    else if (scenario.isScam) {
      const opportunity = state.opportunityByScenario[`${scenario.round}:${scenario.id}`];
      const status = picked.stance === "approve" ? "successful" : "blocked";
      fraudExecution = executeFraud(scenario.actorId, scenario, opportunity?.resourceId, status);
    }
    const outcome = scoreDecision(scenario, picked.stance, fraudExecution?.status);
    state.security = clamp(state.security + outcome.security, 0, 100);
    state.trust = clamp(state.trust + outcome.trust, 0, 100);
    state.completed += 1;
    state.progress = (state.completed % 4 || 4) * 25;
    const suspicionTarget = fraudExecution?.perpetratorId || scenario.actorId;
    state.suspicion[suspicionTarget] += outcome.suspicion;
    if (fraudExecution?.status === "successful" && fraudExecution.perpetratorId !== "nico") state.ignoredSignals.push({ title: scenario.title, signal: scenario.falseSignal });
    if (!scenario.isScam && picked.stance === "reject") {
      state.ignoredSignals.push({ title: scenario.title, signal: scenario.realSignal });
    }
    const story = {
      actorId: scenario.actorId, actorName: scenario.actorName, place: scenario.place,
      summary: picked.stance === "fraudExecute" ? `${shortStory(scenario)} Antes del cierre apareció un canal alternativo.` : `${shortStory(scenario)} ${autonomous ? `${scenario.actorName} decidió` : "Nico decidió"} “${picked.label}”.`, isScam: Boolean(fraudExecution), fraudStatus: fraudExecution?.status || "none",
      signal: picked.stance === "fraudExecute" ? picked.caption : scenario.isScam ? scenario.falseSignal : scenario.realSignal,
      scenarioId: scenario.id, round: scenario.round
    };
    state.roundStories.push(story);
    state.decisions.push({ ...story, action: picked.label, stance: picked.stance });
    const decisionRecord = roundRecord(autonomous ? scenario.actorId : "nico", scenario.round);
    if (decisionRecord) {
      decisionRecord.completedTransactions.push(`${picked.label} · ${scenario.title}`);
      decisionRecord.timeline.push({ order: decisionRecord.timeline.length + 1, text: `${picked.label} en ${scenario.place.toLowerCase()}` });
    }
    updateMeters();
    renderTasks();

    els.resolutionTitle.textContent = timedOut ? "El reloj eligió por vos." : outcome.title;
    els.resolutionText.textContent = timedOut
      ? "Quedó asentada la opción más impulsiva. La verdad de esta historia se revisa recién en la mesa."
      : outcome.feedback;
    els.resolutionBox.className = `resolution-box ${outcome.tone}`;
    els.resolutionBox.hidden = false;
    const endRound = state.completed % 4 === 0;
    els.continueButton.textContent = endRound ? "VOLVER AL BARRIO →" : "ESCUCHAR OTRA HISTORIA →";
    const reaction = reactionAfter(picked.stance, scenario);
    window.setTimeout(() => speak(reaction.id, reaction.text), 280);
    if (picked.stance === "fraudExecute" && picked.line) {
      window.setTimeout(() => speak("nico", picked.line, "fraud-executed", scenario.id), 850);
    }
    if (endRound) prepareMeeting();
    state.transport.send("decision:made", { playerId: autonomous ? scenario.actorId : "nico", scenarioId: scenario.id, action: picked.label, stance: picked.stance });
    if (autonomous) {
      els.continueButton.disabled = true;
      window.setTimeout(() => {
        if (state.gameOver || els.meetingDialog.open) return;
        els.continueButton.disabled = false;
        state.transitionPending = false;
        if (endRound) {
          els.resolutionBox.hidden = true;
          const gate = dinnerGateStatus();
          toast(gate.ready
            ? "El barrio terminó. Podés ir a comer cuando quieras."
            : gate.available
              ? "El barrio terminó. Cerrá tu mandado y después decidís cuándo ir a comer."
              : "Los movimientos terminaron. El barrio sigue cerrando sus mandados.");
        } else nextStep();
      }, NPC_CONTINUE_DELAY);
    } else {
      els.continueButton.disabled = false;
      state.transitionPending = false;
    }
  }

  function executeFraud(perpetratorId, scenario, resourceId, status) {
    const resource = PLAYERS.flatMap(player => state.inventories[player.id]).find(item => item.executionId === resourceId);
    if (!resource) return null;
    const victimId = perpetratorId === "nico" ? scenario.actorId : "nico";
    const possibleAmount = Math.min(SCENARIO_AMOUNTS[scenario.id] || 30000, totalBalance(victimId));
    if (status === "successful" && possibleAmount <= 0) status = "blocked";
    resource.status = "used";
    const execution = { executionId: resource.executionId, resourceType: resource.type, resourceLabel: resource.label, perpetratorId, victimId,
      scenarioId: scenario.id, story: scenario.title, round: scenario.round, episodeId: state.campaign.episodeNumber, status, amount: status === "successful" ? possibleAmount : 0,
      transitions: ["attempted", status], attemptedAt: Date.now(), method: resource.executionCaption, evidence: resource.evidenceCreated, dealId: resource.dealId || null };
    if (execution.amount) transferMoney(victimId, perpetratorId, execution.amount, `Operación de ${scenario.title}`, false, "bank", true);
    state.fraudExecutions.push(execution);
    roundRecord(perpetratorId, scenario.round)?.frauds.push(execution);
    state.fraudOccurred = true;
    state.scamAttempts += 1;
    if (status === "successful") { state.scamScore += 1; state.fraudProgress += 1; }
    state.transport.send("fraud:attempted", execution);
    state.transport.send(status === "successful" ? "fraud:succeeded" : "fraud:blocked", execution);
    if (resource.dealId) window.setTimeout(() => resolveDelegatedPayout(execution, resource), 500);
    saveCampaign();
    renderInventory();
    return execution;
  }

  function recordDealDialogueOnce(deal, key, player, text, intent) {
    deal.dialogueKeys ||= [];
    if (deal.dialogueKeys.includes(key)) return false;
    deal.dialogueKeys.push(key);
    recordDialogue(player, text, intent, state.scenarios[state.scenarioIndex]?.id);
    return true;
  }

  function resolveDelegatedPayout(execution, resource) {
    const deal = state.accompliceDeals.find(item => item.id === resource.dealId);
    if (!deal || !deal.accompliceId || ["scheduled", "active", "complete"].includes(deal.encounterState)) return;
    deal.encounterState = "scheduled";
    deal.gross = execution.amount;
    const holderId = deal.holderId || execution.perpetratorId;
    const otherHuman = deal.scammerId === "nico" || deal.accompliceId === "nico";
    const meetingLabel = execution.amount ? "ENCUENTRO · HABLAR EL REPARTO" : "ENCUENTRO · EXPLICAR QUÉ PASÓ";
    const begin = () => {
      if (deal.encounterState !== "scheduled") return;
      deal.encounterState = "active";
      startAccompliceEncounter(deal, execution, resource);
    };
    if (execution.amount > 0) {
      if (holderId === "nico") {
        state.delegatedPayoutRequirement = { dealId: deal.id, amount: execution.amount, requiredCash: Math.max(0, execution.amount - state.campaign.economy.nico.cash), withdrawn: 0, status: "pending", begin, counterpartId: deal.scammerId === "nico" ? deal.accompliceId : deal.scammerId };
        travelToLocation("banco", () => {
          els.interactionPrompt.textContent = "APRETÁ E PARA RETIRAR EL EFECTIVO DEL ARREGLO";
          els.interactionPrompt.hidden = false;
          state.activeCounterpart = { playerId: null, counterpartName: "cajero", available: true, interacted: false, kind: "atm" };
          toast("Necesitás retirar efectivo para el encuentro con el Cómplice.");
        }, "BANCO · RETIRAR EL EFECTIVO");
        return;
      }
      enqueueBotRoute(holderId, "banco", { purpose: "settlement", stableKey: `${deal.id}:bank`, note: "Retiró efectivo después de la maniobra", callback: () => {
        withdrawCash(holderId, execution.amount, "Retiro posterior a una maniobra");
        enqueueBotRoute(holderId, "plaza", { purpose: "settlement", stableKey: `${deal.id}:meeting`, note: "Fue a encontrarse con su contraparte" });
        if (otherHuman) travelToLocation("plaza", begin, meetingLabel);
        else window.setTimeout(begin, 1200);
      } });
      return;
    }
    if (otherHuman) travelToLocation("plaza", begin, meetingLabel);
    else window.setTimeout(begin, 600);
  }

  function encounterExplanationChoices(deal, resource) {
    const record = roundRecord(deal.scammerId, deal.round);
    const missionText = record?.publicMission?.text || "el mandado";
    const place = cleanLocation(record?.publicMission?.location || "plaza");
    return [
      { id: "mission-cost", text: `Entre ${missionText.toLowerCase()} y mover ${resource.label.toLowerCase()} hoy quedé muy justo.` },
      { id: "bank-cost", text: `Tuve que pasar por ${place} y cubrir gastos para que esto no quede regalado.` },
      { id: "next-round", text: `La guardé para preparar la próxima vuelta. Quedate atento y no la quemes.` },
      { id: "still-unclear", text: "Todavía no sé cuánto quedó limpio; primero tengo que ordenar los comprobantes." },
      { id: "plan-fell", text: "Se cayó la idea que tenía y tuve que volver a poner la plata en el mandado." },
      { id: "material-first", text: `Estoy preparando algo con ${resource.label.toLowerCase()}; si lo reparto ahora, perdemos la próxima oportunidad.` }
    ];
  }

  function chooseBotShare(deal, execution) {
    if (!execution.amount) return 0;
    if (deal.delegated && totalBalance(deal.accompliceId) < 100000) return .35;
    if ((state.motivations[deal.accompliceId] || "").includes("alquiler")) return .35;
    if (relationship(deal.scammerId, deal.accompliceId) > 2) return .2;
    return random() < .18 ? 0 : random() < .52 ? .2 : random() < .82 ? .35 : .5;
  }

  function makeBotScammerReport(deal, execution, resource) {
    const explanations = encounterExplanationChoices(deal, resource);
    let reportedAmount = execution.amount;
    let declaration = "full";
    if (!execution.amount) declaration = "zero";
    else if (random() < .2) {
      declaration = "low";
      reportedAmount = Math.max(0, Math.round(execution.amount * .6 / 1000) * 1000);
    } else if (!deal.delegated && random() < .16) {
      declaration = "reserve";
      reportedAmount = 0;
    }
    const explanation = explanations[Math.floor(random() * explanations.length)];
    return {
      declaration,
      reportedAmount,
      explanationId: explanation.id,
      explanationText: explanation.text,
      offeredShare: reportedAmount > 0 ? chooseBotShare(deal, execution) : 0,
      truthfulness: reportedAmount === execution.amount ? "truth" : reportedAmount === 0 ? "hidden" : "partial"
    };
  }

  function startAccompliceEncounter(deal, execution, resource) {
    const holderIsScammer = deal.holderId === deal.scammerId;
    if (holderIsScammer) {
      if (deal.scammerId === "nico") {
        openScammerEncounter(deal, execution, resource);
        return;
      }
      if (deal.accompliceId === "nico") {
        openHumanAccompliceEncounter(deal, execution, resource, makeBotScammerReport(deal, execution, resource));
        return;
      }
      const report = makeBotScammerReport(deal, execution, resource);
      applyBotScammerReport(deal, report);
      return;
    }
    deal.offeredShare = chooseBotShare(deal, execution);
    deal.expected = Math.round(execution.amount * (1 - deal.offeredShare));
    if (deal.accompliceId === "nico" && deal.holderId === "nico") {
      openHumanHolderPayout(deal, execution);
      return;
    }
    if (deal.scammerId === "nico") {
      openScammerShareRequest(deal, execution);
      return;
    }
    settleDeal(deal, chooseAccompliceBehavior(deal));
  }

  function openScammerEncounter(deal, execution, resource) {
    state.pendingEncounter = { deal, execution, resource, stage: "declare", explanationChoices: encounterExplanationChoices(deal, resource) };
    const accomplice = PLAYERS.find(player => player.id === deal.accompliceId);
    els.payoutKicker.textContent = "ENCUENTRO OBLIGATORIO";
    els.payoutTitle.textContent = `${accomplice?.name || "El Cómplice"} te espera para saber qué pasó`;
    els.payoutText.textContent = execution.amount ? "Tenés la plata encima. Podés contar la verdad, achicarla, decir que no entró nada o guardarla para la próxima vuelta." : "La maniobra no dejó plata, pero igual tenés que dar una explicación coherente.";
    const buttons = execution.amount
      ? [
        ["full", "Entraron todos los pesos", `Contás ${formatMoney(execution.amount)} y después definís cuánto soltás.`],
        ["low", "Entró poco; cubrí costos", "Bajás lo declarado sin negar del todo la maniobra."],
        ["zero", "No entró nada", "Cortás en cero y bancás la desconfianza."],
        ["reserve", "Lo guardo para la próxima", "No pagás ahora y justificás que reservás la plata."]
      ]
      : [
        ["zero", "No entró nada", "La maniobra se cayó y no hubo plata para repartir."],
        ["reserve", "Quedó para la próxima", "Decís que sólo preparaste el terreno y no soltás nada."]
      ];
    els.payoutChoices.innerHTML = buttons.map(([id, title, text]) => `<button type="button" data-encounter-declare="${id}"><strong>${title}</strong><span>${text}</span></button>`).join("");
    els.payoutDialog.showModal();
  }

  function openScammerShareRequest(deal, execution) {
    state.pendingEncounter = { deal, execution, resource: null, stage: "share" };
    const accomplice = PLAYERS.find(player => player.id === deal.accompliceId);
    els.payoutKicker.textContent = "ARREGLO EN LA PLAZA";
    els.payoutTitle.textContent = `${accomplice?.name || "El Cómplice"} quedó con la plata`;
    els.payoutText.textContent = `Entraron ${formatMoney(execution.amount)}. Recién ahora decidís qué parte, si alguna, le reconocés al Cómplice.`;
    els.payoutChoices.innerHTML = [0, .2, .35, .5].map(value => `<button type="button" data-encounter-share="${value}"><strong>${Math.round(value * 100)}%</strong><span>${value ? `${formatMoney(Math.round(execution.amount * value))} para el Cómplice.` : "Te quedás con todo."}</span></button>`).join("");
    els.payoutDialog.showModal();
  }

  function openHumanAccompliceEncounter(deal, execution, resource, report) {
    state.pendingPayout = { mode: "accomplice-hearing", execution, deal, resource, report };
    els.payoutKicker.textContent = "ARREGLO ENTRE DOS";
    els.payoutTitle.textContent = `${PLAYERS.find(player => player.id === deal.scammerId)?.name || "El Estafador"} te da su versión`;
    els.payoutText.textContent = report.reportedAmount
      ? `Dice que entraron ${formatMoney(report.reportedAmount)} y que te corresponde ${Math.round(report.offeredShare * 100)}%. ${report.explanationText}`
      : `Dice que no te toca plata por ahora. ${report.explanationText}`;
    els.payoutChoices.innerHTML = `<button type="button" data-payout="accept"><strong>Aceptar</strong><span>Escuchás, cobrás si corresponde y seguís.</span></button><button type="button" data-payout="press"><strong>Pedir más detalles</strong><span>Le marcás que la historia no te cierra del todo.</span></button><button type="button" data-payout="watch"><strong>Quedarte atento</strong><span>No peleás ahora, pero guardás la escena.</span></button><button type="button" data-payout="silence"><strong>Callarte</strong><span>No cobrás nada más ni dejás ruido.</span></button>`;
    els.payoutDialog.showModal();
  }

  function openHumanHolderPayout(deal, execution) {
    state.pendingPayout = { mode: "holder", execution, deal };
    els.payoutKicker.textContent = "TE QUEDÓ LA PLATA";
    els.payoutTitle.textContent = `${PLAYERS.find(player => player.id === deal.scammerId)?.name || "El Estafador"} vino a cobrar`;
    els.payoutText.textContent = `Entraron ${formatMoney(execution.amount)}. Te dijo que esta vez te deja ${Math.round((deal.offeredShare || 0) * 100)}% y espera ${formatMoney(deal.expected)}.`;
    els.payoutChoices.innerHTML = `<button type="button" data-payout="comply"><strong>Cumplir</strong><span>Mandar ${formatMoney(deal.expected)}.</span></button><button type="button" data-payout="skim"><strong>Recortar un poco</strong><span>Te guardás una parte y bancás el riesgo.</span></button><button type="button" data-payout="keep"><strong>Quedarte con todo</strong><span>No mandás un peso.</span></button>`;
    els.payoutDialog.showModal();
  }

  function withdrawCash(playerId, amount, label) {
    const account = state.campaign.economy[playerId];
    const moved = Math.min(account.bank, amount);
    const bankBefore = account.bank, cashBefore = account.cash;
    account.bank -= moved; account.cash += moved;
    const cashRequired = state.missionAtmRequirement?.requiredCash || state.delegatedPayoutRequirement?.requiredCash || 0;
    const transaction = recordTransaction({ fromId: playerId, toId: playerId, amount: moved, channel: "cash", label, visibleLabel: "Retiro de efectivo", legitimate: true, bankBefore, cashBefore, bankAfter: account.bank, cashAfter: account.cash, cashWithdrawn: moved, cashRequired, discoveryRisk: 0 });
    state.transport.send("bank:cash-withdrawn", { transactionId: transaction.id, playerId, amount: moved, round: currentRound() });
    return moved;
  }

  function openATMForAgenda(agenda, step) {
    state.atmUI.open = true;
    const payout = !agenda ? state.delegatedPayoutRequirement : null;
    if (agenda) {
      const existing = state.missionAtmRequirement;
      state.missionAtmRequirement = {
        ...(existing || {}),
        agendaId: existing?.agendaId || `${state.campaign.episodeNumber}:${agenda.round}:${agenda.mission.id}`,
        stepId: step.stableId,
        targetCash: existing?.targetCash || step.requiredAmount || 0,
        requiredCash: existing?.requiredCash ?? Math.max(0, (step.requiredAmount || 0) - state.campaign.economy.nico.cash),
        returnStepId: existing?.returnStepId || agenda.steps[agenda.index + 1]?.stableId || null,
        returnLocation: existing?.returnLocation || cleanLocation(agenda.steps[agenda.index + 1]?.location || agenda.mission.location),
        withdrawn: existing?.withdrawn || 0,
        status: "active",
        agenda,
        step
      };
      state.atmUI.mode = "mission";
    } else if (payout) {
      payout.status = "active";
      state.atmUI.mode = "delegated";
    } else {
      state.freeAtmSession = { origin: nearestLocationName(state.movement.positions.nico), withdrawn: 0 };
      state.atmUI.mode = "free";
    }
    const requiredCash = state.atmUI.mode === "mission" ? state.missionAtmRequirement.requiredCash : state.atmUI.mode === "delegated" ? payout.requiredCash : 0;
    const account = state.campaign.economy.nico;
    els.atmBalance.textContent = `Banco ${formatMoney(account.bank)} · Efectivo ${formatMoney(account.cash)} · te faltan ${formatMoney(Math.max(0, requiredCash))}`;
    els.atmChoices.innerHTML = [10000, 20000, 30000, 50000].map(amount => `<button type="button" data-atm-amount="${amount}" ${amount > account.bank ? "disabled" : ""}>${formatMoney(amount)}</button>`).join("");
    els.atmCustomAmount.value = "";
    els.atmMessage.textContent = payout ? "Retirá el efectivo para el arreglo con el Cómplice." : "El retiro pasa del banco al bolsillo. Sin crédito ni descubierto.";
    if (!els.atmDialog.open) els.atmDialog.showModal();
    state.transport.send("atm:opened", { playerId: "nico", requiredCash, bank: account.bank, cash: account.cash, freeInteraction: state.atmUI.mode === "free" });
  }

  function completeATMWithdrawal(rawAmount) {
    const numeric = Number(rawAmount);
    const amount = numeric;
    const account = state.campaign.economy.nico;
    if (!Number.isFinite(amount) || amount < 1000) return void (els.atmMessage.textContent = "Elegí un monto desde $1.000.");
    if (amount % 1000 !== 0) return void (els.atmMessage.textContent = "El cajero entrega montos de a $1.000.");
    if (amount > account.bank) return void (els.atmMessage.textContent = "No hay tanto saldo en la cuenta.");
    const mode = state.atmUI.mode;
    const missionRequirement = state.missionAtmRequirement;
    const payout = state.delegatedPayoutRequirement;
    const moved = withdrawCash("nico", amount, "Retiro en cajero del barrio");
    if (mode === "mission" && missionRequirement) {
      missionRequirement.withdrawn += moved;
      missionRequirement.requiredCash = Math.max(0, missionRequirement.targetCash - account.cash);
      if (missionRequirement.requiredCash > 0) {
        openATMForAgenda(missionRequirement.agenda, missionRequirement.step);
        els.atmMessage.textContent = `Retiro registrado. Todavía te faltan ${formatMoney(missionRequirement.requiredCash)} en efectivo para este mandado.`;
        return;
      }
      missionRequirement.status = "complete";
    }
    if (mode === "delegated" && payout) {
      payout.withdrawn += moved;
      payout.requiredCash = Math.max(0, payout.amount - account.cash);
      if (payout.requiredCash > 0) {
        openATMForAgenda(null, null);
        els.atmMessage.textContent = `Retiro registrado. Todavía faltan ${formatMoney(payout.requiredCash)} para el arreglo.`;
        return;
      }
      payout.status = "complete";
    }
    if (mode === "free") state.freeAtmSession.withdrawn += moved;
    state.atmUI.open = false;
    els.atmDialog.close();
    renderPocket();
    if (mode === "delegated" && payout) {
      const counterpartId = payout?.counterpartId;
      if (counterpartId && counterpartId !== "nico") enqueueBotRoute(counterpartId, "plaza", { purpose: "settlement", stableKey: `${payout.dealId}:counterpart`, note: `${PLAYERS.find(player => player.id === counterpartId)?.name || "La otra parte"} fue a escuchar el arreglo` });
      state.delegatedPayoutRequirement = null;
      travelToLocation("plaza", payout.begin || (() => {}), "ENCUENTRO · HABLAR EL REPARTO");
      state.transport.send("atm:withdrawn", { playerId: "nico", amount, bankAfter: account.bank, cashAfter: account.cash, round: currentRound(), freeInteraction: false });
      return;
    }
    if (mode !== "mission" || !missionRequirement?.agenda) {
      state.transport.send("atm:withdrawn", { playerId: "nico", amount, bankAfter: account.bank, cashAfter: account.cash, round: currentRound(), freeInteraction: true });
      return;
    }
    const pendingAgenda = missionRequirement.agenda;
    const pendingStep = missionRequirement.step;
    state.missionAtmRequirement = null;
    commitAgendaStep(pendingStep, { ok: true });
    state.transport.send("atm:withdrawn", { playerId: "nico", amount, bankAfter: account.bank, cashAfter: account.cash, round: pendingAgenda.round, freeInteraction: false });
    toast(pendingAgenda.medicine
      ? `Guardaste ${formatMoney(amount)}. Volvé a la farmacia antes de que cambie la oferta.`
      : `Guardaste ${formatMoney(amount)}. Ahora seguí hasta ${cleanLocation(pendingAgenda.steps[pendingAgenda.index]?.location)}.`);
    advanceHumanAgenda();
  }

  function resumePendingATM() {
    const pending = state.missionAtmRequirement;
    if (!pending?.agenda || state.gameOver || state.isEpisodeResetting) return;
    state.atmUI.open = false;
    state.activeCounterpart = null;
    pending.status = "pending";
    toast(`Retiro pendiente: todavía necesitás ${formatMoney(pending.requiredCash)} en efectivo para seguir.`);
    window.setTimeout(() => {
      if (state.humanAgenda === pending.agenda && pending.agenda.steps[pending.agenda.index] === pending.step) advanceHumanAgenda();
    }, 0);
  }

  function handCash(fromId, toId, amount, label) {
    const from = state.campaign.economy[fromId], to = state.campaign.economy[toId];
    const moved = Math.min(from.cash, amount);
    from.cash -= moved; to.cash += moved;
    const transaction = recordTransaction({ fromId, toId, amount: moved, channel: "cash", label, visibleLabel: "Entrega en efectivo", legitimate: false });
    state.transport.send("cash:handed-over", { transactionId: transaction.id, fromId, toId, amount: moved, round: currentRound() });
    return moved;
  }

  function chooseAccompliceBehavior(deal) {
    const account = state.campaign.economy[deal.accompliceId];
    let betrayal = .24 + (deal.offeredShare === 0 ? .26 : deal.offeredShare === .2 ? .18 : deal.offeredShare === .35 ? .08 : -.04);
    if (totalBalance(deal.accompliceId) < 100000) betrayal += .18;
    if ((state.motivations[deal.accompliceId] || "").includes("alquiler")) betrayal += .12;
    if (state.suspicion[deal.scammerId] > 3) betrayal += .08;
    betrayal -= relationship(deal.scammerId, deal.accompliceId) * .05;
    const roll = random();
    if (roll < betrayal * .32) return "keep";
    if (roll < betrayal) return "skim";
    return "comply";
  }

  function settleHumanPayout(behavior) {
    if (!state.pendingPayout) return;
    const pending = state.pendingPayout;
    const { deal } = pending;
    state.pendingPayout = null;
    els.payoutDialog.close();
    if (pending.mode === "accomplice-hearing") {
      const { report } = pending;
      deal.reportedAmount = report.reportedAmount;
      deal.offeredShare = report.offeredShare;
      deal.truthfulness = report.truthfulness;
      deal.explanationId = report.explanationId;
      const player = PLAYERS.find(item => item.id === "nico");
      if (behavior === "accept") {
        const paid = Math.round(report.reportedAmount * report.offeredShare);
        deal.paid = paid;
        if (paid) handCash(deal.scammerId, "nico", paid, "Arreglo sin comprobante");
        deal.retained = (deal.gross || 0) - paid;
      } else if (behavior === "press") {
        deal.proof = true;
        state.suspicion[deal.scammerId] += report.truthfulness === "truth" ? .3 : 1.3;
        if (report.offeredShare === 0 && state.campaign.economy[deal.scammerId].cash >= Math.round((deal.gross || 0) * .2)) {
          const extra = handCash(deal.scammerId, "nico", Math.round((deal.gross || 0) * .2), "Parte entregada después del reclamo");
          deal.paid = extra;
          deal.retained = (deal.gross || 0) - extra;
        }
      } else if (behavior === "watch") {
        deal.proof = true;
        adjustRelationship(deal.scammerId, deal.accompliceId, -1);
      } else {
        adjustRelationship(deal.scammerId, deal.accompliceId, report.reportedAmount ? 0 : -1);
      }
      deal.encounterState = "complete";
      recordDealDialogueOnce(deal, "accomplice-hearing", player, report.explanationText, "accomplice-hearing");
      saveCampaign();
      renderEconomy();
      return;
    }
    settleDeal(deal, behavior);
  }

  function applyBotScammerReport(deal, report) {
    deal.reportedAmount = report.reportedAmount;
    deal.offeredShare = report.offeredShare;
    deal.truthfulness = report.truthfulness;
    deal.explanationId = report.explanationId;
    deal.encounterState = "complete";
    deal.paid = Math.round(report.reportedAmount * report.offeredShare);
    if (deal.paid) handCash(deal.scammerId, deal.accompliceId, deal.paid, "Arreglo sin comprobante");
    deal.retained = (deal.gross || 0) - deal.paid;
    if (report.truthfulness !== "truth" || report.offeredShare === 0) {
      deal.proof = random() < .55;
      state.suspicion[deal.scammerId] += report.offeredShare === 0 ? 1.1 : .8;
      adjustRelationship(deal.scammerId, deal.accompliceId, -2);
    } else adjustRelationship(deal.scammerId, deal.accompliceId, 1);
    saveCampaign();
    renderEconomy();
  }

  function chooseEncounterDeclaration(kind) {
    const pending = state.pendingEncounter;
    if (!pending) return;
    const { deal, execution } = pending;
    pending.declaration = kind;
    deal.reportedAmount = kind === "full" ? execution.amount : kind === "low" ? Math.max(0, Math.round(execution.amount * .6 / 1000) * 1000) : 0;
    deal.truthfulness = deal.reportedAmount === execution.amount ? "truth" : deal.reportedAmount === 0 ? "hidden" : "partial";
    if (kind === "zero" || kind === "reserve") {
      pending.stage = "explain";
      els.payoutKicker.textContent = "EL CÓMPLICE TE PREGUNTA";
      els.payoutTitle.textContent = "¿Y entonces qué hiciste con eso?";
      els.payoutText.textContent = "Elegí una explicación compatible con lo que realmente pasó durante la ronda.";
      els.payoutChoices.innerHTML = pending.explanationChoices.map((item, index) => `<button type="button" data-encounter-explain="${index}"><strong>${escapeHTML(item.text)}</strong><span>${kind === "reserve" ? "Sostiene que la guardaste para la próxima." : "Sostiene que hoy no entró nada útil."}</span></button>`).join("");
      return;
    }
    pending.stage = "share";
    els.payoutKicker.textContent = "ARREGLO EN EFECTIVO";
    els.payoutTitle.textContent = "¿Qué porcentaje le ofrecés?";
    els.payoutText.textContent = `Declaraste ${formatMoney(deal.reportedAmount)}. Ahora decidís si soltás algo o te quedás con todo.`;
    els.payoutChoices.innerHTML = [0, .2, .35, .5].map(value => `<button type="button" data-encounter-share="${value}"><strong>${Math.round(value * 100)}%</strong><span>${value ? `${formatMoney(Math.round(deal.reportedAmount * value))} para el Cómplice.` : "No le das un peso."}</span></button>`).join("");
  }

  function chooseEncounterExplanation(index) {
    const pending = state.pendingEncounter;
    if (!pending) return;
    const explanation = pending.explanationChoices[Number(index)];
    if (!explanation) return;
    pending.deal.explanationId = explanation.id;
    recordDialogue(PLAYERS.find(player => player.id === "nico"), explanation.text, "accomplice-explanation", state.scenarios[state.scenarioIndex]?.id);
    finishScammerEncounter();
  }

  function chooseEncounterShare(rawValue) {
    const pending = state.pendingEncounter;
    if (!pending) return;
    pending.deal.offeredShare = Number(rawValue);
    finishScammerEncounter();
  }

  function finishScammerEncounter() {
    const pending = state.pendingEncounter;
    if (!pending) return;
    state.pendingEncounter = null;
    const { deal, execution } = pending;
    const accomplice = PLAYERS.find(player => player.id === deal.accompliceId);
    const paid = deal.offeredShare != null ? Math.round((deal.reportedAmount || 0) * deal.offeredShare) : 0;
    deal.paid = paid;
    deal.retained = (deal.gross || 0) - paid;
    if (paid) handCash("nico", deal.accompliceId, paid, "Arreglo sin comprobante");
    const shady = deal.truthfulness !== "truth" || (deal.offeredShare || 0) === 0;
    if (shady) {
      deal.proof = random() < .62 || deal.delegated;
      state.suspicion.nico += deal.offeredShare === 0 ? 1.2 : .8;
      adjustRelationship("nico", deal.accompliceId, deal.offeredShare === 0 ? -3 : -2);
      if (accomplice) recordDialogue(accomplice, deal.offeredShare === 0 ? "¿Cero? Bueno… después no me dejes afuera si esto sigue." : "Dale, pero esto quedó medio corto.", "accomplice-pressure", state.scenarios[state.scenarioIndex]?.id);
    } else {
      adjustRelationship("nico", deal.accompliceId, 1);
      if (accomplice) recordDialogue(accomplice, "Bueno, después vemos la próxima.", "accomplice-settle", state.scenarios[state.scenarioIndex]?.id);
    }
    deal.behavior = shady ? "tense" : "settled";
    deal.encounterState = "complete";
    state.transport.send(paid ? "accomplice:payout" : "accomplice:confronted", { dealId: deal.id, accompliceId: deal.accompliceId, scammerId: deal.scammerId, paid, retained: deal.retained, offeredShare: deal.offeredShare || 0 });
    els.payoutDialog.close();
    renderEconomy();
    saveCampaign();
  }

  function settleDeal(deal, behavior) {
    const gross = deal.gross || 0;
    const expected = deal.expected;
    const extra = Math.round(gross * .25);
    const paid = behavior === "comply" ? expected : behavior === "skim" ? Math.max(0, expected - extra) : 0;
    deal.behavior = behavior; deal.paid = paid; deal.retained = gross - paid; deal.encounterState = "complete";
    adjustRelationship(deal.scammerId, deal.accompliceId, behavior === "comply" ? 1 : behavior === "skim" ? -1 : -3);
    if (paid) {
      const moved = handCash(deal.accompliceId, deal.scammerId, paid, "Reparto sin comprobante");
      state.campaign.economy[deal.accompliceId].unexplained = Math.max(0, state.campaign.economy[deal.accompliceId].unexplained - moved);
    }
    state.transport.send(behavior === "comply" ? "accomplice:payout" : "accomplice:betrayed", { dealId: deal.id, accompliceId: deal.accompliceId, scammerId: deal.scammerId, expected, paid, retained: deal.retained, behavior });
    const accomplice = PLAYERS.find(player => player.id === deal.accompliceId);
    if (behavior !== "comply") {
      state.suspicion[deal.accompliceId] += behavior === "keep" ? 2.2 : 1.1;
      recordDialogue(accomplice, behavior === "keep" ? "La plata quedó conmigo. Después arreglamos." : "Te mandé casi todo; tuve que cubrir un gasto.", "accomplice-betrayal", state.scenarios[state.scenarioIndex]?.id);
    }
    if (deal.scammerId === "nico" && paid < expected) window.setTimeout(() => openConfrontation(deal), 250);
    else if (deal.scammerId !== "nico" && paid < expected && random() < .72) { deal.proof = true; state.suspicion[deal.accompliceId] += 1.5; }
    saveCampaign(); renderEconomy();
  }

  function openConfrontation(deal) {
    state.pendingConfrontation = deal;
    const missing = deal.expected - deal.paid;
    els.payoutKicker.textContent = "FALTA PLATA";
    els.payoutTitle.textContent = `${PLAYERS.find(player => player.id === deal.accompliceId).name} no respetó el arreglo`;
    els.payoutText.textContent = `Esperabas ${formatMoney(deal.expected)} y llegaron ${formatMoney(deal.paid)}. Faltan ${formatMoney(missing)}.`;
    els.payoutChoices.innerHTML = `<button type="button" data-confrontation="reclaim"><strong>Reclamar ahora</strong><span>Recuperás parte, pero alguien puede escuchar.</span></button><button type="button" data-confrontation="proof"><strong>Guardar prueba</strong><span>Te habilita a señalar su excedente en la mesa.</span></button><button type="button" data-confrontation="silence"><strong>Callarte</strong><span>Perdés la plata y protegés el vínculo.</span></button>`;
    els.payoutDialog.showModal();
  }

  function settleConfrontation(action) {
    const deal = state.pendingConfrontation;
    if (!deal) return;
    state.pendingConfrontation = null;
    els.payoutDialog.close();
    const missing = deal.expected - deal.paid;
    if (action === "reclaim") {
      const recovered = handCash(deal.accompliceId, deal.scammerId, Math.round(missing / 2), "Reclamo sin recibo");
      state.campaign.economy[deal.accompliceId].unexplained = Math.max(0, state.campaign.economy[deal.accompliceId].unexplained - recovered);
      deal.paid += recovered; deal.retained -= recovered; deal.proof = true;
      speak("nico", `Pará, faltan ${formatMoney(missing)} del arreglo.`, "confrontation");
      state.suspicion.nico += 1; state.suspicion[deal.accompliceId] += 1;
      adjustRelationship(deal.scammerId, deal.accompliceId, -2);
    } else if (action === "proof") {
      deal.proof = true; state.suspicion[deal.accompliceId] += 2;
      adjustRelationship(deal.scammerId, deal.accompliceId, -1);
      addSystemFeed("Guardaste el detalle del reparto para usarlo en una auditoría.");
    } else addSystemFeed("Dejaste pasar el faltante para no exponer el vínculo.");
    state.transport.send("accomplice:confronted", { dealId: deal.id, action, missing });
    saveCampaign(); renderEconomy();
  }

  function scoreDecision(scenario, stance, fraudStatus = "none") {
    if (stance === "fraudExecute") return fraudStatus === "successful"
      ? { security: -15, trust: 0, suspicion: 2.2, title: "La maniobra pasó.", feedback: "El recurso quedó consumido y dejó un rastro auditable.", tone: "bad" }
      : { security: 0, trust: -1, suspicion: 3.6, title: "La maniobra se trabó.", feedback: "No hubo pérdida, pero el intento dejó más rastros que una operación normal.", tone: "neutral" };
    if (scenario.isScam) {
      const map = {
        verify: [6, 3, 2.2, "Paraste antes de cerrar.", "La verificación dejó un dato concreto para la sobremesa.", "safe"],
        approve: [-14, -3, .3, "La operación siguió.", "Puede salir bien o no. La mesa todavía no sabe qué historia estaba armada.", "bad"],
        reject: [7, 1, 1.7, "La operación quedó fría.", "Evitaste el movimiento, aunque todavía falta saber si acusaste con razón.", "safe"],
        consult: [4, 5, 1.4, "La duda quedó compartida.", "Sumaste otra mirada sin dar la historia por falsa.", "neutral"]
      }[stance];
      return unpackScore(map);
    }
    const map = {
      verify: [2, 2, .1, "Verificaste sin romper el trato.", "Una operación real también tiene que bancarse una comprobación.", "safe"],
      approve: [3, 4, 0, "El mandado siguió su curso.", "Tomaste una decisión razonable con los datos que había.", "safe"],
      reject: [0, -5, .8, "La operación se enfrió.", "Frenar evita pérdidas, pero acusar de más también tiene costo.", "neutral"],
      consult: [1, 3, .1, "La mesa suma contexto.", "No resolviste todavía, pero evitaste quedar aislado.", "neutral"]
    }[stance];
    return unpackScore(map);
  }

  function unpackScore(values) {
    return { security: values[0], trust: values[1], suspicion: values[2], title: values[3], feedback: values[4], tone: values[5] };
  }

  function shortStory(scenario) {
    const endings = {
      bike: "La transferencia seguía pendiente.", fridge: "La venta venía atada a una mudanza.", bank: "Había una supuesta demora bancaria.",
      family: "El contacto escribía desde un número nuevo.", rental: "La reserva tenía precio de cancelación.", job: "El ingreso laboral era urgente.",
      qr: "El pago dependía de un QR.", phone: "La venta debía cerrarse antes de un viaje."
    };
    return endings[scenario.id];
  }

  function reactionAfter(stance, scenario) {
    const verifier = PLAYERS.find(player => state.roles[player.id] === "Verificador");
    const neighbor = PLAYERS.find(player => !player.human && player.id !== scenario.actorId && state.roles[player.id] === "Vecino") || PLAYERS[0];
    if (stance === "fraudExecute") return { id: currentAccomplice()?.id || neighbor.id, text: "Eso no sonó a mandado. Anotemos quién tenía ese recurso." };
    if (stance === "approve") return { id: verifier?.id || neighbor.id, text: "Anotemos qué dato dimos por bueno." };
    if (stance === "reject") return { id: neighbor.id, text: "Puede ser, pero no toda urgencia es chamuyo." };
    return { id: verifier?.id || neighbor.id, text: "Bien. Una comprobación concreta vale más que una corazonada." };
  }

  function currentAccomplice() { return state.accompliceFrozen ? undefined : PLAYERS.find(player => state.roles[player.id] === "Cómplice"); }

  function prepareMeeting() {
    state.storiesReady = true;
    state.debugTrace.push({ event: "stories-ready", dayTimer: state.dayTimer, at: Date.now() });
    refreshDinnerGate("stories-ready");
  }

  function openMeeting() {
    if (state.gameOver || els.meetingDialog.open) return;
    const gate = dinnerGateStatus();
    if (!gate.available) {
      toast(gate.reason === "waiting-stories" ? "Todavía faltan movimientos del barrio."
        : gate.reason === "waiting-bots" ? "Los vecinos todavía están con sus mandados."
        : "Todavía hay recorridos obligatorios del barrio.");
      return;
    }
    if (!gate.ready) {
      const messages = {
        "human-mission": "Antes de sentarte, terminá o cerrá tu mandado.",
        "human-atm": "Antes de sentarte, completá el retiro que necesita tu mandado.",
        "human-payout": "Antes de sentarte, cerrá el reparto de efectivo pendiente.",
        "human-encounter": "Antes de sentarte, terminá la charla obligatoria con el Cómplice."
      };
      toast(messages[gate.reason] || "Todavía tenés una interacción obligatoria pendiente.");
      return;
    }
    state.meetingPhase = "review";
    state.botQuestionCompleted = false;
    Object.values(state.movement.activeBotRoute).forEach(job => job?.callbackKey && botRouteCallbacks.delete(job.callbackKey));
    Object.values(state.movement.botRouteQueues).flat().forEach(job => job?.callbackKey && botRouteCallbacks.delete(job.callbackKey));
    state.movement.activeBotRoute = {};
    state.movement.botRouteQueues = {};
    state.movement.path = [];
    stopTimer();
    stopDayClock();
    state.meetings += 1;
    els.meetingButton.disabled = true;
    els.meetingButton.classList.remove("is-ready");
    els.suspiciousEvents.innerHTML = state.roundStories.map(story => `<li><strong>${escapeHTML(story.actorName)} · ${escapeHTML(story.place)}</strong><span>${escapeHTML(story.summary)}</span></li>`).join("")
      + (state.gossip?.rumor ? `<li class="gossip-note"><strong>COMENTARIO · ${escapeHTML(PLAYERS.find(player => player.id === state.gossip.playerId)?.name || "Alguien")}</strong><span>${escapeHTML(state.gossip.rumor)}</span><small>Opinión de poco peso; no es evidencia.</small></li>` : "");
    renderMeetingSeats();
    els.voteGrid.innerHTML = PLAYERS.map(player => `
      <button type="button" class="vote-card" data-vote="${player.id}" style="--avatar:${player.color}">
        <span class="vote-face">${player.initials}</span><span>${player.name}</span><small>${player.human ? "TU VOTO" : state.audited.has(player.id) ? "REVISAR OTRA VEZ" : "VOTAR"}</small>
      </button>`).join("");
    els.voteGrid.querySelectorAll(".vote-card").forEach(button => button.addEventListener("click", () => castVote(button.dataset.vote)));
    els.voteResult.textContent = "";
    state.pendingJudgment = false;
    els.resumeButton.textContent = "LEVANTAR LA MESA →";
    els.resumeButton.disabled = true;
    els.skipVoteButton.disabled = false;
    els.meetingDialog.showModal();
    setupVerification();
    state.transport.send("meeting:started", { round: state.meetings, stories: 4 });
  }

  function renderMeetingSeats() {
    els.meetingSeats.innerHTML = PLAYERS.map((player, index) => `
      <div class="meeting-seat seat-${index + 1}" style="--skin:${player.skin};--hair:${player.hair};--shirt:${player.shirt}">
        <div class="seat-avatar">${playerSpriteMarkup(player)}</div><span>${player.name}${player.human ? " · vos" : ""}</span>
        <button class="seat-dialogue-peek" type="button" data-dialogue-player="${player.id}" aria-label="Ver diálogos de ${player.name}" ${dialoguesFor(player.id).length ? "" : "hidden"}>…</button>
        <div class="dialogue-note meeting-dialogue-note" hidden></div>
      </div>`).join("");
  }

  function setupVerification() {
    state.meetingPhase = "interrogation-open";
    state.questionsRemaining = state.roles.nico === "Verificador" ? 2 : 0;
    state.questionedPlayers = new Set();
    state.currentInterrogation = null;
    els.interviewAnswer.textContent = "";
    els.questionOptions.innerHTML = "";
    if (state.roles.nico === "Verificador") {
      els.verifierPanel.hidden = false;
      lockVoting(true);
      renderInterviewPeople();
      updateQuestionCounter();
    } else {
      els.verifierPanel.hidden = true;
      const botVerifier = PLAYERS.find(player => state.roles[player.id] === "Verificador");
      if (botVerifier) {
        lockVoting(true);
        window.setTimeout(() => autoVerifierQuestion(botVerifier), 320);
      } else lockVoting(false);
    }
  }

  function renderInterviewPeople() {
    els.interviewPeople.innerHTML = PLAYERS.filter(player => player.id !== "nico").map(player => `
      <button type="button" data-interview-player="${player.id}" ${state.questionedPlayers.has(player.id) ? "disabled" : ""}>
        <strong>${escapeHTML(player.name)}</strong><small>${escapeHTML(roundRecord(player.id)?.publicMission?.text || state.socialProfiles[player.id].place)}</small>
      </button>`).join("");
  }

  function selectInterviewPlayer(playerId) {
    if (state.questionsRemaining <= 0 || state.questionedPlayers.has(playerId)) return;
    const story = state.roundStories.find(item => item.actorId === playerId);
    const scenario = state.scenarios.find(item => item.round === story?.round && item.actorId === playerId && item.id === story?.scenarioId)
      || state.scenarios.find(item => item.round === state.scenarios[state.scenarioIndex].round && item.actorId === playerId);
    if (!story || !scenario) {
      const fallback = state.scenarios.find(item => item.round === currentRound());
      const player = PLAYERS.find(candidate => candidate.id === playerId);
      state.currentInterrogation = { playerId, story: { actorId: playerId, actorName: player.name, isScam: false }, scenario: fallback, general: true };
      els.interviewPeople.querySelectorAll("button").forEach(button => button.classList.toggle("selected", button.dataset.interviewPlayer === playerId));
      els.verifierInstruction.textContent = `Elegí qué preguntarle a ${player.name}.`;
      els.questionOptions.innerHTML = ["¿Qué hiciste durante la ronda?", "¿Con quién estuviste?", "¿Qué intentaste y no pudiste completar?"].map((prompt, index) => `<button type="button" data-question-index="${index}">${prompt}</button>`).join("");
      return;
    }
    state.currentInterrogation = { playerId, story, scenario };
    els.interviewPeople.querySelectorAll("button").forEach(button => button.classList.toggle("selected", button.dataset.interviewPlayer === playerId));
    els.verifierInstruction.textContent = `Elegí qué preguntarle a ${story.actorName}.`;
    els.questionOptions.innerHTML = scenario.extras.questions.map((item, index) => `<button type="button" data-question-index="${index}">${escapeHTML(item.prompt)}</button>`).join("");
  }

  function askVerifierQuestion(questionIndex, automated = false, forcedPlayerId = null) {
    let interrogation = state.currentInterrogation;
    if (automated && forcedPlayerId) {
      const story = state.roundStories.find(item => item.actorId === forcedPlayerId) || { actorId: forcedPlayerId, actorName: PLAYERS.find(player => player.id === forcedPlayerId).name, isScam: false };
      const scenario = state.scenarios.find(item => item.round === state.scenarios[state.scenarioIndex].round && item.actorId === forcedPlayerId);
      const forceGeneral = forcedPlayerId === "nico" && state.roles.nico === "Estafador";
      interrogation = { playerId: forcedPlayerId, story, scenario: scenario || state.scenarios.find(item => item.round === currentRound()), general: forceGeneral || !scenario };
    }
    if (!interrogation?.scenario || (!automated && state.questionsRemaining <= 0)) return;
    const generalPrompts = ["¿Qué hiciste durante la ronda?", "¿En qué orden y con quién estuviste?", "¿Qué intentaste y no pudiste completar?"];
    const item = interrogation.general ? { prompt: generalPrompts[questionIndex], legitStrong: "", legitAwkward: "", scamPolished: "", scamWeak: "" } : interrogation.scenario.extras.questions[questionIndex];
    if (state.roles[interrogation.playerId] === "Estafador") {
      const alibis = generateAlibis(interrogation.playerId, currentRound());
      if (interrogation.playerId === "nico" && automated) {
        openAlibiChoice(item.prompt, alibis, interrogation);
        return;
      }
      const choice = chooseBotAlibi(interrogation.playerId, alibis);
      applyAlibi(interrogation, item.prompt, choice, automated);
      return;
    }
    if (interrogation.general) {
      const record = roundRecord(interrogation.playerId);
      const answer = { text: questionIndex === 0 ? record.publicActions.join(" Después, ") : questionIndex === 1 ? `${record.publicActions[0]} ${PLAYERS.find(player => player.id === record.witnesses[0])?.name || "alguien del barrio"} puede confirmarlo.` : record.attemptedActions[0], suspicion: -.2, intention: "answer-public-mission" };
      finishVerifierAnswer(interrogation, item, answer, automated);
      return;
    }
    const targetExecuted = roundRecord(interrogation.playerId)?.frauds.length > 0;
    const answer = pickVerifierAnswer(targetExecuted, item);
    finishVerifierAnswer(interrogation, item, answer, automated);
  }

  function finishVerifierAnswer(interrogation, item, answer, automated) {
    if (!answer.text || !answer.text.trim()) {
      const fallback = item.legitStrong || `${interrogation.playerId} realizó la gestión que tenía asentada.`;
      answer = { ...answer, text: fallback };
      if (DEBUG_MODE) console.warn(`[DEBUG] Empty answer replaced with fallback for ${interrogation.playerId}`);
    }
    state.suspicion[interrogation.playerId] = Math.max(0, state.suspicion[interrogation.playerId] + answer.suspicion);
    if (!automated) {
      state.questionedPlayers.add(interrogation.playerId);
      state.questionsRemaining -= 1;
    } else {
      state.botQuestionCompleted = true;
    }
    const player = PLAYERS.find(person => person.id === interrogation.playerId);
    if (!String(answer.intention).startsWith("alibi-")) state.judgmentHistory.push({ playerId: player.id, playerName: player.name, prompt: item.prompt, answer: answer.text, round: currentRound() });
    recordDialogue(player, answer.text, answer.intention, interrogation.scenario.id);
    appendInterviewToBoard(player.name, item.prompt, answer.text);
    els.interviewAnswer.innerHTML = `<strong>${escapeHTML(player.name)}</strong><span>“${escapeHTML(answer.text)}”</span>`;
    state.transport.send("verification:questioned", { targetId: player.id, question: item.prompt, automated });
    state.transport.send("verification:answered", { targetId: player.id, scenarioId: interrogation.scenario.id });
    if (!automated) {
      state.currentInterrogation = null;
      els.questionOptions.innerHTML = "";
      renderInterviewPeople();
      updateQuestionCounter();
      if (state.questionsRemaining === 0) finishVerification();
      else els.verifierInstruction.textContent = "Elegí otra persona. No podés repetir vecino.";
    } else {
      lockVoting(false);
    }
  }

  function generateAlibis(playerId, round) {
    const record = roundRecord(playerId, round);
    const witness = PLAYERS.find(player => player.id === record.witnesses[0]);
    const otherStory = state.roundStories.find(story => story.actorId !== playerId) || state.roundStories[0];
    const direct = record.publicActions[0] || record.attemptedActions[0] || "Dejé asentado el mandado y el horario en que fui";
    const attempt = record.attemptedActions[0] || record.publicActions[1] || `hice una consulta en ${cleanLocation(record.publicMission.location)} que no llegó a cerrarse`;
    const options = [
      { kind: "direct", text: direct, usedFacts: [direct], omittedFacts: [attempt], risk: 1, suspicionEffect: -.45 },
      { kind: "sequence", text: `${direct} Después ${lowerFirst(attempt)}`, usedFacts: [direct, attempt], omittedFacts: [], risk: 1, suspicionEffect: -.7 },
      { kind: "setback", text: attempt, usedFacts: [attempt], omittedFacts: [direct], risk: 2, suspicionEffect: .05 },
      { kind: "witness", text: `${direct} ${witness?.name || "Un vecino"} estaba ahí y lo puede confirmar.`, usedFacts: [direct], omittedFacts: [], witnessId: witness?.id, risk: record.coverStrength ? 0 : 2, suspicionEffect: record.coverStrength ? -.9 : -.15 },
      { kind: "partial", text: `${direct} El otro trámite quedó para después.`, usedFacts: [direct], omittedFacts: [attempt], risk: 3, suspicionEffect: .55 },
      { kind: "redirect", text: `${direct} Lo que me llamó la atención fue lo de ${otherStory?.actorName || "otra persona"}: ${lowerFirst(otherStory?.summary || "su operación no cerraba")}`, usedFacts: [direct], omittedFacts: [attempt], risk: 4, suspicionEffect: 1.05 }
    ];
    options.forEach(item => { item.fabricatedLinks = []; item.witnessId ||= null; });
    record.generatedAlibis = options;
    return options;
  }

  function lowerFirst(text) { return text ? text.charAt(0).toLowerCase() + text.slice(1) : ""; }
  function chooseBotAlibi(playerId, alibis) {
    const record = roundRecord(playerId);
    const pool = record.coverStrength > 0 ? alibis.slice(0, 4) : state.suspicion[playerId] > 3 ? alibis.slice(3) : alibis;
    return pool[Math.floor(random() * pool.length)];
  }

  function openAlibiChoice(prompt, alibis, interrogation) {
    state.pendingAlibi = { prompt, alibis, interrogation };
    els.alibiQuestion.textContent = prompt;
    els.alibiChoices.innerHTML = alibis.map((item, index) => `<button type="button" data-alibi="${index}"><small>${index + 1} · ${["Actividad directa", "Secuencia completa", "Contratiempo", "Con testigo", "Verdad parcial", "Desvío"][index]}</small><strong>${escapeHTML(item.text)}</strong></button>`).join("");
    els.alibiDialog.showModal();
  }

  function applyAlibi(interrogation, prompt, choice, automated) {
    const record = roundRecord(interrogation.playerId);
    record.selectedAlibis.push({ ...choice, prompt, round: currentRound() });
    state.judgmentHistory.push({ playerId: interrogation.playerId, playerName: PLAYERS.find(player => player.id === interrogation.playerId).name, prompt, answer: choice.text, round: currentRound() });
    const unsupported = choice.kind === "redirect" ? 1 : 0;
    const witnessRecord = choice.witnessId ? roundRecord(choice.witnessId) : null;
    const contradictions = choice.witnessId && (!record.witnesses.includes(choice.witnessId) || !witnessRecord?.visitedLocations.includes(record.publicMission.location)) ? 1 : 0;
    choice.factualMatches = choice.usedFacts.length;
    choice.unsupportedClaims = unsupported;
    choice.contradictions = contradictions;
    choice.unexplainedWindow = choice.omittedFacts.length;
    choice.redirectPressure = choice.kind === "redirect" ? 2 : 0;
    choice.coverStrength = record.coverStrength + choice.factualMatches - contradictions;
    finishVerifierAnswer(interrogation, { prompt }, { text: choice.text, suspicion: choice.suspicionEffect + contradictions, intention: `alibi-${choice.kind}` }, automated);
  }

  function pickVerifierAnswer(isScam, item) {
    const roll = random();
    if (!isScam) return roll < .7
      ? { text: item.legitStrong, suspicion: -.35, intention: "answer-solid" }
      : { text: item.legitAwkward, suspicion: .45, intention: "answer-awkward" };
    return roll < .4
      ? { text: item.scamPolished, suspicion: .25, intention: "answer-polished-lie" }
      : { text: item.scamWeak, suspicion: 1.45, intention: "answer-contradiction" };
  }

  function appendInterviewToBoard(name, prompt, answer) {
    const item = document.createElement("li");
    item.className = "interview-entry";
    item.innerHTML = `<strong>PREGUNTA A ${escapeHTML(name)}</strong><span>${escapeHTML(prompt)}<br>“${escapeHTML(answer)}”</span>`;
    els.suspiciousEvents.append(item);
  }

  function updateQuestionCounter() {
    const display = state.roles.nico === "Verificador" ? state.questionsRemaining : 0;
    els.questionCounter.textContent = display;
    els.questionCounter.setAttribute("aria-label", `${display} preguntas restantes`);
  }

  function finishVerification() {
    if (state.meetingPhase === "interrogation-closed") return;
    state.meetingPhase = "interrogation-closed";
    state.questionsRemaining = 0;
    state.currentInterrogation = null;
    els.questionOptions.innerHTML = "";
    els.verifierInstruction.textContent = "Libreta cerrada. Ahora compará las respuestas y votá.";
    els.interviewPeople.querySelectorAll("button").forEach(button => { button.disabled = true; });
    updateQuestionCounter();
    lockVoting(false);
  }

  function lockVoting(locked) {
    els.voteGrid.querySelectorAll(".vote-card").forEach(button => {
      button.disabled = locked;
    });
    els.skipVoteButton.disabled = locked;
  }

  function autoVerifierQuestion(botVerifier) {
    const targetId = PLAYERS.filter(player => player.id !== botVerifier.id).sort((a, b) => {
      const dialogueA = dialoguesFor(a.id).length * .08;
      const dialogueB = dialoguesFor(b.id).length * .08;
      return (state.suspicion[b.id] + dialogueB) - (state.suspicion[a.id] + dialogueA);
    })[0]?.id;
    if (!targetId) return;
    const scenario = state.scenarios.find(item => item.round === currentRound() && item.actorId === targetId);
    const questionIndex = scenario ? Math.floor(random() * scenario.extras.questions.length) : 0;
    addSystemFeed(`${botVerifier.name} pidió una justificación en la mesa`);
    askVerifierQuestion(questionIndex, true, targetId);
  }

  function episodeUnexplained(playerId) {
    return Math.max(0, state.campaign.transactions
      .filter(item => item.episodeId === state.campaign.episodeNumber && !item.legitimate)
      .reduce((sum, item) => sum + (item.toId === playerId ? item.amount : 0) - (item.fromId === playerId ? item.amount : 0), 0));
  }

  function auditLedger(playerId) {
    const account = state.campaign.economy[playerId];
    const incoming = state.campaign.transactions
      .filter(item => item.episodeId === state.campaign.episodeNumber && item.toId === playerId)
      .reduce((sum, item) => sum + item.amount, 0);
    return `Saldo auditado: ${formatMoney(totalBalance(playerId))}; ingresos de esta partida: ${formatMoney(incoming)}; bienes registrados: ${account.assets.length}.`;
  }

  function castVote(playerId, suppliedVotes = null) {
    if (!els.resumeButton.disabled) return;
    state.meetingPhase = "voting";
    const allVotes = suppliedVotes ? [...suppliedVotes] : [playerId];
    if (!suppliedVotes) PLAYERS.filter(player => !player.human).forEach(bot => allVotes.push(botVote(bot)));
    const counts = allVotes.reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
    const highest = Math.max(...Object.values(counts));
    const tied = Object.keys(counts).filter(id => counts[id] === highest);
    const targetId = tied.includes(playerId) ? playerId : tied[0];
    const target = PLAYERS.find(player => player.id === targetId);
    if (state.meetingPhase === "voting") state.meetingPhase = "audit-result";
    const role = state.roles[targetId];
    const targetStory = state.roundStories.find(story => story.actorId === targetId);
    const record = roundRecord(targetId);
    const executedFrauds = record?.frauds || [];
    const unexplained = episodeUnexplained(targetId);
    state.audited.add(targetId);
    els.voteGrid.querySelectorAll("button").forEach(button => {
      button.disabled = true;
      button.classList.toggle("selected", button.dataset.vote === targetId);
    });
    const tally = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([id, count]) => `${PLAYERS.find(player => player.id === id).name} ${count}`).join(" · ");
    renderVoteResult(counts, targetId, tally, target, role, record, executedFrauds, unexplained, playerId, suppliedVotes);
  }

  function renderVoteResult(counts, targetId, tally, target, role, record, executedFrauds, unexplained, playerId, suppliedVotes) {
    const targetStory = state.roundStories.find(story => story.actorId === targetId);
    if (role === "Estafador" && executedFrauds.length) {
      state.trust = clamp(state.trust + 12, 0, 100);
      state.security = clamp(state.security + 7, 0, 100);
      state.scammerFrozen = true;
      state.gameOver = true;
      els.voteResult.textContent = `Votos: ${tally}. La auditoría encontró ${executedFrauds.map(item => item.method).join(" y ")}. ${target.name} era el Estafador.`;
    } else if (role === "Cómplice" && unexplained >= ECONOMY_CONFIG.surplusThreshold) {
      state.trust = clamp(state.trust + 5, 0, 100);
      state.falseTarget = target;
      state.falseClosing = true;
      els.voteResult.textContent = `Votos: ${tally}. En la cuenta y el efectivo de ${target.name} sobran ${formatMoney(unexplained)} sin recibo. ${auditLedger(targetId)} El barrio cree que encontró al autor y cierra el caso.`;
      state.transport.send("audit:surplus-found", { targetId, amount: unexplained, episodeId: state.campaign.episodeNumber, roundId: currentRound() });
      els.resumeButton.disabled = true;
      els.skipVoteButton.disabled = true;
      window.setTimeout(() => endGame("estafador", "false-close", PLAYERS.find(player => state.roles[player.id] === "Estafador")), 950);
    } else if (role === "Cómplice" && executedFrauds.length) {
      state.trust = clamp(state.trust + 7, 0, 100);
      state.security = clamp(state.security + 3, 0, 100);
      state.accompliceFrozen = true;
      els.voteResult.textContent = `Votos: ${tally}. Apareció una operación de ${target.name}: ${executedFrauds[0].method}. ${auditLedger(targetId)} Era el Cómplice; la cabeza sigue suelta.`;
    } else {
      state.trust = clamp(state.trust - 10, 0, 100);
      const activity = [...(record?.publicActions || []), ...(record?.attemptedActions || [])].join(" También ") || targetStory?.summary || "hizo un mandado documentado";
      els.voteResult.textContent = `Votos: ${tally}. La auditoría encontró actividad legítima: ${activity} ${auditLedger(targetId)} No hay operaciones irregulares de ${target.name} en esta ronda.`;
      state.suspicion[targetId] = Math.max(0, state.suspicion[targetId] - 1.5);
      const earlierFraud = Object.entries(state.roundRecords).some(([round, records]) => Number(round) < currentRound() && Object.values(records).some(item => item.frauds.some(fraud => fraud.status === "successful")));
      state.pendingJudgment = currentRound() >= 2 || (currentRound() >= 1 && earlierFraud);
      if (state.pendingJudgment) els.resumeButton.textContent = "ABRIR EL JUICIO →";
    }
    if (!state.gameOver && !state.falseClosing && currentRound() >= 2) {
      state.pendingJudgment = true;
      els.resumeButton.textContent = "ABRIR EL JUICIO →";
    }
    updateMeters();
    els.resumeButton.disabled = state.falseClosing;
    els.skipVoteButton.disabled = true;
    state.transport.send("audit:cast", { humanVote: suppliedVotes ? null : playerId, targetId, tally: counts });
    if (role === "Estafador" && executedFrauds.length) {
      els.resumeButton.disabled = true;
      window.setTimeout(() => endGame("barrio", "scammer-discovered", target), 700);
    }
  }

  function botVote(bot) {
    const candidates = PLAYERS;
    if (state.roles[bot.id] === "Cómplice" && !state.accompliceFrozen) {
      const honest = candidates.filter(player => state.roles[player.id] !== "Estafador");
      return honest[Math.floor(random() * honest.length)]?.id || candidates[0].id;
    }
    if (state.roles[bot.id] === "Estafador") {
      const betrayed = state.accompliceDeals.filter(deal => deal.episodeId === state.campaign.episodeNumber && deal.scammerId === bot.id && deal.paid < deal.expected && deal.proof).at(-1);
      if (betrayed) return betrayed.accompliceId;
      const honest = candidates.filter(player => player.id !== bot.id && state.roles[player.id] !== "Cómplice");
      return honest[Math.floor(random() * honest.length)]?.id || candidates[0].id;
    }
    const verifierBonus = state.roles.nico === "Verificador" ? .1 : 0;
    const accuracy = (state.roles[bot.id] === "Verificador" ? .72 : .48) + verifierBonus;
    if (random() < accuracy) {
      return [...candidates].sort((a, b) => state.suspicion[b.id] - state.suspicion[a.id])[0].id;
    }
    return candidates[Math.floor(random() * candidates.length)].id;
  }

  function skipVote() {
    if (!els.resumeButton.disabled) return;
    state.meetingPhase = "voting";
    const votes = PLAYERS.filter(player => !player.human).map(bot => botVote(bot));
    const counts = votes.reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const [topId, topCount] = entries[0];
    if (topCount >= 3) {
      state.meetingPhase = "audit-result";
      const allVotes = [...votes];
      const counts2 = allVotes.reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
      const highest2 = Math.max(...Object.values(counts2));
      const tied2 = Object.keys(counts2).filter(id => counts2[id] === highest2);
      const targetId2 = tied2.includes(topId) ? topId : tied2[0];
      const target = PLAYERS.find(player => player.id === targetId2);
      const role = state.roles[targetId2];
      const record = roundRecord(targetId2);
      const executedFrauds = record?.frauds || [];
      const unexplained = episodeUnexplained(targetId2);
      state.audited.add(targetId2);
      const tally = entries.map(([id, count]) => `${PLAYERS.find(player => player.id === id).name} ${count}`).join(" · ");
      renderVoteResult(counts2, targetId2, tally, target, role, record, executedFrauds, unexplained);
      return;
    }
    els.voteGrid.querySelectorAll("button").forEach(button => { button.disabled = true; });
    els.voteResult.textContent = "Sin tu voto no hubo mayoría. Las operaciones siguen abiertas.";
    if (currentRound() >= 2) { state.pendingJudgment = true; els.resumeButton.textContent = "ABRIR EL JUICIO →"; }
    els.resumeButton.disabled = false;
    els.skipVoteButton.disabled = true;
  }

  function resumeGame() {
    if (state.gameOver) return;
    els.meetingDialog.close();
    els.villageMap.focus({ preventScroll: true });
    updateErrandSlip();
    if (state.scamScore >= 3) {
      endGame("estafador", "three-frauds", PLAYERS.find(player => state.roles[player.id] === "Estafador"));
      return;
    }
    if (state.pendingJudgment) {
      state.meetingPhase = "judgment";
      openJudgment();
      return;
    }
    state.meetingPhase = null;
    state.roundStories = [];
    resetDayClockForRound();
    document.querySelectorAll(".dialogue-peek").forEach(button => { button.hidden = true; });
    closeDialogueNotes();
    if (state.completed >= state.scenarios.length) appendRound();
    nextStep();
    window.setTimeout(openMissionDialog, 90);
  }

  function openJudgment() {
    stopTimer();
    const records = Object.entries(state.roundRecords).flatMap(([round, byPlayer]) => Object.entries(byPlayer).flatMap(([playerId, record]) => {
      const player = PLAYERS.find(item => item.id === playerId);
      const activity = [...record.publicActions, ...record.attemptedActions].join(" / ");
      return [`Ronda ${Number(round) + 1} · ${player.name}: ${activity}`];
    }));
    state.judgmentHistory.forEach(item => records.push(`Ronda ${item.round + 1} · ${item.playerName} respondió: “${item.answer}”`));
    els.judgmentTimeline.innerHTML = records.map(item => `<li>${escapeHTML(item)}</li>`).join("");
    els.judgmentVoteGrid.innerHTML = PLAYERS.map(player => `<button type="button" class="vote-card" data-judgment-vote="${player.id}" style="--avatar:${player.color}"><span class="vote-face">${player.initials}</span><span>${player.name}</span><small>${escapeHTML(state.socialProfiles[player.id].label)}</small></button>`).join("");
    els.judgmentVoteGrid.querySelectorAll("button").forEach(button => button.addEventListener("click", () => resolveJudgment(button.dataset.judgmentVote)));
    els.judgmentDialog.showModal();
  }

  function resolveJudgment(humanVote) {
    const votes = [humanVote, ...PLAYERS.filter(player => !player.human).map(bot => botVote(bot))];
    const counts = votes.reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
    const targetId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    const scammer = PLAYERS.find(player => state.roles[player.id] === "Estafador");
    els.judgmentDialog.close();
    if (state.roles[targetId] === "Estafador") endGame("barrio", "judgment-correct", scammer);
    else {
      const accompliceSurplus = state.roles[targetId] === "Cómplice" ? episodeUnexplained(targetId) : 0;
      if (state.roles[targetId] === "Cómplice" && accompliceSurplus >= ECONOMY_CONFIG.surplusThreshold) {
        state.falseTarget = PLAYERS.find(player => player.id === targetId);
        endGame("estafador", "false-close", scammer);
      } else endGame("estafador", "judgment-failed", scammer);
    }
  }

  function nextStep() {
    if (state.gameOver) return;
    if (state.completed >= state.scenarios.length) appendRound();
    state.scenarioIndex += 1;
    state.progress = 0;
    renderScenario();
  }

  function startTimer(reset = true) {
    stopTimer();
    if (reset) state.timer = DECISION_SECONDS;
    paintTimer();
    state.timerId = window.setInterval(() => {
      state.timer -= 1;
      paintTimer();
      if (state.timer <= 0) {
        stopTimer();
        const scenario = state.scenarios[state.scenarioIndex];
        const impulsive = scenario.actions.find(item => item.stance === "approve");
        resolveAction(impulsive, true);
      }
    }, 1000);
  }

  function startDayClock() {
    if (state.dayTimerId) return;
    if (!state.dayStartedAt) {
      state.dayTimer = DEBUG_DAY_SECONDS;
      state.dayStartedAt = Date.now();
      state.dayExpired = false;
      state.storiesReady = false;
      state.debugTrace.push({ event: "day-started", duration: DEBUG_DAY_SECONDS, at: state.dayStartedAt });
    }
    paintDayClock();
    state.dayTimerId = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - state.dayStartedAt) / 1000);
      state.dayTimer = Math.max(0, DEBUG_DAY_SECONDS - elapsed);
      paintDayClock();
      if (state.dayTimer <= 0) {
        stopDayClock();
        state.dayExpired = true;
        state.debugTrace.push({ event: "day-expired", storiesReady: state.storiesReady, botMissionsDone: completedBotMissionCount(currentRound()), at: Date.now() });
        refreshDinnerGate("clock-expired");
      }
    }, 250);
  }

  function stopDayClock() { if (state.dayTimerId) window.clearInterval(state.dayTimerId); state.dayTimerId = null; }
  function resetDayClockForRound() {
    stopDayClock();
    state.dayTimer = DEBUG_DAY_SECONDS;
    state.dayStartedAt = 0;
    state.dayExpired = false;
    state.storiesReady = false;
    els.meetingButton.disabled = true;
    els.meetingButton.classList.remove("is-ready", "is-waiting-human");
    els.meetingButtonLabel.textContent = "ESPERANDO AL BARRIO";
    paintDayClock();
    state.debugTrace.push({ event: "round-clock-reset", round: currentRound() + 1, at: Date.now() });
  }
  function formatClock(seconds) {
    const safe = Math.max(0, Math.ceil(seconds || 0));
    return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
  }
  function completedBotMissionCount(round) {
    return PLAYERS.filter(player => {
      if (player.human) return false;
      const resolution = roundRecord(player.id, round)?.missionResolution;
      return Boolean(resolution && resolution !== "pending");
    }).length;
  }
  function dinnerGateStatus({
    storiesReady = state.storiesReady,
    botMissionsDone = completedBotMissionCount(currentRound()) === PLAYERS.filter(player => !player.human).length,
    botRoutesPending = state.debugRequiredRoute || [...Object.values(state.movement.activeBotRoute), ...Object.values(state.movement.botRouteQueues).flat()]
      .some(job => job && ["agenda", "story", "counterpart", "settlement", "encounter"].includes(job.purpose)),
    humanReason = state.missionAtmRequirement ? "human-atm"
      : state.delegatedPayoutRequirement ? "human-payout"
      : state.pendingEncounter || state.pendingPayout || state.pendingConfrontation ? "human-encounter"
      : state.humanAgenda ? "human-mission"
      : null
  } = {}) {
    if (!storiesReady) return { available: false, ready: false, reason: "waiting-stories" };
    if (!botMissionsDone) return { available: false, ready: false, reason: "waiting-bots" };
    if (botRoutesPending) return { available: false, ready: false, reason: "waiting-routes" };
    if (humanReason) return { available: true, ready: false, reason: humanReason };
    return { available: true, ready: true, reason: "ready" };
  }
  function refreshDinnerGate(source) {
    if (state.gameOver || els.meetingDialog.open) {
      els.meetingButton.disabled = true;
      els.meetingButton.classList.remove("is-ready", "is-waiting-human");
      return;
    }
    const gate = dinnerGateStatus();
    els.meetingButton.disabled = !gate.available;
    els.meetingButton.classList.toggle("is-ready", gate.ready);
    els.meetingButton.classList.toggle("is-waiting-human", gate.available && !gate.ready);
    els.meetingButtonLabel.textContent = gate.ready ? "A COMER" : gate.available ? "CERRÁ TU MANDADO" : "ESPERANDO AL BARRIO";
    if (source === "stories-ready" && !gate.available) toast("Los cuatro movimientos terminaron. Falta que el barrio cierre sus mandados.");
    else if (source === "bot-mission" && gate.available) toast(gate.ready ? "El barrio terminó. Podés ir a comer cuando quieras." : "El barrio terminó. Cerrá tu mandado y después decidís cuándo ir a comer.");
    else if (source === "clock-expired" && !gate.available) toast("Son las 20:30, pero todavía quedan movimientos por cerrar.");
  }
  function paintDayClock() {
    const safe = Math.max(0, state.dayTimer);
    els.timerValue.textContent = formatClock(safe);
    els.timer.classList.toggle("is-low", safe <= 30);
  }

  function stopTimer() { if (state.timerId) window.clearInterval(state.timerId); state.timerId = null; }
  function paintTimer() {
    const safeTime = Math.max(0, state.timer);
    els.timerValue.textContent = formatClock(safeTime);
    els.timer.classList.toggle("is-low", state.timer <= 10);
  }

  function updateMeters() {
    els.securityValue.textContent = state.security;
    els.trustValue.textContent = state.trust;
    els.progressValue.textContent = `${state.progress}%`;
    els.securityMeter.style.width = `${state.security}%`;
    els.trustMeter.style.width = `${state.trust}%`;
    els.progressMeter.style.width = `${state.progress}%`;
    if (state.roles.nico === "Estafador") els.roleProgress.textContent = `INTENTOS ${state.fraudExecutions.length} · ÉXITOS ${state.fraudExecutions.filter(item => item.status === "successful").length}`;
    else if (state.roles.nico === "Verificador") els.roleProgress.textContent = "2 PREGUNTAS POR MESA";
    else if (state.roles.nico === "Cómplice") els.roleProgress.textContent = `TRATOS ${state.accompliceDeals.filter(item => item.episodeId === state.campaign.episodeNumber && item.accompliceId === "nico").length} · EXCEDENTE ${formatMoney(episodeUnexplained("nico"))}`;
    else {
      const completedMissions = Object.values(state.roundRecords).filter(records => records.nico?.missionCompleted).length;
      els.roleProgress.textContent = `MANDADOS ${completedMissions}/3 · ${publicBand("nico").toUpperCase()}`;
    }
  }

  function endGame(winner, reason, discoveredPlayer) {
    state.gameOver = true;
    stopTimer();
    stopDayClock();
    els.actionCards.querySelectorAll("button").forEach(button => { button.disabled = true; });
    if (els.meetingDialog.open) els.meetingDialog.close();
    const humanRole = state.roles.nico;
    const humanScammer = humanRole === "Estafador";
    const humanAccomplice = humanRole === "Cómplice";
    const playerWon = humanScammer ? winner === "estafador" : humanAccomplice ? winner === "estafador" && reason !== "false-close" : winner === "barrio";
    const barrioWon = reason === "scammer-discovered" || reason === "judgment-correct";
    els.resultFlag.textContent = reason === "false-close" ? "EL BARRIO CERRÓ EN FALSO" : barrioWon
      ? (humanScammer ? "TE DESCUBRIÓ LA MESA" : "ESTAFADOR DESCUBIERTO")
      : (humanScammer ? "GANASTE COMO ESTAFADOR" : "GANÓ EL ESTAFADOR");
    els.resultFlag.classList.toggle("loss", !playerWon);
    if (reason === "false-close") {
      els.resultTitle.textContent = `${state.falseTarget?.name || "El Cómplice"} quedó como chivo expiatorio.`;
      els.resultSummary.textContent = `${discoveredPlayer.name} era el verdadero Estafador. El excedente cerró el caso demasiado pronto y el replay muestra quién preparó, delegó y movió la plata.`;
    } else if (barrioWon) {
      els.resultTitle.textContent = humanScammer ? "Tus historias se tocaron entre sí." : `${discoveredPlayer.name} era quien movía los hilos.`;
      els.resultSummary.textContent = humanScammer
        ? `${reason === "judgment-correct" ? "El juicio comparó tus coartadas y encontró el hueco." : "La auditoría encontró una maniobra que ejecutaste."} La partida termina acá.`
        : `${reason === "judgment-correct" ? "Las respuestas, testigos y horarios permitieron reconstruir el recorrido." : "La auditoría encontró una operación ejecutada en esta ronda."}`;
    } else {
      els.resultTitle.textContent = humanScammer ? "Tu coartada aguantó el juicio." : `${discoveredPlayer.name} los cagó y quedó impune.`;
      els.resultSummary.textContent = humanScammer
        ? "Mezclaste mandados reales con preparativos y la mesa acusó a otra persona."
        : `${discoveredPlayer.name}, ${state.socialProfiles[discoveredPlayer.id].label}, escondió la maniobra detrás de tareas públicas reales. Ahora se revela el recorrido completo.`;
    }
    els.finalSecurity.textContent = state.security;
    els.finalTrust.textContent = state.trust;
    els.finalTasks.textContent = `${state.completed}/12`;
    els.roleReveal.innerHTML = PLAYERS.map(player => `<div class="role-chip">${player.name}<span>${state.roles[player.id]} · ${escapeHTML(state.socialProfiles[player.id].label)}</span>${state.roles[player.id] === "Cómplice" ? `<small>Motivo: ${escapeHTML(state.motivations[player.id])}</small>` : ""}</div>`).join("");
    const scammerId = discoveredPlayer?.id || PLAYERS.find(player => state.roles[player.id] === "Estafador")?.id;
    const scammerRecords = Object.values(state.roundRecords).map(records => records[scammerId]).filter(Boolean);
    const firstMission = scammerRecords.find(record => record?.publicMission);
    const preparation = scammerRecords.map(record => record.hiddenPreparation).find(Boolean) || state.inventories[scammerId]?.find(item => item.preparedEpisode === state.campaign.episodeNumber);
    const deal = state.accompliceDeals.filter(item => item.episodeId === state.campaign.episodeNumber && item.scammerId === scammerId).at(-1);
    const execution = state.fraudExecutions.filter(item => item.status === "successful").at(-1);
    const replayBeats = [
      firstMission ? `<li><strong>1 · ACTIVIDAD LEGÍTIMA</strong>${escapeHTML(PLAYERS.find(player => player.id === scammerId).name)} hizo “${escapeHTML(firstMission.publicMission.text)}”. Ese hecho era real.</li>` : "",
      preparation ? `<li><strong>2 · PREPARACIÓN</strong>Detrás del mandado apareció ${escapeHTML(preparation.label)}. Preparar todavía no era estafar.</li>` : `<li><strong>2 · COBERTURA</strong>No hubo un recurso nuevo: se apoyó en movimientos que ya existían.</li>`,
      deal ? `<li><strong>3 · PACTO CON EL CÓMPLICE</strong>${deal.delegated ? "El recurso quedó encargado." : "El Estafador se quedó con el control."} En el encuentro posterior declaró ${formatMoney(deal.reportedAmount || 0)} y ofreció ${Math.round((deal.offeredShare || 0) * 100)}%.</li>` : `<li><strong>3 · EJECUCIÓN PROPIA</strong>No necesitó involucrar a otra persona.</li>`,
      deal ? `<li><strong>4 · REPARTO</strong>Se movieron ${formatMoney(deal.paid)} y quedaron ${formatMoney(deal.retained)} en su lado. ${deal.truthfulness === "truth" ? "La versión coincidía con el monto real." : "La explicación escondía parte del recorrido."}</li>` : execution ? `<li><strong>4 · MANIOBRA</strong>${escapeHTML(execution.method)} ${execution.status === "successful" ? `Movió ${formatMoney(execution.amount)}.` : "Quedó bloqueada."}</li>` : `<li><strong>4 · SIN PÉRDIDA</strong>No llegó a ejecutarse una maniobra exitosa.</li>`,
      `<li><strong>5 · VEREDICTO</strong>${reason === "false-close" ? `El barrio señaló a ${escapeHTML(state.falseTarget?.name || "otra persona")}; ${escapeHTML(discoveredPlayer.name)} quedó libre.` : barrioWon ? `La mesa reconstruyó el recorrido y encontró a ${escapeHTML(discoveredPlayer.name)}.` : `${escapeHTML(discoveredPlayer.name)} sobrevivió al juicio.`}</li>`
    ].filter(Boolean);
    els.replayList.innerHTML = replayBeats.join("");
    const scammerRecord = Object.values(state.roundRecords).map(records => records[discoveredPlayer?.id]).filter(Boolean);
    const preparations = scammerRecord.map(record => record.hiddenPreparation?.label).filter(Boolean);
    els.finalTip.textContent = humanScammer
      ? `Fraudes ejecutados: ${state.fraudProgress}. Preparativos: ${preparations.join("; ") || "usaste sólo cobertura social"}.`
      : `Cómo lo armó: ${preparations.join("; ") || "aprovechó operaciones cotidianas y una coartada parcial"}.`;
    if (!els.resultDialog.open) {
      els.resultDialog.showModal();
      els.resultDialog.scrollTop = 0;
      els.resultFlag.focus({ preventScroll: true });
    }
    saveCampaign();
    state.transport.send("game:ended", { winner, reason, discoveredPlayerId: discoveredPlayer?.id, security: state.security, trust: state.trust });
  }

  function speakAmbient(playerId, message, duration = 2400) {
    const walker = document.querySelector(`[data-player="${playerId}"]`);
    if (!walker) return;
    state.debugTrace.push({ event: "ambient-speech", playerId, message, at: Date.now() });
    walker.querySelector(".speech-bubble").textContent = message;
    walker.classList.add("is-speaking");
    window.clearTimeout(walker.speechTimer);
    walker.speechTimer = window.setTimeout(() => walker.classList.remove("is-speaking"), duration);
  }

  function speak(playerId, message, intention = "comment", scenarioId = state.scenarios[state.scenarioIndex]?.id) {
    const player = PLAYERS.find(person => person.id === playerId);
    if (!player) return;
    recordDialogue(player, message, intention, scenarioId);
    const walker = document.querySelector(`[data-player="${playerId}"]`);
    if (!walker) return;
    walker.querySelector(".speech-bubble").textContent = message;
    walker.classList.add("is-speaking");
    const peek = walker.querySelector(".dialogue-peek");
    if (peek) peek.hidden = false;
    window.clearTimeout(walker.speechTimer);
    walker.speechTimer = window.setTimeout(() => walker.classList.remove("is-speaking"), 2600);
  }

  function recordDialogue(player, message, intention = "comment", scenarioId = state.scenarios[state.scenarioIndex]?.id) {
    const current = state.scenarios[state.scenarioIndex];
    const scenario = state.scenarios.find(item => item.id === scenarioId && item.round === current?.round) || current;
    const previous = state.dialogueLog[state.dialogueLog.length - 1];
    if (previous && previous.playerId === player.id && previous.text === message && previous.intention === intention && Date.now() - previous.time < 2500) return previous;
    const humanPos = state.movement.positions.nico;
    const speakerPos = state.movement.positions[player.id];
    const heard = player.id === "nico" || Boolean(humanPos && speakerPos && Math.hypot(humanPos.x - speakerPos.x, humanPos.y - speakerPos.y) <= HEARING_RADIUS);
    const entry = {
      playerId: player.id, playerName: player.name, scenarioId, scenarioTitle: scenario?.title || "Sobremesa",
      text: message, round: scenario?.round ?? Math.max(0, state.roundNumber - 1), intention,
      order: state.dialogueLog.length + 1, time: Date.now(), heard
    };
    state.dialogueLog.push(entry);
    if (heard) {
      addFeed(player, message);
      state.observations.push({ id: makeId("obs"), observerId: "nico", participants: [player.id], location: nearestLocationName(speakerPos), round: entry.round, kind: "overheard", text: message, reliability: 1 });
      document.querySelectorAll(`[data-dialogue-player="${player.id}"]`).forEach(button => { button.hidden = false; });
      state.transport.send("conversation:overheard", { observerId: "nico", speakerId: player.id, round: entry.round, location: nearestLocationName(speakerPos) });
    }
    state.transport.send("dialogue:spoken", { playerId: player.id, scenarioId, round: entry.round, order: entry.order });
    return entry;
  }

  function dialoguesFor(playerId) {
    const round = state.scenarios[state.scenarioIndex]?.round ?? Math.max(0, state.roundNumber - 1);
    return state.dialogueLog.filter(entry => entry.playerId === playerId && entry.round === round && entry.heard).slice(-3);
  }

  function nearestLocationName(position) {
    if (!position) return "barrio";
    return Object.entries(LOCATION_POINTS).sort((a, b) => Math.hypot(position.x - a[1][0], position.y - a[1][1]) - Math.hypot(position.x - b[1][0], position.y - b[1][1]))[0]?.[0] || "barrio";
  }

  function toggleDialogueNote(button) {
    const playerId = button.dataset.dialoguePlayer;
    const player = PLAYERS.find(person => person.id === playerId);
    if (!player) return;
    const walker = button.closest(".walker");
    if (!walker) return;
    const willOpen = els.dialogueNote.hidden;
    closeDialogueNotes();
    if (!willOpen) return;
    const entries = dialoguesFor(playerId);
    els.dialogueNote.innerHTML = `<strong>${player.name}</strong>${entries.map(entry => {
      const time = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" }).format(new Date(entry.time));
      return `<p><small>#${entry.order} · ${time}</small><em>${escapeHTML(entry.scenarioTitle)}</em>${escapeHTML(entry.text)}</p>`;
    }).join("") || "<p>Todavía no habló en esta ronda.</p>"}`;
    const rect = walker.getBoundingClientRect();
    const mapRect = els.villageMap.getBoundingClientRect();
    const left = Math.max(8, Math.min(rect.left - mapRect.left, els.villageMap.clientWidth - 200));
    const top = rect.top - mapRect.top - 10;
    els.dialogueNote.style.left = `${left}px`;
    els.dialogueNote.style.top = `${top}px`;
    els.dialogueNote.hidden = false;
    button.setAttribute("aria-expanded", "true");
  }

  function closeDialogueNotes() {
    els.dialogueNote.hidden = true;
    document.querySelectorAll("[data-dialogue-player]").forEach(button => button.setAttribute("aria-expanded", "false"));
  }

  function addFeed(player, message) {
    const item = document.createElement("div");
    item.className = "feed-item";
    const time = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" }).format(new Date());
    item.innerHTML = `<span class="feed-avatar" style="--avatar:${player.color}">${player.initials}</span><div class="feed-text"><time>${time}</time><strong>${player.name}</strong>${escapeHTML(message)}</div>`;
    els.eventFeed.append(item);
    els.eventFeed.scrollTop = els.eventFeed.scrollHeight;
  }

  function addSystemFeed(message) {
    const item = document.createElement("div");
    item.className = "feed-item system";
    item.innerHTML = `<div class="feed-text">— ${escapeHTML(message)} —</div>`;
    els.eventFeed.append(item);
    els.eventFeed.scrollTop = els.eventFeed.scrollHeight;
  }

  function creditEpisodeIncome() {
    PLAYERS.forEach(player => {
      const account = state.campaign.economy[player.id];
      if (account.pendingJob) {
        account.employment = account.pendingJob.employment;
        account.grossSalary = account.pendingJob.grossSalary;
        account.weeklyAvailable = account.pendingJob.weeklyAvailable;
        delete account.pendingJob;
      }
      const amount = account.weeklyAvailable || ECONOMY_CONFIG.weeklyAvailable;
      account.bank += amount;
      const transaction = {
        id: makeId("tx"), campaignId: state.campaign.campaignId, episodeId: state.campaign.episodeNumber,
        roundId: -1, fromId: "empleo", toId: player.id, amount, channel: "bank",
        label: "Ingreso disponible entre partidas", visibleLabel: "Ingreso del período", legitimate: true, assetId: null, createdAt: Date.now()
      };
      state.campaign.transactions.push(transaction);
      state.transport.send("economy:salary-credited", { transactionId: transaction.id, playerId: player.id, amount, episodeId: state.campaign.episodeNumber });
    });
  }

  function clearEpisodeState() {
    stopTimer(); stopDayClock();
    const episodeToken = (state.episodeToken || 0) + 1;
    state.isEpisodeResetting = true;
    Object.assign(state, {
    security: 68, trust: 64, progress: 0, scenarioIndex: 0, completed: 0, currentResolved: false, transitionPending: false,
      timer: DECISION_SECONDS, timerId: null, dayTimer: DEBUG_DAY_SECONDS, dayTimerId: null, dayStartedAt: 0, dayExpired: false, storiesReady: false, roles: {}, scenarios: [], roundStories: [], decisions: [],
      ignoredSignals: [], audited: new Set(), suspicion: {}, scammerFrozen: false, scamAttempts: 0, scamScore: 0,
      meetings: 0, roundNumber: 0, templateQueue: [], dialogueLog: [], questionsRemaining: 0,
      questionedPlayers: new Set(), currentInterrogation: null, fraudProgress: 0, gameOver: false, accompliceFrozen: false,
      socialProfiles: {}, motivations: {}, roundRecords: {}, pendingMissionPair: [], selectedMission: null,
      selectedStrategy: null, selectedMissionAction: null, selectedMissionOption: null, selectedPreparation: null, selectedDelegation: "keep", pendingAlibi: null,
      fraudOccurred: false, pendingJudgment: false, judgmentHistory: [], inventories: {}, fraudExecutions: [], opportunityByScenario: {},
      pendingPayout: null, pendingEncounter: null, pendingConfrontation: null, falseClosing: false, falseTarget: null,
      botMissionRounds: new Set(), agendas: {}, humanAgenda: null, errandSlip: { visible: true, missionId: null, stepIndex: 0, savedAt: Date.now() }, activeCounterpart: null, observations: [], gossip: null,
      animals: [], residues: [], lastAnimalTick: 0, lastAnimalTextTime: 0,
      dirtyShoe: { active: false, incidentId: 0, until: 0, nearbyBots: {} },
      atmUI: { open: false, mode: "free" }, freeAtmSession: { origin: null, withdrawn: 0 },
      missionAtmRequirement: null, delegatedPayoutRequirement: null, mapExpanded: false, lastDinnerGateRefresh: 0, debugRequiredRoute: false,
      debugTrace: [], episodeToken, isEpisodeResetting: true
    });
    state.accompliceDeals = state.campaign.deals;
    state.movement.path = [];
    state.movement.activeBotRoute = {};
    state.movement.botRouteQueues = {};
    botRouteCallbacks.clear();
    state.movement.keys.clear();
    state.movement.positions = {};
    state.movement.camera = { x: 0, y: 0 };
    state.movement.objective = null;
    state.movement.arrivalCallback = null;
    state.movement.nearLocation = null;
    state.movement.lastTime = 0;
    PLAYERS.forEach((player, index) => {
      state.campaign.positions[player.id] = { x: SPAWN_POINTS[index][0], y: SPAWN_POINTS[index][1] };
    });
    [els.resultDialog, els.roleDialog, els.missionDialog, els.alibiDialog, els.judgmentDialog, els.meetingDialog, els.payoutDialog, els.profileDialog, els.pocketDialog, els.atmDialog]
      .forEach(dialog => { if (dialog?.open) dialog.close(); });
    els.objectiveMarker.hidden = true;
    els.interactionPrompt.hidden = true;
    els.errandSlip.classList.remove("is-saved");
    updateErrandSlip();
    els.eventFeed.innerHTML = "";
    if (els.animalsLayer) els.animalsLayer.innerHTML = "";
    if (els.residueLayer) els.residueLayer.innerHTML = "";
  }

  function startEpisode(message) {
    clearEpisodeState();
    assignRoles();
    buildScenarioDeck();
    renderPlayers();
    initAnimals();
    scheduleBotMissions(0);
    updateMeters();
    renderInventory();
    renderScenario();
    addSystemFeed(message);
    saveCampaign();
    state.isEpisodeResetting = false;
    window.setTimeout(openRolePaper, 150);
    if (DEBUG_MODE) window.setTimeout(runSelfChecks, 0);
  }

  function resetGame() {
    state.campaign.episodeNumber += 1;
    creditEpisodeIncome();
    startEpisode(`Partida ${state.campaign.episodeNumber} · se acreditaron los ingresos del período y se sortearon roles nuevos`);
  }

  function newCampaign() {
    if (!window.confirm("¿Empezar una campaña desde cero? Se borran saldos, bienes, relaciones y preparativos guardados.")) return;
    localStorage.removeItem(ECONOMY_CONFIG.storageKey);
    state.campaign = null;
    state.campaign = createCampaign();
    state.accompliceDeals = state.campaign.deals;
    startEpisode("Nueva campaña · todos arrancan con $30.000 y un kit de oficio");
  }

  function openRolePaper() {
    if (els.roleDialog.open || state.selectedMission || state.dayStartedAt || state.isEpisodeResetting) return;
    stopTimer();
    els.roleDialog.showModal();
  }

  function toast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    window.clearTimeout(els.toast.timer);
    els.toast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 2800);
  }

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }

  function debugSnapshot() {
    const agenda = state.humanAgenda;
    const account = state.campaign?.economy?.nico;
    const round = currentRound();
    let phase = "mission";
    if (state.gameOver) phase = "result";
    else if (els.meetingDialog?.open) phase = "meeting";
    else if (els.judgmentDialog?.open) phase = "judgment";
    else if (state.dayStartedAt) phase = "day";
    return {
      phase,
      round, scenarioIndex: state.scenarioIndex, completed: state.completed, gameOver: state.gameOver,
      episodeNumber: state.campaign?.episodeNumber,
      roles: { ...state.roles },
      meetingPhase: state.meetingPhase, questionsRemaining: state.questionsRemaining, questionedPlayers: [...state.questionedPlayers], botQuestionCompleted: state.botQuestionCompleted,
      players: PLAYERS.map(p => ({ id: p.id, name: p.name, human: p.human })),
      dialogueLog: state.dialogueLog.map(e => ({ playerId: e.playerId, playerName: e.playerName, text: e.text, intention: e.intention })),
      ambientTrace: state.debugTrace.filter(entry => entry.event === "ambient-speech").map(entry => ({ playerId: entry.playerId, message: entry.message, at: entry.at })),
      dinner: dinnerGateStatus(),
      dirtyShoe: {
        active: state.dirtyShoe.active,
        incidentId: state.dirtyShoe.incidentId,
        until: state.dirtyShoe.until,
        nearbyBots: { ...state.dirtyShoe.nearbyBots }
      },
      inventory: (state.inventories.nico || []).map(resource => ({ executionId: resource.executionId, type: resource.type, status: resource.status, availableFromRound: resource.availableFromRound })),
      economy: account ? { bank: account.bank, cash: account.cash, employment: account.employment, pendingJob: account.pendingJob || null } : null,
      agenda: agenda ? { missionId: agenda.mission.id, optionId: agenda.option.id, index: agenda.index, steps: agenda.steps.map(step => ({ id: step.id, location: cleanLocation(step.location), kind: step.kind, status: step.status })) } : null,
      atm: {
        open: state.atmUI.open,
        mode: state.atmUI.mode,
        requiredCash: state.missionAtmRequirement?.requiredCash || state.delegatedPayoutRequirement?.requiredCash || 0,
        pending: Boolean(state.missionAtmRequirement || state.delegatedPayoutRequirement),
        withdrawn: state.missionAtmRequirement?.withdrawn || state.delegatedPayoutRequirement?.withdrawn || state.freeAtmSession.withdrawn || 0
      },
      movement: {
        position: { ...state.movement.positions.nico },
        camera: { ...state.movement.camera },
        objective: state.movement.objective ? { x: state.movement.objective.x, y: state.movement.objective.y, location: state.movement.objective.location } : null,
        activeRoutes: Object.keys(state.movement.activeBotRoute).length,
        queuedRoutes: Object.values(state.movement.botRouteQueues).reduce((sum, queue) => sum + queue.length, 0),
        routeJobs: [
          ...Object.values(state.movement.activeBotRoute).filter(Boolean).map(job => ({ id: job.id, playerId: job.playerId, purpose: job.purpose, priority: job.priority, status: job.status })),
          ...Object.values(state.movement.botRouteQueues).flat().map(job => ({ id: job.id, playerId: job.playerId, purpose: job.purpose, priority: job.priority, status: job.status }))
        ]
      },
      ui: {
        dialogsOpen: { mission: els.missionDialog?.open || false, meeting: els.meetingDialog?.open || false, result: els.resultDialog?.open || false, atm: els.atmDialog?.open || false },
        currentResolved: state.currentResolved,
        clockRunning: Boolean(state.timerId || state.dayTimerId),
        continueVisible: !els.continueButton?.disabled
      },
      encounters: state.accompliceDeals.map(deal => ({ id: deal.id, briefed: Boolean(deal.briefed), state: deal.encounterState || "pending", offeredShare: deal.offeredShare, dialogueKeys: [...(deal.dialogueKeys || [])] }))
    };
  }

  function debugMissionById(missionId, optionId, strategy = "cover", preparationId = null, delegation = "keep") {
    let mission = null;
    for (const [scenarioId, items] of Object.entries(MISSION_LIBRARY)) {
      const found = items.find(item => item.id === missionId);
      if (found) { mission = { ...found, scenarioId }; break; }
    }
    if (!mission) throw new Error(`Mandado de depuración inexistente: ${missionId}`);
    state.pendingMissionPair = [mission];
    state.selectedMission = null;
    if (els.roleDialog.open) els.roleDialog.close();
    openMissionDialog();
    chooseMission(0);
    const optionIndex = missionOptions(mission).findIndex(item => item.id === optionId);
    if (optionIndex < 0) throw new Error(`Opción de depuración inexistente: ${optionId}`);
    chooseMissionAction(optionIndex);
    if (state.roles.nico === "Estafador") {
      chooseStrategy(strategy);
      if (preparationId) {
        const selectedId = strategy === "seek"
          ? (state.inventories.nico.find(resource => resource.executionId === preparationId || resource.type === preparationId)?.executionId || preparationId)
          : preparationId;
        choosePreparation(selectedId);
      }
      if (strategy === "prepare") chooseDelegation(delegation);
    }
    confirmMission();
    return debugSnapshot();
  }

  function debugArriveAtCurrentStep() {
    const step = state.humanAgenda?.steps[state.humanAgenda.index];
    if (!step) return debugSnapshot();
    const [x, y] = locationPoint(step.location);
    state.movement.positions.nico = { x, y };
    updateCamera(true);
    checkArrival(true);
    return debugSnapshot();
  }

  function debugInteractCurrentStep() {
    const pending = state.activeCounterpart;
    if (pending?.playerId && state.movement.positions.nico) {
      state.movement.positions[pending.playerId] = { ...state.movement.positions.nico };
      paintWalker(pending.playerId, 0, 0, false);
      if (!pending.available) {
        pending.available = true;
        const step = state.humanAgenda?.steps[state.humanAgenda.index];
        if (step && step.status === "waiting-counterpart") step.status = "ready-to-interact";
      }
    }
    interactNearby();
    return debugSnapshot();
  }

  function debugExerciseDealDeduplication() {
    const accomplice = PLAYERS.find(player => player.id !== "nico");
    const deal = { id: makeId("debug-deal"), scammerId: "nico", accompliceId: accomplice.id, dialogueKeys: [] };
    const line = "Le ofrecí 0% al Cómplice: la plata queda para preparar la próxima vuelta.";
    recordDealDialogueOnce(deal, "delegation-zero-excuse", PLAYERS.find(player => player.id === "nico"), line, "delegation-zero-excuse");
    recordDealDialogueOnce(deal, "delegation-zero-excuse", PLAYERS.find(player => player.id === "nico"), line, "delegation-zero-excuse");
    return { keys: [...deal.dialogueKeys], matches: state.dialogueLog.filter(item => item.text === line).length };
  }

  function debugForceAnimalSound(species) {
    const animal = state.animals.find(item => item.species === species);
    if (!animal || !["dog", "cat"].includes(species)) return debugSnapshot();
    animal.action = species === "dog" ? "bark" : "meow";
    const node = els.animalsLayer.querySelector(`[data-animal="${animal.id}"]`);
    if (node) {
      node.className = `world-animal ${animal.species} ${animal.variant} action-${animal.action}`;
    }
    showAnimalSound(animal, species === "dog" ? "¡guau!" : "¡miau!");
    return debugSnapshot();
  }

  function debugForceDirtyShoe() {
    activateDirtyShoe();
    els.playersLayer.querySelector('[data-player="nico"]')?.classList.add("stepped-poop");
    return debugSnapshot();
  }

  function debugDirtyShoeApproach(playerId, { distance = 90, roll = 1 } = {}) {
    const human = state.movement.positions.nico;
    const bot = PLAYERS.find(player => player.id === playerId && !player.human);
    if (!human || !bot) return { ...debugSnapshot(), triggered: false };
    const ambientBefore = state.debugTrace.filter(entry => entry.event === "ambient-speech").length;
    PLAYERS.filter(player => !player.human).forEach((player, index) => {
      state.movement.positions[player.id] = { x: human.x + 260 + index * 12, y: human.y + 220 };
      paintWalker(player.id, 0, 0, false);
    });
    state.movement.positions[bot.id] = { x: human.x + Number(distance || 0), y: human.y };
    paintWalker(bot.id, 0, 0, false);
    const forcedRolls = Object.fromEntries(PLAYERS.filter(player => !player.human).map(player => [player.id, player.id === bot.id ? Number(roll) : 1]));
    updateDirtyShoeReactions(human, forcedRolls);
    const ambientAfter = state.debugTrace.filter(entry => entry.event === "ambient-speech").length;
    return { ...debugSnapshot(), triggered: ambientAfter > ambientBefore };
  }

  function debugConfigureDinner({ storiesReady = true, botsDone = true, humanPending = false, requiredRoute = false, dayExpired = false } = {}) {
    const round = currentRound();
    state.storiesReady = Boolean(storiesReady);
    state.dayExpired = Boolean(dayExpired);
    state.debugRequiredRoute = Boolean(requiredRoute);
    state.movement.activeBotRoute = {};
    state.movement.botRouteQueues = {};
    PLAYERS.filter(player => !player.human).forEach(player => {
      const record = roundRecord(player.id, round);
      record.missionResolution = botsDone ? "completed" : "pending";
    });
    if (requiredRoute) {
      const bot = PLAYERS.find(player => !player.human);
      state.movement.activeBotRoute[bot.id] = {
        id: "debug-required-route",
        playerId: bot.id,
        purpose: "agenda",
        priority: ROUTE_PRIORITY.agenda,
        status: "walking"
      };
    }
    state.missionAtmRequirement = null;
    state.delegatedPayoutRequirement = null;
    state.pendingEncounter = null;
    state.pendingPayout = null;
    state.pendingConfrontation = null;
    state.humanAgenda = humanPending ? {
      mission: { id: "debug-mission", text: "Mandado pendiente" },
      option: { id: "debug-option" },
      index: 0,
      steps: [{ id: "debug-step", stableId: "debug-step", location: "plaza", kind: "regular", status: "pending" }]
    } : null;
    if (els.roleDialog?.open) els.roleDialog.close();
    if (els.missionDialog?.open) els.missionDialog.close();
    refreshDinnerGate("debug");
    return debugSnapshot();
  }

  function publishDebugApi(checks = {}) {
    if (!DEBUG_MODE) return;
    window.ChamuyoDebug = {
      checks,
      snapshot: debugSnapshot,
      economy: ECONOMY_CONFIG,
      dinnerGateStatus,
      geometry: WORLD_GEOMETRY,
      colliders: WORLD_COLLIDERS,
      findPath: (sx, sy, ex, ey) => findPath({ x: sx, y: sy }, [ex, ey]),
      footprintRects,
      actions: {
        resetEpisode: resetGame,
        startMission: debugMissionById,
        arriveAtCurrentStep: debugArriveAtCurrentStep,
        interactCurrentStep: debugInteractCurrentStep,
        withdraw: amount => {
          if (!els.atmDialog.open) openATMForAgenda(null, null);
          completeATMWithdrawal(amount);
          return debugSnapshot();
        },
        exerciseDealDeduplication: debugExerciseDealDeduplication,
        exerciseRoutePriorities: () => {
          const playerId = PLAYERS.find(player => !player.human)?.id;
          cancelBotRoutes(playerId);
          const fired = [];
          enqueueBotRoute(playerId, "oficina", { purpose: "agenda", stableKey: "debug-agenda", callback: () => fired.push("agenda") });
          enqueueBotRoute(playerId, "banco", { purpose: "story", stableKey: "debug-story", callback: () => fired.push("story") });
          enqueueBotRoute(playerId, "plaza", { purpose: "counterpart", stableKey: "debug-counterpart", callback: () => fired.push("counterpart") });
          enqueueBotRoute(playerId, "plaza", { purpose: "counterpart", stableKey: "debug-counterpart", callback: () => fired.push("duplicate") });
          return { playerId, fired, snapshot: debugSnapshot() };
        },
        advanceClock: () => { state.dayExpired = true; state.storiesReady = true; refreshDinnerGate("debug"); return debugSnapshot(); },
        forceAnimalTick: () => { state.lastAnimalTick = 0; return debugSnapshot(); },
        forceAnimalSound: debugForceAnimalSound,
        forceDirtyShoe: debugForceDirtyShoe,
        dirtyShoeApproach: debugDirtyShoeApproach,
        configureDinner: debugConfigureDinner,
        openMeetingWhenReady: () => { const gate = dinnerGateStatus(); if (gate.ready) openMeeting(); return debugSnapshot(); },
        setupVerification: () => { setupVerification(); return debugSnapshot(); },
        selectInterviewPlayer: playerId => { selectInterviewPlayer(playerId); return debugSnapshot(); },
        askVerifierQuestion: index => { askVerifierQuestion(index); return debugSnapshot(); },
        finishVerification: () => { finishVerification(); return debugSnapshot(); },
        recordDialogue: (playerData, text, intention) => {
          const player = PLAYERS.find(p => p.id === (playerData?.id || playerData));
          if (player) recordDialogue(player, text, intention);
          return debugSnapshot();
        },
        snapshot: debugSnapshot
      }
    };
  }

  function runSelfChecks() {
    const checks = [
      ["seis jugadores", PLAYERS.length === 6],
      ["saldo inicial de $30.000", ECONOMY_CONFIG.initialBank + ECONOMY_CONFIG.initialCash === 30000],
      ["seis preparativos con precio", PREPARATIONS.length === 6 && PREPARATIONS.every(item => item.cost > 0)],
      ["kits equivalentes", Object.values(PROFESSION_ECONOMY).every(item => item.assets.reduce((sum, asset) => sum + asset[2], 0) === 450000)],
      ["oficios sin repetir", new Set(Object.values(state.campaign.professions)).size === PLAYERS.length],
      ["cuatro actores distintos", state.scenarios.slice(0, 4).length === 4 && new Set(state.scenarios.slice(0, 4).map(item => item.actorId)).size === 4],
      ["un Estafador y un Cómplice", Object.values(state.roles).filter(role => role === "Estafador").length === 1 && Object.values(state.roles).filter(role => role === "Cómplice").length === 1],
      ["contabilidad sin saldos negativos", PLAYERS.every(player => state.campaign.economy[player.id].bank >= 0 && state.campaign.economy[player.id].cash >= 0)],
      ["recursos serializables", PLAYERS.every(player => Array.isArray(state.campaign.resources[player.id]))],
      ["mundo de 1536×960", getComputedStyle(els.villageWorld).width === "1536px" && getComputedStyle(els.villageWorld).height === "960px"],
      ["demora bancaria sin ingreso", missionOptions({ ...MISSION_LIBRARY.bank[0], scenarioId: "bank" }).every(option => option.money === 0)],
      ["remedios con adelanto, costo y honorario separados", missionOptions({ ...MISSION_LIBRARY.family[1], scenarioId: "family" })[1].advanceAmount === 48000 && missionOptions({ ...MISSION_LIBRARY.family[1], scenarioId: "family" })[1].productCost === 30000 && missionOptions({ ...MISSION_LIBRARY.family[1], scenarioId: "family" })[1].serviceFee === 15000],
      ["cajero e inventario disponibles", Boolean(els.atmDialog && els.pocketDialog && els.pocketBank && els.pocketCash)],
      ["seis animales vivos", state.animals.length === 6 && state.animals.filter(item => item.species === "dog").length === 2 && state.animals.filter(item => item.species === "hen").length === 3],
      ["historias autónomas sin Nico actor", state.scenarios.slice(0, 4).every(item => item.actorId !== "nico")],
      ["cena espera las cuatro situaciones", !dinnerGateStatus({ storiesReady: false, botMissionsDone: true, botRoutesPending: false, humanReason: null }).available],
      ["cena queda disponible cuando termina el barrio", dinnerGateStatus({ storiesReady: true, botMissionsDone: true, botRoutesPending: false, humanReason: "human-mission" }).available],
      ["cena exige cerrar obligaciones propias", !dinnerGateStatus({ storiesReady: true, botMissionsDone: true, botRoutesPending: false, humanReason: "human-mission" }).ready],
      ["cena lista sin obligación humana", dinnerGateStatus({ storiesReady: true, botMissionsDone: true, botRoutesPending: false, humanReason: null }).ready]
    ];
    const failed = checks.filter(item => !item[1]);
    publishDebugApi(Object.fromEntries(checks));
    if (failed.length) console.error("Chamuyo · autoevaluaciones fallidas", failed.map(item => item[0]));
    else console.info("Chamuyo · autoevaluaciones OK", Object.fromEntries(checks));
    addSystemFeed(failed.length ? `DEBUG: fallaron ${failed.length} autoevaluaciones` : `DEBUG: ${checks.length} autoevaluaciones correctas`);
  }

  function bindEvents() {
    window.addEventListener("beforeunload", saveCampaign);
    els.pocketButton.addEventListener("click", () => togglePocket());
    els.pocketCloseButton.addEventListener("click", () => togglePocket(false));
    els.fullscreenButton.addEventListener("click", toggleMapFullscreen);
    document.addEventListener("fullscreenchange", () => {
      state.mapExpanded = Boolean(document.fullscreenElement);
      document.querySelector(".village-wrap")?.classList.toggle("map-expanded", state.mapExpanded);
      els.fullscreenButton.textContent = state.mapExpanded ? "× SALIR" : "⛶ MAPA";
    });
    els.atmChoices.addEventListener("click", event => {
      const button = event.target.closest("[data-atm-amount]");
      if (button) completeATMWithdrawal(button.dataset.atmAmount);
    });
    els.atmCustomButton.addEventListener("click", () => completeATMWithdrawal(els.atmCustomAmount.value));
    document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => {
      const dialog = document.getElementById(button.dataset.close);
      if (dialog?.open) dialog.close();
    }));
    els.rolePeekButton.addEventListener("click", openRolePaper);
    els.roleDialog.addEventListener("close", () => {
      if (state.isEpisodeResetting || !state.socialProfiles.nico) return;
      if (!state.selectedMission) openMissionDialog();
      else if (state.dayStartedAt) paintDayClock();
      else if (!state.currentResolved && !els.meetingDialog.open && !els.resultDialog.open && state.timer > 0) startTimer(false);
    });
    els.atmDialog.addEventListener("close", () => {
      state.atmUI.open = false;
      if (state.missionAtmRequirement?.status !== "complete") resumePendingATM();
    });
    els.missionChoices.addEventListener("click", event => {
      const button = event.target.closest("[data-mission]");
      if (button) chooseMission(Number(button.dataset.mission));
    });
    els.missionActionChoices.addEventListener("click", event => {
      const button = event.target.closest("[data-mission-action]");
      if (button) chooseMissionAction(button.dataset.missionAction);
    });
    els.strategyChoices.addEventListener("click", event => {
      const button = event.target.closest("[data-strategy]");
      if (button) chooseStrategy(button.dataset.strategy);
    });
    els.preparationChoices.addEventListener("click", event => {
      const button = event.target.closest("[data-preparation]");
      if (button) choosePreparation(button.dataset.preparation);
    });
    els.delegationChoices.addEventListener("click", event => {
      const button = event.target.closest("[data-delegation]");
      if (button) chooseDelegation(button.dataset.delegation);
    });
    els.missionConfirmButton.addEventListener("click", confirmMission);
    els.alibiChoices.addEventListener("click", event => {
      const button = event.target.closest("[data-alibi]");
      if (!button || !state.pendingAlibi) return;
      const pending = state.pendingAlibi;
      els.alibiDialog.close();
      applyAlibi(pending.interrogation, pending.prompt, pending.alibis[Number(button.dataset.alibi)], true);
      state.pendingAlibi = null;
    });
    els.continueButton.addEventListener("click", () => {
      if (state.completed % 4 === 0) {
        els.resolutionBox.hidden = true;
        refreshDinnerGate("continue");
        const gate = dinnerGateStatus();
        toast(gate.ready ? "El barrio terminó. Caminá lo que quieras y apretá A COMER cuando decidas." : gate.available ? "El barrio terminó. Cerrá tu mandado antes de sentarte." : "Las situaciones terminaron; todavía hay vecinos cerrando sus mandados.");
      } else nextStep();
    });
    els.meetingButton.addEventListener("click", openMeeting);
    els.errandSlipToggle.addEventListener("click", toggleErrandSlip);
    els.skipVoteButton.addEventListener("click", skipVote);
    els.resumeButton.addEventListener("click", resumeGame);
    els.restartButton.addEventListener("click", resetGame);
    els.newCampaignButton.addEventListener("click", newCampaign);
    els.playersLayer.addEventListener("click", event => {
      const button = event.target.closest("[data-dialogue-player]");
      if (button) toggleDialogueNote(button);
      const profile = event.target.closest("[data-profile-player]");
      if (profile) renderProfile(profile.dataset.profilePlayer);
    });
    els.inventoryPocket.addEventListener("click", event => {
      const button = event.target.closest("[data-resource-action]");
      if (button) disposeResource(button.dataset.resourceAction, button.dataset.resourceId);
    });
    els.meetingSeats.addEventListener("click", event => {
      const button = event.target.closest("[data-dialogue-player]");
      if (button) toggleDialogueNote(button);
    });
    els.interviewPeople.addEventListener("click", event => {
      const button = event.target.closest("[data-interview-player]");
      if (button) selectInterviewPlayer(button.dataset.interviewPlayer);
    });
    els.questionOptions.addEventListener("click", event => {
      const button = event.target.closest("[data-question-index]");
      if (button) askVerifierQuestion(Number(button.dataset.questionIndex));
    });
    els.closeNotebookButton.addEventListener("click", finishVerification);
    els.payoutChoices.addEventListener("click", event => {
      const declaration = event.target.closest("[data-encounter-declare]");
      if (declaration) chooseEncounterDeclaration(declaration.dataset.encounterDeclare);
      const explanation = event.target.closest("[data-encounter-explain]");
      if (explanation) chooseEncounterExplanation(explanation.dataset.encounterExplain);
      const share = event.target.closest("[data-encounter-share]");
      if (share) {
        const pending = state.pendingEncounter;
        if (pending?.deal?.holderId !== pending?.deal?.scammerId) {
          pending.deal.offeredShare = Number(share.dataset.encounterShare);
          pending.deal.expected = Math.round((pending.execution?.amount || 0) * (1 - pending.deal.offeredShare));
          state.pendingEncounter = null;
          els.payoutDialog.close();
          settleDeal(pending.deal, chooseAccompliceBehavior(pending.deal));
        } else chooseEncounterShare(share.dataset.encounterShare);
      }
      const delegationShare = event.target.closest("[data-delegation-share]");
      if (delegationShare) {
        const pending = state.pendingEncounter;
        if (pending?.mode === "delegation-brief") {
          pending.deal.offeredShare = Number(delegationShare.dataset.delegationShare);
          pending.deal.declaredAt = Date.now();
          if (pending.deal.offeredShare === 0) {
            pending.mode = "delegation-zero-explain";
            pending.explanationChoices = encounterExplanationChoices(pending.deal, pending.resource);
            els.payoutKicker.textContent = "EL CÓMPLICE TE PREGUNTA";
            els.payoutTitle.textContent = "¿Cero? ¿Por qué te ayudaría entonces?";
            els.payoutText.textContent = "Elegí una explicación compatible con tu mandado y el recurso que estás preparando.";
            els.payoutChoices.innerHTML = pending.explanationChoices.map((item, index) => `<button type="button" data-delegation-excuse="${index}"><strong>${escapeHTML(item.text)}</strong><span>La explicación queda entre ustedes y puede reaparecer en la mesa.</span></button>`).join("");
          } else {
            pending.deal.briefed = true;
            recordDealDialogueOnce(pending.deal, "delegation-brief", PLAYERS.find(player => player.id === "nico"), `Le ofrecí al Cómplice ${Math.round(pending.deal.offeredShare * 100)}% si la maniobra deja plata.`, "delegation-brief");
            state.pendingEncounter = null;
            els.payoutDialog.close();
            if (pending.continueInteraction) pending.continueInteraction();
          }
        }
      }
      const delegationExcuse = event.target.closest("[data-delegation-excuse]");
      if (delegationExcuse) {
        const pending = state.pendingEncounter;
        if (pending?.mode === "delegation-zero-explain") {
          const excuse = pending.explanationChoices[Number(delegationExcuse.dataset.delegationExcuse)];
          if (!excuse) return;
          pending.deal.explanationId = excuse.id;
          pending.deal.briefed = true;
          recordDealDialogueOnce(pending.deal, "delegation-zero-excuse", PLAYERS.find(player => player.id === "nico"), `Le ofrecí 0% al Cómplice: ${excuse.text}`, "delegation-zero-excuse");
          state.pendingEncounter = null;
          els.payoutDialog.close();
          if (pending.continueInteraction) pending.continueInteraction();
        }
      }
      const payout = event.target.closest("[data-payout]");
      if (payout) settleHumanPayout(payout.dataset.payout);
      const confrontation = event.target.closest("[data-confrontation]");
      if (confrontation) settleConfrontation(confrontation.dataset.confrontation);
    });
    els.villageMap.addEventListener("click", event => {
      if (event.target.closest("button")) return;
      const locationNode = event.target.closest("[data-location]");
      if (locationNode) { setDestination(locationPoint(locationNode.dataset.location)); return; }
      const rect = els.villageMap.getBoundingClientRect();
      setDestination([event.clientX - rect.left + state.movement.camera.x, event.clientY - rect.top + state.movement.camera.y]);
    });
    document.querySelectorAll("[data-move]").forEach(button => {
      const direction = button.dataset.move;
      const start = event => {
        event.preventDefault();
        state.movement.path = [];
        state.movement.keys.add(direction);
        if (button.setPointerCapture && event.pointerId !== undefined) button.setPointerCapture(event.pointerId);
      };
      const stop = event => { event.preventDefault(); stopHumanMovement(direction); };
      button.addEventListener("pointerdown", start); button.addEventListener("pointerup", stop); button.addEventListener("pointercancel", stop); button.addEventListener("pointerleave", stop);
    });
    document.addEventListener("pointerup", () => stopHumanMovement());
    window.addEventListener("blur", () => stopHumanMovement());
    document.addEventListener("visibilitychange", () => { if (document.hidden) stopHumanMovement(); });
    els.resultDialog.addEventListener("cancel", event => event.preventDefault());
    [els.missionDialog, els.alibiDialog, els.meetingDialog, els.judgmentDialog, els.payoutDialog, els.atmDialog].forEach(dialog => dialog && dialog.addEventListener("cancel", event => event.preventDefault()));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && els.resultDialog?.open) {
        event.preventDefault();
        return;
      }
      if (event.key === "Escape" && els.meetingDialog?.open) {
        closeDialogueNotes();
        event.preventDefault();
        return;
      }
      if (event.key === "Escape") closeDialogueNotes();
      if ((event.key === "i" || event.key === "I") && !event.target.closest("input,textarea")) { event.preventDefault(); togglePocket(); return; }
      if ((event.key === "p" || event.key === "P") && !event.target.closest("input,textarea")) { event.preventDefault(); toggleErrandSlip(); return; }
      if (event.key === "Escape" && els.pocketDialog.open) { event.preventDefault(); togglePocket(false); return; }
      const inputBlocked = [els.roleDialog, els.missionDialog, els.alibiDialog, els.meetingDialog, els.judgmentDialog, els.resultDialog, els.payoutDialog, els.profileDialog, els.atmDialog].some(dialog => dialog?.open);
      const focusedControl = event.target instanceof HTMLElement && event.target.closest("button,summary,a");
      const direction = ({ ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down", ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right" })[event.key];
      if (direction && !inputBlocked) { event.preventDefault(); state.movement.keys.add(direction); state.movement.path = []; }
      if ((event.key === "e" || event.key === "E" || (event.key === "Enter" && !focusedControl)) && !inputBlocked) { event.preventDefault(); interactNearby(); }
      if (/^[1-6]$/.test(event.key) && !state.currentResolved && !inputBlocked) {
        els.actionCards.querySelector(`[data-key="${event.key}"]`)?.click();
      }
    });
    document.addEventListener("keyup", event => {
      const direction = ({ ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down", ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right" })[event.key];
      if (direction) stopHumanMovement(direction);
    });
  }

  function stopHumanMovement(direction = null) {
    if (direction) state.movement.keys.delete(direction);
    else state.movement.keys.clear();
    if (!state.movement.keys.size) paintWalker("nico", 0, 0, false);
  }

  function debugWatchdog() {
    if (!DEBUG_MODE) return;
    let lastSnapshot = null;
    window.setInterval(() => {
      if (state.currentResolved && !els.continueButton?.disabled) return;
      if (state.currentResolved && !state.transitionPending) {
        const dialogsOpen = [els.meetingDialog, els.resultDialog, els.judgmentDialog, els.alibiDialog, els.payoutDialog, els.atmDialog].some(d => d?.open);
        if (!dialogsOpen) {
          const snapshot = debugSnapshot();
          if (lastSnapshot && JSON.stringify(snapshot) === JSON.stringify(lastSnapshot)) {
            console.error("Chamuyo · DEBUG WATCHDOG: resuelto sin avance", snapshot);
          }
          lastSnapshot = snapshot;
        }
      }
    }, 1200);
  }

  async function init() {
    applyWorldGeometry();
    bindEvents();
    loadCampaign();
    startEpisode(`Campaña ${state.campaign.campaignId.slice(-5).toUpperCase()} · partida ${state.campaign.episodeNumber} · cuatro movimientos por ronda`);
    await state.transport.connect();
    if (!state.movement.rafId) state.movement.rafId = requestAnimationFrame(updateMovement);
    if (DEBUG_MODE) runSelfChecks();
    debugWatchdog();
  }

  init();
})();
