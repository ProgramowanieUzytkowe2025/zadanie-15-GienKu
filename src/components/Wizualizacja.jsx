import React, { useState, useRef, useEffect } from 'react';
import { parseLanesFromFile } from '../utils/utils';

const Wizualizacja = ({ points, setPoints, rozwiazanie, pokazTrase, setPokazTrase }) => {
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setError('');
        setFileName(file.name);
        try {
            const parsedPoints = await parseLanesFromFile(file);

            if (parsedPoints.length === 0) {
                setError('Nie znaleziono punktów w pliku. Sprawdź format.');
                return;
            }
            setPoints(parsedPoints.flat());
            console.log('Wczytano punkty:', parsedPoints);
        } catch (err) {
            setError('Błąd parsowania pliku: ' + err.message);
            console.error(err);
        }
    };

    const handlePokazRozwiazanie = () => {
        setPokazTrase(!pokazTrase);
    };

    useEffect(() => {
        if (points.length === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        const minX = Math.min(...xs) - 40;
        const maxX = Math.max(...xs) + 40;
        const minY = Math.min(...ys) - 40;
        const maxY = Math.max(...ys) + 40;

        const scaleX = (x) => ((x - minX) / (maxX - minX)) * canvas.width;
        const scaleY = (y) => canvas.height - ((y - minY) / (maxY - minY)) * canvas.height;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (pokazTrase && rozwiazanie && rozwiazanie.length > 0) {
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.beginPath();

            for (let i = 0; i < rozwiazanie.length; i++) {
                const obecnyId = rozwiazanie[i];
                const nastepnyId = rozwiazanie[(i + 1) % rozwiazanie.length];
                const obecny = points.find(p => p.id === obecnyId);
                const nastepny = points.find(p => p.id === nastepnyId);

                if (obecny && nastepny) {
                    if (i === 0) {
                        ctx.moveTo(scaleX(obecny.x), scaleY(obecny.y));
                    }
                    ctx.lineTo(scaleX(nastepny.x), scaleY(nastepny.y));
                }
            }
            ctx.stroke();
        }

        ctx.fillStyle = 'blue';
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(scaleX(point.x), scaleY(point.y), 5, 0, 2 * Math.PI);
            ctx.fill();
        });

        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        points.forEach(point => {
            ctx.fillText(point.id, scaleX(point.x) + 8, scaleY(point.y) - 8);
        });
    }, [points, rozwiazanie, pokazTrase]);

    return (
        <div>
            <h2>Wizualizacja problemu</h2>

            <div style={{ marginBottom: '20px' }}>
                <h3>Wczytaj plik z danymi TSP:</h3>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            </div>

            {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    {error}
                </div>
            )}

            {fileName && !error && (
                <div style={{ marginBottom: '10px' }}>
                    <strong>Wczytany plik:</strong> {fileName}
                </div>
            )}

            {points.length > 0 && (
                <div>
                    <h3>Wizualizacja punktów ({points.length}):</h3>
                    <button onClick={handlePokazRozwiazanie} style={{ marginBottom: '10px' }}>
                        {pokazTrase ? 'Ukryj rozwiązanie' : 'Pokaż rozwiązanie'}
                    </button>
                    <br />
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        style={{ border: '1px solid black', marginBottom: '20px' }}
                    />
                </div>
            )}
        </div>
    );
};

export default Wizualizacja;