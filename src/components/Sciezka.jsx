import React from 'react';

const Sciezka = ({ rozwiazanie, dlugoscTrasy }) => {
    if (!rozwiazanie || rozwiazanie.length === 0) {
        return (
            <div>
                <h2>Rozwiązanie</h2>
                <p>Brak rozwiązania - wczytaj najpierw plik z punktami.</p>
            </div>
        );
    }

    const tekstRozwiazania = rozwiazanie.join(' -> ');

    return (
        <div>
            <h2>Rozwiązanie</h2>
            <div style={{ wordWrap: 'break-word', maxWidth: '800px' }}>
                {tekstRozwiazania}
            </div>
            <p>
                <strong>Długość trasy:</strong> {dlugoscTrasy.toFixed(2)}
            </p>
        </div>
    );
};

export default Sciezka;
