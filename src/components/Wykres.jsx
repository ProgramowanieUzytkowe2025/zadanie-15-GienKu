import React, { useRef, useEffect } from 'react';

const Wykres = ({ historia }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || historia.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(50, 10);
        ctx.lineTo(50, canvas.height - 30);
        ctx.lineTo(canvas.width - 10, canvas.height - 30);
        ctx.stroke();

        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText('Długość', 5, 20);
        ctx.fillText('Iteracje', canvas.width - 50, canvas.height - 10);

        if (historia.length < 2) return;

        const wartosci = historia.map(h => h.dlugosc);
        const minY = Math.min(...wartosci) * 0.9;
        const maxY = Math.max(...wartosci) * 1.1;
        const maxX = historia.length;

        const scaleX = (x) => 50 + ((x - 1) / (maxX - 1)) * (canvas.width - 70);
        const scaleY = (y) => canvas.height - 30 - ((y - minY) / (maxY - minY)) * (canvas.height - 50);

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(scaleX(1), scaleY(historia[0].dlugosc));

        for (let i = 1; i < historia.length; i++) {
            ctx.lineTo(scaleX(i + 1), scaleY(historia[i].dlugosc));
        }
        ctx.stroke();

        ctx.fillStyle = 'red';
        historia.forEach((punkt, i) => {
            ctx.beginPath();
            ctx.arc(scaleX(i + 1), scaleY(punkt.dlugosc), 3, 0, 2 * Math.PI);
            ctx.fill();
        });

    }, [historia]);

    return (
        <div>
            <h2>Wykres postępu</h2>
            <canvas
                ref={canvasRef}
                width={600}
                height={300}
                style={{ border: '1px solid black' }}
            />
        </div>
    );
};

export default Wykres;
