import React, { useState, useEffect, useRef } from 'react';
import { obliczDlugoscTrasy, losujKolejnosc } from '../utils/utils';

const Szukaj = ({ punkty, aktualneRozwiazanie, onNoweRozwiazanie, onIteracja }) => {
    const [dziala, setDziala] = useState(false);
    const [iteracje, setIteracje] = useState(0);
    const intervalRef = useRef(null);
    const aktualneRozwiazanieRef = useRef(aktualneRozwiazanie);

    useEffect(() => {
        aktualneRozwiazanieRef.current = aktualneRozwiazanie;
    }, [aktualneRozwiazanie]);

    const uruchomAlgorytm = () => {
        if (!punkty || punkty.length === 0) return;

        setDziala(true);

        intervalRef.current = setInterval(() => {
            const nowaKolejnosc = losujKolejnosc(punkty.map(p => p.id));
            const nowaDlugosc = obliczDlugoscTrasy(punkty, nowaKolejnosc);

            setIteracje(prev => {
                const nowaIteracja = prev + 1;
                onIteracja(nowaIteracja, nowaDlugosc);
                return nowaIteracja;
            });

            if (nowaDlugosc < aktualneRozwiazanieRef.current.dlugosc) {
                onNoweRozwiazanie(nowaKolejnosc, nowaDlugosc);
            }
        }, 5000);
    };

    const zatrzymajAlgorytm = () => {
        setDziala(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const handleClick = () => {
        if (dziala) {
            zatrzymajAlgorytm();
        } else {
            uruchomAlgorytm();
        }
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div>
            <button onClick={handleClick} disabled={!punkty || punkty.length === 0}>
                {dziala ? 'Przerwa' : 'Szukaj rozwiązania'}
            </button>
            <span style={{ marginLeft: '10px' }}>
                Liczba iteracji: {iteracje}
            </span>
        </div>
    );
};

export default Szukaj;
