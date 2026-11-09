// Spanish versions of the Latin Mass lessons. Quotations come from the official Spanish texts on vatican.va
// (Sacrosanctum Concilium, Summorum Pontificum, Traditionis Custodes, Compendio del Catecismo).
// Passages from the Catholic Encyclopedia (English) are paraphrased, not quoted.
import { readFileSync } from 'node:fs';
const P = Object.fromEntries(JSON.parse(readFileSync(new URL('../../src/data/prayers.json', import.meta.url), 'utf8')).map((p) => [p.id, p]));
const line = (id, k) => P[id][k].split('\n').join(' ');
const prayer = (id, name) => `> "${line(id, 'la')}"\n> *${name} (Compendio del Catecismo, Apéndice A)*`;
const es = (id, name) => `> "${line(id, 'es')}"\n> *${name} (Compendio del Catecismo, Apéndice A)*`;

export default [
  {
    slug: 'latin-in-the-liturgy', title: 'El latín en la liturgia',
    summary: 'Lo que dijo el Vaticano II sobre el latín, la lengua del pueblo y el canto.',
    short: `El Vaticano II pidió que se conservara el latín en los ritos latinos, dio lugar a la lengua del pueblo y pidió que los fieles pudieran decir juntos las partes en latín de la Misa (Sacrosanctum Concilium 36 y 54).`,
    teach: [
      `«Se conservará el uso de la lengua latina en los ritos latinos, salvo derecho particular» (Sacrosanctum Concilium 36 §1).`,
      `El mismo Concilio dio más cabida a la lengua del pueblo. Dijo que se le podrá dar mayor cabida, «ante todo, enlas lecturas y moniciones, en algunas oraciones y cantos» (Sacrosanctum Concilium 36 §2).`,
      `«Procúrese, sin embargo, que los fieles sean capaces también de recitar o cantar juntos en latín las partes del ordinario de la Misa que les corresponde» (Sacrosanctum Concilium 54).`,
      `«La Iglesia reconoce el canto gregoriano como el propio de la liturgia romana; en igualdad de circunstancias, por tanto, hay que darle el primer lugar en las acciones litúrgicas» (Sacrosanctum Concilium 116).`,
      `El Concilio quería además ritos «adaptados a la capacidad de los fieles» que, «en general, no deben tener necesidad de muchas explicaciones» (Sacrosanctum Concilium 34).`,
      `La Enciclopedia Católica (1910) explica que en Occidente la lengua de la Misa fue al principio el griego, y que de esa liturgia primitiva, al pasar al latín, se desarrollaron el rito romano y el galicano.`,
    ],
    verses: [['John', 19, 19, 20]],
    scriptureNote: `Juan cuenta que el letrero de la cruz estaba escrito en hebreo, en griego y en latín.`,
    today: [
      `Mucha gente cree que el Vaticano II prohibió el latín. El texto de la Constitución dice lo contrario: el latín debe conservarse en los ritos latinos, y se da lugar a la lengua del pueblo.`,
      `Las dos opciones tienen quien las defienda. Quienes quieren latín señalan el canto, la belleza y una lengua común entre naciones. Quienes quieren la lengua local señalan la comprensión.`,
    ],
    stakes: `La cuestión es cómo reza la Iglesia. El Concilio dio lugar a ambas cosas y pidió que los fieles no quedaran al margen de las partes en latín.`,
    live: [
      `**Lee** tú mismo Sacrosanctum Concilium 36, 54 y 116.`,
      `**Aprende** las respuestas en latín y el Padrenuestro en latín.`,
      `**Pregunta** a tu sacerdote cómo se celebra la Misa en tu parroquia y por qué.`,
      `**Sé amable** con quien prefiere la otra forma.`,
    ],
    deeper: [`Sacrosanctum Concilium 34-36, 54, 112-116`, `Catholic Encyclopedia, «Liturgy of the Mass» (en inglés)`, `Juan 19:16-22`],
    sources: ['Concilio Vaticano II, Sacrosanctum Concilium, 34, 36, 54, 116 (texto oficial en español)'],
  },
  {
    slug: 'the-traditional-latin-mass', title: 'La Misa tradicional en latín',
    summary: 'Qué es, qué dicen los documentos y qué debates la rodean.',
    short: `El Misal Romano de san Pío V, revisado por Juan XXIII en 1962, es una «expresión extraordinaria» del rito romano según Summorum Pontificum (2007). Traditionis Custodes (2021) dice que solo el obispo diocesano autoriza su uso.`,
    teach: [
      `«El Misal Romano promulgado por Pablo VI es la expresión ordinaria de la "Lex orandi" ("Ley de la oración"), de la Iglesia católica de rito latino. No obstante, el Misal Romano promulgado por san Pío V, y nuevamente por el beato Juan XXIII, debe considerarse como expresión extraordinaria de la misma "Lex orandi"» (Summorum Pontificum, art. 1).`,
      `Benedicto XVI añadió que estas dos expresiones «en modo alguno inducen a una división de la "Lex credendi" ("Ley de la fe") de la Iglesia; en efecto, son dos usos del único rito romano» (Summorum Pontificum, art. 1).`,
      `El mismo documento afirma que el Misal promulgado por Juan XXIII en 1962 nunca fue abrogado (Summorum Pontificum, 2007).`,
      `El papa Francisco escribió: «Los libros litúrgicos promulgados por los santos Pontífices Pablo VI y Juan Pablo II, en conformidad con los decretos del Concilio Vaticano II, son la única expresión de la lex orandi del Rito Romano» (Traditionis Custodes, art. 1).`,
      `Del obispo diocesano dice: «es de su exclusiva competencia autorizar el uso del Missale Romanum de 1962 en la diócesis, siguiendo las orientaciones de la Sede Apostólica» (Traditionis Custodes, art. 2).`,
      `Los dos documentos hablan del Misal de 1962. No describen libros más antiguos. Según la Enciclopedia Católica (1910), san Pío V publicó el Misal con la bula «Quo primum» el 14 de julio de 1570.`,
    ],
    verses: [['John', 4, 23, 24]],
    scriptureNote: `Jesús dice que llega la hora, y ya está aquí, en que los verdaderos adoradores adorarán al Padre en espíritu y en verdad.`,
    today: [
      `Quienes aman la Misa antigua hablan del silencio, la belleza, el latín y el sentido de lo sagrado. Quienes prefieren la nueva hablan de entender las palabras, participar y la unidad en toda la Iglesia.`,
      `Las dos son el mismo sacrificio. La Iglesia nunca ha dicho que una de ellas no sea una verdadera Misa.`,
      `Las normas pueden cambiar y dependen de la diócesis. Consulta a tu párroco y a tu obispo qué se aplica donde vives.`,
    ],
    stakes: `La Iglesia pide a los católicos que no conviertan la liturgia en un campo de batalla. La división sobre cómo rezar es una herida real, y gente de ambos lados lo reconoce.`,
    live: [
      `**Ve una vez y mira.** Si hay una cerca, asiste con la mente abierta.`,
      `**No te burles de ningún bando.** Puedes tener una preferencia sin desprecio.`,
      `**Sigue** las normas de tu obispo y reza por la unidad de la Iglesia.`,
      `**Aprende** un poco de latín. La página de oraciones es un buen comienzo.`,
    ],
    deeper: [`Benedicto XVI, Summorum Pontificum (2007)`, `Francisco, Traditionis Custodes (2021)`, `Juan 4:19-26`],
    sources: ['Benedicto XVI, Summorum Pontificum (2007), art. 1 (texto oficial en español)', 'Francisco, Traditionis Custodes (2021), art. 1 y 2 (texto oficial en español)'],
  },
  {
    slug: 'the-mass-before-1955', title: 'La Misa antes de 1955',
    summary: 'El Misal de Pío V, la Misa solemne y la rezada, y la reforma de la Semana Santa de 1955.',
    short: `Antes de 1955 la Misa romana era el Misal de Pío V (1570) con revisiones ligeras. Un decreto de 1955 reformó la Semana Santa y después llegó el Misal de 1962.`,
    teach: [
      `La Enciclopedia Católica (1910) cuenta que Pío V publicó el Misal con la bula Quo primum el 14 de julio de 1570, y que esa fue la última etapa de la historia de la Misa romana.`,
      `Clemente VIII (1604), Urbano VIII (1634) y León XIII (1884) lo revisaron ligeramente en las rúbricas y en los textos de la Escritura. San Pío X revisó el canto en 1908. Según el artículo, el libro seguía siendo el Misal de Pío V.`,
      `El artículo dice que la Misa solemne, con diácono y subdiácono, es la norma, y que la Misa rezada, que dice un sacerdote solo con un monaguillo, es una forma abreviada y simplificada de la misma.`,
      `Una Misa cantada es en realidad una Misa rezada, pues lo esencial de la Misa solemne no es la música sino el diácono y el subdiácono.`,
      `El 16 de noviembre de 1955 el decreto Maxima Redemptionis Nostrae Mysteria de Pío XII reformó los ritos de la Semana Santa (Acta Apostolicae Sedis 47 (1955) 838-847). No pude leer el decreto mismo. Resúmenes secundarios dicen que devolvió la Vigilia Pascual a la noche del Sábado Santo, pasó la liturgia del Viernes Santo a la hora de la muerte de Cristo, rehízo la bendición del cirio pascual, redujo las lecturas de la Vigilia e introdujo la renovación de las promesas bautismales en lengua vernácula.`,
      `León XIII mandó en 1884 unas oraciones para después de la Misa rezada: tres avemarías, la Salve y una oración a san Miguel. La instrucción Inter Oecumenici (26 de septiembre de 1964) las suprimió. Estas fechas proceden de fuentes secundarias.`,
      `El Misal de 1962, revisado por Juan XXIII, es el que nombran Summorum Pontificum y Traditionis Custodes.`,
    ],
    verses: [['Luke', 22, 19, 20]],
    scriptureNote: `En la Última Cena Jesús toma el pan y la copa y dice que lo hagan en memoria suya. Toda forma de la Misa romana se apoya en esto.`,
    today: [
      `Una Misa «anterior a 1955» sigue los libros usados antes del decreto de Semana Santa. Los documentos recientes de la Iglesia sobre la liturgia antigua nombran el Misal de 1962, así que tu párroco y tu obispo son quienes pueden decirte qué libros usa tu parroquia.`,
      `El artículo de la Enciclopedia Católica tiene más de cien años. Sirve para saber cómo se celebraba entonces, no para la práctica posterior.`,
    ],
    stakes: `Conocer la historia evita discutir sobre cosas que nunca ocurrieron. La Misa ha cambiado con el tiempo, y la Iglesia la ha cambiado mediante la autoridad legítima.`,
    live: [
      `**Lee** el artículo de la Enciclopedia Católica sobre la liturgia de la Misa.`,
      `**Compáralo** con la lección sobre las partes de la Misa.`,
      `**Pregunta** a tu sacerdote en qué se diferencia la Misa de tu parroquia del Misal de 1962.`,
      `**Consulta** el decreto de Semana Santa mismo, no solo resúmenes.`,
    ],
    deeper: [`Catholic Encyclopedia, «Liturgy of the Mass» (en inglés)`, `Maxima Redemptionis Nostrae Mysteria (1955)`, `Lucas 22:7-20`],
    sources: ['Catholic Encyclopedia (1910), «Liturgy of the Mass»', 'Sagrada Congregación de Ritos, Maxima Redemptionis Nostrae Mysteria (1955) (conocido por resúmenes secundarios)'],
  },
  {
    slug: 'following-the-mass-in-latin', title: 'Cómo seguir la Misa en latín',
    summary: 'Cómo seguir la Misa y participar cuando es en latín.',
    short: `El Concilio pidió «las aclamaciones del pueblo, las respuestas, la salmodia, las antífonas, los cantos» y «un silencio sagrado». Puedes seguir una Misa en latín con un misal bilingüe y unas pocas respuestas (Sacrosanctum Concilium 30).`,
    teach: [
      `«Para promover la participación activa se fomentarán las aclamaciones del pueblo, las respuestas, la salmodia, las antífonas, los cantos y también las acciones o gestos y posturas corporales. Guárdese, además, a su debido tiempo, un silencio sagrado» (Sacrosanctum Concilium 30).`,
      `El Concilio deseaba una «participación plena, consciente y activa en las celebraciones litúrgicas», a la que el pueblo cristiano «tiene derecho y obligación, en virtud del bautismo» (Sacrosanctum Concilium 14).`,
      `En la Misa tal como la describe la Enciclopedia Católica, el orden es: oraciones al pie del altar, Introito y Kyrie, el Gloria los días en que se dice el Te Deum en el Oficio, la colecta, la Epístola, el Gradual, el Evangelio, el sermón si lo hay, y el Credo los domingos y en ciertas fiestas.`,
      `El sacerdote dice «Dominus vobiscum» y el pueblo responde «Et cum spiritu tuo» (Catholic Encyclopedia, «Liturgy of the Mass»).`,
      `La Iglesia imprime para todos, en latín, la Señal de la Cruz, el Padrenuestro, el Avemaría y los Credos. Están en el Compendio del Catecismo, Apéndice A, y en la página de oraciones de este sitio.`,
    ],
    verses: [['1 Corinthians', 14, 40, 40]],
    scriptureNote: `Pablo termina sus instrucciones sobre el culto diciendo que todo se haga con decoro y orden.`,
    today: [
      `Una Misa en latín puede parecer algo que miras sin entenderlo. Un misal de mano con el latín y la traducción en columnas paralelas resuelve casi todo.`,
      `El silencio también es parte de la Misa. El Concilio lo pidió a su debido tiempo.`,
    ],
    stakes: `El objetivo es participar con atención. Entender las palabras ayuda. Estar presente importa más.`,
    live: [
      `**Lleva** un misal de mano bilingüe que corresponda a la forma de la Misa de tu parroquia.`,
      `**Aprende** «Dominus vobiscum» y «Et cum spiritu tuo».`,
      `**Observa** al sacerdote y a la gente cercana para saber las posturas.`,
      `**Pregunta** después de la Misa. A la mayoría de los habituales les gusta ayudar a los nuevos.`,
    ],
    deeper: [`Sacrosanctum Concilium 14, 30, 54`, `La página de oraciones`, `1 Corintios 14:26-40`],
    sources: ['Concilio Vaticano II, Sacrosanctum Concilium, 14, 30 (texto oficial en español)', 'Catholic Encyclopedia (1910), «Liturgy of the Mass»'],
  },
  {
    slug: 'latin-prayers-every-catholic-should-know', title: 'Oraciones en latín que todo católico debe conocer',
    summary: 'La Señal de la Cruz, el Padrenuestro, el Avemaría y el Gloria al Padre en latín.',
    short: `El Compendio del Catecismo imprime oraciones comunes en latín para que los católicos puedan rezarlas en la lengua de la Iglesia. Aquí tienes cinco.`,
    teach: [
      `El Compendio del Catecismo de la Iglesia Católica (2005) trae estas oraciones en español y en latín en su Apéndice A, «Oraciones comunes». Los textos de abajo están copiados de él.`,
      prayer('sign', 'Signum Crucis'), es('sign', 'Señal de la Cruz'),
      prayer('pater', 'Pater Noster'), es('pater', 'Padre nuestro'),
      prayer('ave', 'Ave Maria'), es('ave', 'Ave María'),
      prayer('gloria', 'Gloria Patri'), es('gloria', 'Gloria al Padre'),
      prayer('angel', 'Angele Dei'), es('angel', 'Ángel de Dios'),
      `El mismo Apéndice trae la Salve, el Alma de Cristo, los Credos y más. Todas están en la página de oraciones de este sitio, con el español y el inglés junto al latín.`,
    ],
    verses: [['Luke', 11, 1, 4]],
    scriptureNote: `Los discípulos piden a Jesús que les enseñe a orar, y Él les da el Padrenuestro.`,
    today: [
      `Las oraciones en latín se aprenden fácilmente diciéndolas en voz alta. Aprende una línea al día.`,
      `Los acentos del Compendio indican dónde cae la fuerza de la voz. No forman parte de la ortografía antigua, pero ayudan.`,
    ],
    stakes: `Un conjunto de oraciones comunes permite que católicos de cualquier país recen juntos. El Concilio Vaticano II pidió que los fieles pudieran decir y cantar juntos las partes en latín del ordinario de la Misa (Sacrosanctum Concilium 54).`,
    live: [
      `**Reza** la Señal de la Cruz y el Padrenuestro en latín cada día durante una semana.`,
      `**Di** el Avemaría en latín al final de una decena del Rosario.`,
      `**Imprime** la página de oraciones y guárdala en tu misal.`,
      `**Pregunta** a un sacerdote o al director del coro por la pronunciación.`,
    ],
    deeper: [`Compendio del Catecismo, Apéndice A`, `La página de oraciones`, `Lucas 11:1-13`],
    sources: ['Compendio del Catecismo de la Iglesia Católica (2005), Apéndice A, Oraciones comunes (vatican.va)', 'Concilio Vaticano II, Sacrosanctum Concilium, 54 (texto oficial en español)'],
  },
];
