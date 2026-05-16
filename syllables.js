function sillabizza(parola) {
  return parola
    .replace(/([aeiouàèéìòóù])/gi, "$1-")
    .split("-")
    .filter(s => s.length > 0);
}

function sillabizzaTesto(testo) {
  const parole = testo
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");

  let sillabe = [];
  parole.forEach(p => {
    if (p.trim().length > 0) {
      sillabe.push(...sillabizza(p));
    }
  });
  return sillabe;
}
