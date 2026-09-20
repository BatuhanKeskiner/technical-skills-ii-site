/* ============================================================
   Film stocks for the Pinhole Calculator's Exposure tab.
   Batu's folder films_ilford_kodak_fuji/, 16-09-2026, added whole:
   35 Ilford, Kodak and Fujifilm films, each with its speed, its
   reciprocity formula and the maker's data sheet. The product
   pictures are in art/films/, cut to 360 px from the folder's
   1700-2048 px originals.
   ============================================================ */
/* Reciprocity failure per film stock. Extracted 16-09-2026 from
   https://lucas.dev/reciprocity (Lucas's compilation of the manufacturers'
   data sheets, linked per film in src). fn(t, p) returns the time to give
   for a metered time t in seconds; below `after` seconds the film is
   honest and t is given as metered. trust: 'sheet' = from a linked data
   sheet, 'untested' = the site says so, 'unsourced' = no sheet linked. */
/* 17-09-2026, after the fact-check: Provia 400F is ISO 400 (the compilation
   had 100); Ektar's sheet stops at 1 s like Portra's; Velvia 50's +1/3,
   +1/2, +2/3 stop are 2^(1/3), 2^(1/2), 2^(2/3), not 4/3, 3/2, 5/3. The
   other Fujifilm tables were not compared against their sheets. */
/* A MAKER'S TABLE, AS IT IS PRINTED: from each listed time on, add that many
   stops - as time, 2^stops. 17-09-2026, every Fujifilm sheet read and the
   compilation's formulas replaced where they were not the sheet: Velvia 100
   (none to 1 min; 2, 4, 8 min: +1/3, +1/2, +2/3), Provia 100F (none to 128 s;
   4 min +1/3), Reala (4 s +1/3, 16 s +1), Pro 400H (4 s +1/2, 16 s +1),
   X-TRA 400, Superia 100 and C200 (4, 16, 64 s: +1/3, +2/3, +1), Acros II
   (120-1000 s +1/2). T-Max 400 follows its linked 2016 sheet F-4043: 10 s
   +1/3, 100 s -> 300 s, joined in log time. Past the last row the
   compilation's own extension is kept where it had one. */
function pcSteps(t, table) {
  let st = 0;
  table.forEach((r) => { if (t >= r[0]) st = r[1]; });
  return t * Math.pow(2, st);
}

