import React, { useState, useEffect } from 'react';
import './App.css';
import Wizualizacja from './components/Wizualizacja';
import Sciezka from './components/Sciezka';
import Szukaj from './components/Szukaj';
import Wykres from './components/Wykres';
import { obliczDlugoscTrasy, losujKolejnosc } from './utils/utils';

export default function App() {
    const [points, setPoints] = useState([]);
    const [rozwiazanie, setRozwiazanie] = useState({ kolejnosc: [], dlugosc: Infinity });
    const [pokazTrase, setPokazTrase] = useState(false);
    const [historia, setHistoria] = useState([]);

    useEffect(() => {
        if (points.length > 0) {
            const ids = points.map(p => p.id);
            const poczatkowaKolejnosc = losujKolejnosc(ids);
            const poczatkowaDlugosc = obliczDlugoscTrasy(points, poczatkowaKolejnosc);
            setRozwiazanie({ kolejnosc: poczatkowaKolejnosc, dlugosc: poczatkowaDlugosc });
            setHistoria([{ iteracja: 0, dlugosc: poczatkowaDlugosc }]);
        }
    }, [points]);

    const handleNoweRozwiazanie = (nowaKolejnosc, nowaDlugosc) => {
        setRozwiazanie({ kolejnosc: nowaKolejnosc, dlugosc: nowaDlugosc });
    };

    const handleIteracja = (numerIteracji, dlugoscIteracji) => {
        setHistoria(prev => [...prev, { iteracja: numerIteracji, dlugosc: dlugoscIteracji }]);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Aplikacja TSP - Problem Komiwojażera</h1>
            
            <Wizualizacja 
                points={points} 
                setPoints={setPoints} 
                rozwiazanie={rozwiazanie.kolejnosc}
                pokazTrase={pokazTrase}
                setPokazTrase={setPokazTrase}
            />
            
            <hr />
            
            <Sciezka 
                rozwiazanie={rozwiazanie.kolejnosc} 
                dlugoscTrasy={rozwiazanie.dlugosc} 
            />
            
            <hr />
            
            <Szukaj 
                punkty={points}
                aktualneRozwiazanie={rozwiazanie}
                onNoweRozwiazanie={handleNoweRozwiazanie}
                onIteracja={handleIteracja}
            />
            
            <hr />
            
            <Wykres historia={historia} />
        </div>
    );
}
