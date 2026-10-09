// Enoteca Vanni, wine catalogue.
// To use a real bottle photo, set `img` on a wine (e.g. img: "images/bottles/brunello-altesino.jpg").
// Without `img`, the placeholder bottle for the category is shown.
// price: null shows "Su richiesta". All entries are examples, to confirm with Vanni.
window.VANNI_CATEGORIES = [
  { id: 'rossi', name: 'Rossi', placeholder: 'images/bottles/rosso.svg',
    intro: 'Toscana prima di tutto, poi il Piemonte con i Barolo cru.',
    wines: [
      { name: 'Altesino Brunello di Montalcino 2015', area: 'Toscana', price: 45 },
      { name: 'Barale Barolo Bussia 2010', area: 'Piemonte', price: 39 },
      { name: 'Bertani Amarone della Valpolicella 1977', area: 'Veneto', price: 295 },
      { name: 'Fontodi Chianti Classico', area: 'Toscana', price: null },
      { name: 'Ornellaia Bolgheri Superiore', area: 'Toscana', price: null },
      { name: 'Aldo Conterno Barolo Bussia', area: 'Piemonte', price: null },
      { name: 'Fenocchio Barolo Villero', area: 'Piemonte', price: null },
      { name: 'Nobile di Montepulciano', area: 'Toscana', price: null }
    ] },
  { id: 'bianchi', name: 'Bianchi', placeholder: 'images/bottles/bianco.svg',
    intro: 'Vermentino e bianchi toscani, Riesling tedeschi e alsaziani.',
    wines: [
      { name: 'Enzo Carmignani Montecarlo Bianco 2019', area: 'Lucca', price: 8.5 },
      { name: 'Edi Kante Vitovska 2017', area: 'Friuli', price: 21 },
      { name: 'Vermentino di Bolgheri', area: 'Toscana', price: null },
      { name: 'Trimbach Riesling', area: 'Alsazia', price: null },
      { name: 'Riesling Kabinett', area: 'Mosella, Germania', price: null },
      { name: 'Vernaccia di San Gimignano', area: 'Toscana', price: null }
    ] },
  { id: 'bollicine', name: 'Bollicine', placeholder: 'images/bottles/bollicine.svg',
    intro: 'Champagne di grandi maison e piccoli vignaioli, metodo classico italiano.',
    wines: [
      { name: 'Drappier Zero Dosage', area: 'Champagne', price: 43 },
      { name: 'Billecart-Salmon Brut Réserve', area: 'Champagne', price: null },
      { name: 'Ca\' del Bosco Cuvée Prestige', area: 'Franciacorta', price: null },
      { name: 'Ferrari Perlé', area: 'Trentino', price: null },
      { name: 'Champagne Blanc de Blancs', area: 'Champagne', price: null }
    ] },
  { id: 'meditazione', name: 'Da meditazione', placeholder: 'images/bottles/dolce.svg',
    intro: 'Sauternes, Picolit, Vin Santo: i vini dolci da sorseggiare con calma.',
    wines: [
      { name: 'Quinta do Noval Porto Vintage 1994', area: 'Douro, Portogallo', price: 250 },
      { name: 'Sauternes', area: 'Bordeaux', price: null },
      { name: 'Picolit', area: 'Friuli', price: null },
      { name: 'Vin Santo del Chianti', area: 'Toscana', price: null },
      { name: 'Passito di Pantelleria', area: 'Sicilia', price: null }
    ] },
  { id: 'distillati', name: 'Distillati', placeholder: 'images/bottles/distillato.svg',
    intro: 'Grappe, whisky, cognac e liquori, tra le botti in cantina.',
    wines: [
      { name: 'Ardbeg Uigeadail', area: 'Islay, Scozia', price: 80 },
      { name: 'Grappa di Barolo', area: 'Piemonte', price: null },
      { name: 'Nonino Grappa', area: 'Friuli', price: null },
      { name: 'Cognac XO', area: 'Francia', price: null },
      { name: 'Single Malt invecchiato', area: 'Scozia', price: null }
    ] },
  { id: 'grandi-formati', name: 'Grandi formati', placeholder: 'images/bottles/magnum.svg',
    intro: 'Magnum, jeroboam e bottiglie da festa. Per quando si è in tanti.',
    wines: [
      { name: 'Sassicaia 2000 Magnum', area: 'Bolgheri, Toscana', price: null },
      { name: 'Sassoalloro Magnum', area: 'Toscana', price: null },
      { name: 'Barolo Magnum', area: 'Piemonte', price: null },
      { name: 'Champagne Jeroboam', area: 'Champagne', price: null }
    ] }
];

// English labels. Wine names stay as printed on the bottle unless listed in nameEn.
(function () {
  var cats = { rossi: ['Reds', 'Tuscany first, then Piedmont with its cru Barolo.'],
    bianchi: ['Whites', 'Vermentino and Tuscan whites, German and Alsatian Rieslings.'],
    bollicine: ['Sparkling', 'Champagne from great houses and small growers, Italian traditional-method sparkling wines.'],
    meditazione: ['Meditation wines', 'Sauternes, Picolit, Vin Santo: sweet wines to sip slowly.'],
    distillati: ['Spirits', 'Grappa, whisky, cognac and liqueurs, among the barrels in the cellar.'],
    'grandi-formati': ['Large formats', 'Magnums, jeroboams and party bottles. For when there are many of you.'] };
  var areas = { 'Toscana': 'Tuscany', 'Piemonte': 'Piedmont', 'Sicilia': 'Sicily', 'Alsazia': 'Alsace', 'Mosella, Germania': 'Moselle, Germany',
    'Douro, Portogallo': 'Douro, Portugal', 'Islay, Scozia': 'Islay, Scotland', 'Scozia': 'Scotland', 'Francia': 'France',
    'Bolgheri, Toscana': 'Bolgheri, Tuscany' };
  var names = { 'Single Malt invecchiato': 'Aged Single Malt', 'Grappa di Barolo': 'Barolo Grappa', 'Vin Santo del Chianti': 'Chianti Vin Santo',
    'Passito di Pantelleria': 'Pantelleria Passito', 'Vernaccia di San Gimignano': 'Vernaccia di San Gimignano' };
  window.VANNI_CATEGORIES.forEach(function (c) {
    c.nameEn = cats[c.id][0]; c.introEn = cats[c.id][1];
    c.wines.forEach(function (w) { if (areas[w.area]) w.areaEn = areas[w.area]; if (names[w.name]) w.nameEn = names[w.name]; });
  });
})();