const PC_RECIP = [
  { brand: 'Kodak', name: 'Portra 160', slug: 'kodak-portra-160', img: 'portra160.jpg', iso: 160, p: 1.34, after: 1, trust: 'short',
    fn: (t, p) => Math.pow(t, p),
    note: 'Kodak\'s sheet (E-4051, 2025) asks for no correction up to 1 s and says to test beyond it; the formula past 1 s is the compilation\'s.',
    src: 'https://kodakprofessional.com/sites/default/files/2025-07/e4051.pdf' },
  { brand: 'Kodak', name: 'Portra 400', slug: 'kodak-portra-400', img: 'portra400.jpg', iso: 400, p: 1.34, after: 1, trust: 'short',
    fn: (t, p) => Math.pow(t, p),
    note: 'Kodak\'s sheet (E-4050, 2025) asks for no correction up to 1 s and says to test beyond it; the formula past 1 s is the compilation\'s.',
    src: 'https://kodakprofessional.com/sites/default/files/2025-07/e4050.pdf' },
  { brand: 'Kodak', name: 'Portra 800', slug: 'kodak-portra-800', img: 'portra800.jpg', iso: 800, p: 1.3, after: 1, trust: 'short',
    fn: (t, p) => Math.pow(t, p),
    note: 'Kodak\'s sheet (E-4040, 2025) asks for no correction up to 1 s and says to test beyond it; the formula past 1 s is the compilation\'s, and untested.',
    src: 'https://kodakprofessional.com/sites/default/files/2025-07/e4040.pdf' },
  { brand: 'Kodak', name: 'Ektar 100', slug: 'kodak-ektar-100', img: 'ektar100.jpg', iso: 100, p: 1.3, after: 1, trust: 'short',
    fn: (t, p) => .759*t+.555*Math.pow(t, p),
    note: 'Kodak\'s sheet (E-4046) asks for no correction up to 1 s and says to test beyond it; the formula past 1 s is the compilation\'s.',
    src: 'https://imaging.kodakalaris.com/sites/default/files/files/products/e4046_ektar_100.pdf' },
  { brand: 'Kodak', name: 'Ektachrome 100', slug: 'kodak-ektachrome-100', img: 'ektachrome100.jpg', iso: 100, p: 1.064, after: 10, trust: 'untested',
    fn: (t, p) => Math.pow(t, p),
    note: 'The reciprocity data on this stock is untested — results may vary.',
    src: 'https://imaging.kodakalaris.com/sites/default/files/files/products/e4000_ektachrome_100.pdf' },
  { brand: 'Kodak', name: 'Gold 200', slug: 'kodak-gold-200', img: 'gold200.jpg', iso: 200, p: 1.3, after: 1, trust: 'untested',
    fn: (t, p) => Math.pow(t, p),
    note: 'The reciprocity data on this stock is untested — results may vary.',
    src: 'https://imaging.kodakalaris.com/sites/default/files/files/resources/E7022_Gold_200.pdf' },
  { brand: 'Fujifilm', name: '200', slug: 'fujifilm-200', img: 'fuji200.jpg', iso: 200, p: 1.3, after: 1, trust: 'untested',
    fn: (t, p) => Math.pow(t, p),
    note: 'It is believed that this is a rebranding of Kodak Gold 200, so the same data is used for this stock. The reciprocity data on this stock is untested — results may vary.',
    src: 'https://imaging.kodakalaris.com/sites/default/files/files/resources/E7022_Gold_200.pdf' },
  { brand: 'Fujifilm', name: '400', slug: 'fujifilm-400', img: 'fuji400.jpg', iso: 400, p: 1.3, after: 1, trust: 'untested',
    fn: (t, p) => Math.pow(t, p),
    note: 'It is believed that this is a rebranding of Kodak Ultramax 400, so the same data is used for this stock. The reciprocity data on this stock is untested — results may vary.',
    src: 'https://apps.kodakmoments.com/wp-content/uploads/2017/07/E7023_max_400.pdf' },
  { brand: 'Ilford', name: 'Delta 100', slug: 'ilford-delta-100', img: 'delta100.jpg', iso: 100, p: 1.26, after: 1, trust: 'sheet',
    fn: (t, p) => Math.pow(t, p),
    note: '',
    src: 'https://www.ilfordphoto.com/amfile/file/download/file/3/product/681/' },
  { brand: 'Ilford', name: 'Delta 3200', slug: 'ilford-delta-3200', img: 'delta3200.jpg', iso: 3200, p: 1.33, after: 1, trust: 'sheet',
    fn: (t, p) => Math.pow(t, p),
    note: 'Ilford gives its ISO speed as 1000 and recommends rating it at EI 3200, which is the speed set here.',
    src: 'https://www.ilfordphoto.com/amfile/file/download/file/1913/product/683/' },
  { brand: 'Ilford', name: 'HP5 Plus 400', slug: 'ilford-hp5-plus-400', img: 'hp5.jpg', iso: 400, p: 1.31, after: 1, trust: 'sheet',
    fn: (t, p) => Math.pow(t, p),
    note: '',
    src: 'https://www.ilfordphoto.com/amfile/file/download/file/1903/product/695/' },
  { brand: 'Ilford', name: 'Ortho Plus 80', slug: 'ilford-ortho-plus-80', img: 'orthoplus80.jpg', iso: 80, p: 1.25, after: 1, trust: 'sheet',
    fn: (t, p) => Math.pow(t, p),
    note: '',
    src: 'https://www.ilfordphoto.com/amfile/file/download/file/1948/product/1658/' },
  { brand: 'Ilford', name: 'Delta 400', slug: 'ilford-delta-400', img: 'delta400.jpg', iso: 400, p: 1.41, after: 1, trust: 'sheet',
    fn: (t, p) => Math.pow(t, p),
    note: '',
    src: 'https://www.ilfordphoto.com/amfile/file/download/file/1915/product/685/' },
  { brand: 'Kodak', name: 'Ultramax 400', slug: 'kodak-ultramax-400', img: 'ultramax400eastman.jpg', iso: 400, p: 1.3, after: 1, trust: 'untested',
    fn: (t, p) => Math.pow(t, p),
    note: 'The reciprocity data on this stock is untested — results may vary.',
    src: 'https://apps.kodakmoments.com/wp-content/uploads/2017/07/E7023_max_400.pdf' },
  { brand: 'Ilford', name: 'SFX 200', slug: 'ilford-sfx-200', img: 'sfx200.jpg', iso: 200, p: 1.43, after: 1, trust: 'sheet',
    fn: (t, p) => Math.pow(t, p),
    note: '',
    src: 'https://www.ilfordphoto.com/wp/wp-content/uploads/2024/05/Reciprocity-Failure-Compensation-v2.pdf' },
  { brand: 'Ilford', name: 'PAN F Plus 50', slug: 'ilford-pan-f-plus-50', img: 'panfplus.jpg', iso: 50, p: 1.33, after: 1, trust: 'sheet',
    fn: (t, p) => Math.pow(t, p),
    note: '',
    src: 'https://www.ilfordphoto.com/amfile/file/download/file/1905/product/699/' },
  { brand: 'Ilford', name: 'FP4 Plus 125', slug: 'ilford-fp4-plus-125', img: 'fp4plus.jpg', iso: 125, p: 1.26, after: 1, trust: 'sheet',
    fn: (t, p) => Math.pow(t, p),
    note: '',
    src: 'https://www.ilfordphoto.com/amfile/file/download/file/1919/product/686/' },
  { brand: 'Ilford', name: 'XP2 Super 400', slug: 'ilford-xp2-super-400', img: 'xp2.jpg', iso: 400, p: 1.31, after: 1, trust: 'sheet',
    fn: (t, p) => Math.pow(t, p),
    note: '',
    src: 'https://www.ilfordphoto.com/amfile/file/download/file/1909/product/703/' },
  { brand: 'Fujifilm', name: 'Velvia 50', slug: 'fujifilm-velvia-50', img: 'velvia50.jpg', iso: 50, p: 1, after: 3, trust: 'sheet',
    fn: (t, p) => t>=64?2.3*t:t>=32?2*t:pcSteps(t, [[4, 1/3], [8, 1/2], [16, 2/3]]),
    note: 'Exposures above 1 minute are not recommended, as it will produce a green tint.',
    src: 'https://asset.fujifilm.com/master/emea/files/2020-10/a71dda63e2662f012b3b74110794918a/films_velvia-50_datasheet_01.pdf' },
  { brand: 'Fujifilm', name: 'Velvia 100', slug: 'fujifilm-velvia-100', img: 'velvia100.jpg', iso: 100, p: 1, after: 60, trust: 'sheet',
    fn: (t, p) => t>=1920?2.3*t:t>=960?2*t:pcSteps(t, [[120, 1/3], [240, 1/2], [480, 2/3]]),
    note: '',
    src: 'https://asset.fujifilm.com/master/emea/files/2020-10/2f3c7f90a0b0c6e605e84f98b7d489c2/films_velvia-100_datasheet_01.pdf' },
  { brand: 'Fujifilm', name: 'Provia 100F', slug: 'fujifilm-provia-100f', img: 'provia100f.jpg', iso: 100, p: 1, after: 128, trust: 'sheet',
    fn: (t, p) => pcSteps(t, [[240, 1/3]]),
    note: 'Provia 100F handles reciprocity very well. However, exposures above 8 minutes are not recommended.',
    src: 'https://asset.fujifilm.com/master/emea/files/2020-10/2c27854d5609945fbe7e48afc61f815d/films_provia-100f_datasheet_01.pdf' },
  { brand: 'Kodak', name: 'Color Plus 200', slug: 'kodak-color-plus-200', img: 'colorplus.jpg', iso: 200, p: 1.3, after: 1, trust: 'untested',
    fn: (t, p) => Math.pow(t, p),
    note: 'Kodak publishes no data sheet for ColorPlus; the linked sheet is Gold 200\'s, the nearest film. The data is untested.',
    src: 'https://business.kodakmoments.com/sites/default/files/files/resources/E7022_Gold_200.pdf' },
  { brand: 'Fujifilm', name: 'Superia Reala 100', slug: 'fujifilm-superia-reala-100', img: 'reala100.jpg', iso: 100, p: 1.3, after: 1, trust: 'sheet',
    fn: (t, p) => pcSteps(t, [[4, 1/3], [16, 1]]),
    note: 'Exposures above 1 minute are not recommended.',
    src: 'https://asset.fujifilm.com/www/us/files/2020-03/3ab271f46f8d71c7e4c91bcedb7de050/ProfessionalFilmDataGuide.pdf' },
  { brand: 'Fujifilm', name: 'Pro 400H', slug: 'fujifilm-pro-400h', img: 'pro400h.jpg', iso: 400, p: 1.3, after: 1, trust: 'sheet',
    fn: (t, p) => pcSteps(t, [[4, 1/2], [16, 1]]),
    note: 'Exposures above 16 seconds are not recommended.',
    src: 'https://asset.fujifilm.com/master/emea/files/2020-10/a6cb96275e4957ddc7b3ca932b7755e5/films_pro-400h_datasheet_01.pdf' },
  { brand: 'Fujifilm', name: 'Superia X-TRA 400', slug: 'fujifilm-superia-x-tra-400', img: 'superiaxtra400.jpg', iso: 400, p: 1.161, after: 2, trust: 'sheet',
    fn: (t, p) => t>100?1.06*Math.pow(t, p):pcSteps(t, [[4, 1/3], [16, 2/3], [64, 1]]),
    note: '',
    src: 'https://asset.fujifilm.com/master/emea/files/2020-10/9a958fdcc6bd1442a06f71e134b811f6/films_superia-xtra400_datasheet_01.pdf' },
  { brand: 'Kodak', name: 'Tri-X 400', slug: 'kodak-tri-x-400', img: 'trix400.jpg', iso: 400, p: 1.54, after: .9, trust: 'sheet',
    fn: (t, p) => t>100?Math.pow(t, p):t*(2*Math.pow(Math.log10(t),2)+Math.log10(t)+2),
    note: 'Data for exposures above 3 minutes becomes unreliable.',
    src: 'https://imaging.kodakalaris.com/sites/default/files/files/resources/f4017_TriX.pdf, https://retro-pixel.com/film-reciprocity-tables/, https://www.flickr.com/photos/janokelly/6804638225/' },
  { brand: 'Kodak', name: 'T-Max 100', slug: 'kodak-t-max-100', img: 'tmax100.jpg', iso: 100, p: 1.15, after: .9, trust: 'sheet',
    fn: (t, p) => t*(1/6*Math.pow(Math.log10(t),2)+4/3),
    note: '',
    src: 'https://imaging.kodakalaris.com/sites/default/files/files/resources/f4016_TMax_100.pdf, https://retro-pixel.com/film-reciprocity-tables/, https://www.flickr.com/photos/janokelly/6804638225/' },
  { brand: 'Kodak', name: 'T-Max 400', slug: 'kodak-t-max-400', img: 'tmax400.jpg', iso: 400, p: 1.24, after: 1, trust: 'sheet',
    fn: (t, p) => t>100?Math.pow(t, p):t<=10?t*Math.pow(2, Math.log10(t)/3):Math.exp(Math.log(10*Math.pow(2, 1/3)) + (Math.log(300) - Math.log(10*Math.pow(2, 1/3))) * (Math.log10(t) - 1)),
    note: '',
    src: 'https://imaging.kodakalaris.com/sites/default/files/files/resources/f4043_TMax_400.pdf, https://retro-pixel.com/film-reciprocity-tables/, https://www.flickr.com/photos/janokelly/6804638225/' },
  { brand: 'Kodak', name: 'T-Max P3200', slug: 'kodak-t-max-p3200', img: 'tmaxp3200.jpg', iso: 3200, p: 1.426, after: 1, trust: 'sheet',
    fn: (t, p) => t*(7/6*Math.pow(Math.log10(t),2)-Math.log10(t)+4/3),
    note: 'Kodak gives a nominal speed of EI 800 (1000 in T-Max developer); 3200 is the push rating it is named for. The linked sheet is the 2007 T-Max films sheet (F-4016).',
    src: 'https://imaging.kodakalaris.com/sites/default/files/files/products/tmax100f4016.pdf, https://www.flickr.com/photos/janokelly/6804638225/' },
  { brand: 'Kodak', name: 'Pro Image 100', slug: 'kodak-pro-image-100', img: 'proimage100.jpg', iso: 100, p: 1.585, after: 10, trust: 'untested',
    fn: (t, p) => .274*Math.pow(t, p),
    note: 'The reciprocity data on this stock is untested — results may vary.',
    src: 'https://dreamartemis.wordpress.com/wp-content/uploads/2014/01/kodak-proimage-100.pdf' },
  { brand: 'Fujifilm', name: 'Fujicolor 100', slug: 'fujifilm-fujicolor-100', img: 'fujicolor100.jpg', iso: 100, p: 1.3, after: 2, trust: 'sheet',
    fn: (t, p) => pcSteps(t, [[4, 1/3], [16, 2/3], [64, 1]]),
    note: 'Fujifilm lists Superia 100 data sheet for Fujicolor 100, so they are assumed to be identical.',
    src: 'https://www.fujifilm.com.hk/products/consumer_film/pdf/superia_100_datasheet.pdf, https://www.flickr.com/photos/janokelly/6804638225/' },
  { brand: 'Fujifilm', name: 'Neopan 100 Acros II', slug: 'fujifilm-neopan-100-acros-ii', img: 'fujiacrosii.jpg', iso: 100, p: 1.3, after: 119, trust: 'sheet',
    fn: (t, p) => pcSteps(t, [[120, 1/2]]),
    note: 'Data for exposures above 16.5 minutes becomes unreliable.',
    src: 'https://asset.fujifilm.com/www/ca/files/2020-07/fb477bd9803b3c27ab592edcf9f3567c/AF3-0258E_PIB-NEOPAN-100-ACROSII-135-3_data-sheet.pdf, https://asset.fujifilm.com/www/us/files/2020-04/299395cd078366c7a2956af612ca9fdb/NeopanAcros100.pdf' },
  { brand: 'Fujifilm', name: 'C200', slug: 'fujifilm-fujicolor-c200', img: 'fujic200.jpg', iso: 200, p: 1.3, after: 2, trust: 'sheet',
    fn: (t, p) => pcSteps(t, [[4, 1/3], [16, 2/3], [64, 1]]),
    note: '',
    src: 'https://asset.fujifilm.com/master/emea/files/2020-10/98c3d5087c253f51c132a5d46059f131/films_c200_datasheet_01.pdf' },
  { brand: 'Fujifilm', name: 'Superia Premium 400', slug: 'fujifilm-superia-premium-400', img: 'superiapremium400.jpg', iso: 400, p: 1.161, after: 2, trust: 'untested',
    fn: (t, p) => t>100?1.06*Math.pow(t, p):pcSteps(t, [[4, 1/3], [16, 2/3], [64, 1]]),
    note: 'The reciprocity data on this stock is untested — results may vary.',
    src: 'https://asset.fujifilm.com/master/emea/files/2020-10/9a958fdcc6bd1442a06f71e134b811f6/films_superia-xtra400_datasheet_01.pdf' },
  { brand: 'Fujifilm', name: 'Provia 400F', slug: 'fujifilm-provia-400f', img: 'provia400f.jpg', iso: 400, p: 1, after: 32, trust: 'sheet',
    fn: (t, p) => { const s = (x, m, w) => 1 / (1 + Math.exp(-(Math.log(x) - Math.log(m)) / w)); return t * Math.pow(2, (2 / 3) * s(t, 90, 0.4) + (1 / 3) * s(t, 180, 0.5)) * 1.1273; },
    note: 'The reciprocity data for this film stock has been taken from Fujifilm\'s official data sheet and then smoothed out to give finer (and hopefully more accurate) compensations. Exposures above 8 minutes are not recommended.',
    src: 'https://asset.fujifilm.com/www/jp/files/2024-04/13bf604980eadaeec94e72018d04a8d8/datasheet_provia400f_01.pdf' },
];

window.PC_RECIP = PC_RECIP;
