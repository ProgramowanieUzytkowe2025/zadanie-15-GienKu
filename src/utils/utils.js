
export async function parseLanesFromFile(file) {
    if (!file) {
        throw new Error("Nie podano pliku.");
    }
    const text = await file.text();
    const lanes = text
        .trim()
        .split(/\n\s*\n/)
        .map((laneText) =>
            laneText.split(/\n+/).map((line) => {
                const parts = line.trim().split(/\s+/);

                if (parts.length < 3) {
                    throw new Error('Zły format linii: ' + line);
                }

                return {
                    id: parseInt(parts[0]),
                    x: parseFloat(parts[1]),
                    y: parseFloat(parts[2]),
                };
            })
        );

    return lanes;
}

export function obliczOdleglosc(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function obliczDlugoscTrasy(punkty, kolejnosc) {
    let dlugosc = 0;
    for (let i = 0; i < kolejnosc.length; i++) {
        const obecny = punkty.find(p => p.id === kolejnosc[i]);
        const nastepny = punkty.find(p => p.id === kolejnosc[(i + 1) % kolejnosc.length]);
        dlugosc += obliczOdleglosc(obecny, nastepny);
    }
    return dlugosc;
}

export function losujKolejnosc(ids) {
    const kopia = [...ids];
    for (let i = kopia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [kopia[i], kopia[j]] = [kopia[j], kopia[i]];
    }
    return kopia;
}