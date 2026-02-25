import React, { useEffect, useRef } from 'react';

interface Particle {
    ix: number; // ideal grid x
    iy: number; // ideal grid y
    x: number;  // current x
    y: number;  // current y
    z: number;  // current z (height for wave)
    vx: number; // velocity x
    vy: number; // velocity y
    vz: number; // velocity z
    baseSize: number;
    baseColor: string;
    isGold: boolean;
    phase: number;
}

const ParticleBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ rx: 0, ry: 0, px: 0, py: 0 });
    const scrollRef = useRef(0);
    const parallaxRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
    const timeRef = useRef(0);
    const rotationRef = useRef({ pitch: 0, yaw: 0, targetPitch: 0, targetYaw: 0 });

    // Store particles in a 2D grid for neighbor-lookup performance
    const gridRef = useRef<Particle[][]>([]);
    const gridDim = useRef({ cols: 0, rows: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        // Physics Settings: Refined for Traveling Ripples & Subtlety
        const spacing = 32;
        const springK = 0.012; // Softer spring to origin (less tense, slower bounce)
        const waveCoupling = 0.02; // Strength of neighbor influence (Wave propagation)
        const friction = 0.92; // Sustained waves
        const parallaxStrength = 80;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const handleScroll = () => {
            scrollRef.current = window.scrollY;
        };

        const initParticles = () => {
            // The 3D perspective scaling (tz=650, perspective=800/1450) shrinks the grid visually.
            // We expand the grid size significantly so it fully covers the screen even when rotated.
            const perspectiveScaleFactor = 3.5;
            const gridW = (canvas.width + parallaxStrength * 4) * perspectiveScaleFactor;
            const gridH = (canvas.height + parallaxStrength * 4) * perspectiveScaleFactor;
            const cols = Math.ceil(gridW / spacing) + 4;
            const rows = Math.ceil(gridH / spacing) + 4;

            gridDim.current = { cols, rows };

            const grid: Particle[][] = [];
            for (let y = 0; y < rows; y++) {
                const row: Particle[] = [];
                for (let x = 0; x < cols; x++) {
                    const isGold = Math.random() > 0.93;
                    const ix = (x - cols / 2) * spacing;
                    const iy = (y - rows / 2) * spacing;
                    row.push({
                        ix, iy,
                        x: ix, y: iy, z: 0,
                        vx: 0, vy: 0, vz: 0,
                        baseSize: isGold ? Math.random() * 1.5 + 1.2 : Math.random() * 0.7 + 0.4,
                        baseColor: '214, 160, 75',
                        isGold: isGold,
                        phase: Math.random() * Math.PI * 2
                    });
                }
                grid.push(row);
            }
            gridRef.current = grid;
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            timeRef.current += 0.01;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const mouseGridX = mouseRef.current.rx - centerX;
            const mouseGridY = mouseRef.current.ry - centerY;

            const mvx = mouseRef.current.rx - mouseRef.current.px;
            const mvy = mouseRef.current.ry - mouseRef.current.py;
            mouseRef.current.px = mouseRef.current.rx;
            mouseRef.current.py = mouseRef.current.ry;

            parallaxRef.current.targetX = (mouseGridX / (canvas.width || 1)) * -parallaxStrength;
            parallaxRef.current.targetY = (mouseGridY / (canvas.height || 1)) * -parallaxStrength + (scrollRef.current * -0.15);

            parallaxRef.current.x += (parallaxRef.current.targetX - parallaxRef.current.x) * 0.05;
            parallaxRef.current.y += (parallaxRef.current.targetY - parallaxRef.current.y) * 0.05;

            const maxRotation = 0.25;
            rotationRef.current.targetPitch = (mouseGridY / (canvas.height / 2)) * maxRotation;
            rotationRef.current.targetYaw = -(mouseGridX / (canvas.width / 2)) * maxRotation;

            rotationRef.current.pitch += (rotationRef.current.targetPitch - rotationRef.current.pitch) * 0.02;
            rotationRef.current.yaw += (rotationRef.current.targetYaw - rotationRef.current.yaw) * 0.02;

            const { pitch, yaw } = rotationRef.current;
            const cosP = Math.cos(pitch);
            const sinP = Math.sin(pitch);
            const cosY = Math.cos(yaw);
            const sinY = Math.sin(yaw);

            const grid = gridRef.current;
            const { cols, rows } = gridDim.current;

            // Update Physics
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const p = grid[y][x];

                    // 1. WAVE PROPAGATION (Neighbor Coupling)
                    // Laplacian: sum of differences with neighbors
                    let neighborSum = 0;
                    let neighbors = 0;
                    if (x > 0) { neighborSum += grid[y][x - 1].z; neighbors++; }
                    if (x < cols - 1) { neighborSum += grid[y][x + 1].z; neighbors++; }
                    if (y > 0) { neighborSum += grid[y - 1][x].z; neighbors++; }
                    if (y < rows - 1) { neighborSum += grid[y + 1][x].z; neighbors++; }

                    const laplacian = (neighborSum / neighbors) - p.z;
                    p.vz += laplacian * waveCoupling;

                    // 2. NO ORGANIC DRIFT (Flat when still)
                    const targetZ = 0;

                    const az = (targetZ - p.z) * springK;
                    p.vz += az;

                    // 3. MOUSE INTERACTION (Local Ripple Injection)
                    const visualX = p.x + parallaxRef.current.x;
                    const visualY = p.y + parallaxRef.current.y;
                    const dx = visualX - mouseGridX;
                    const dy = visualY - mouseGridY;
                    const distToMouse = Math.sqrt(dx * dx + dy * dy);
                    const influenceRadius = 720; // 3x the previous 240

                    let interactionPower = 0;
                    if (distToMouse < influenceRadius) {
                        const normDist = distToMouse / influenceRadius;
                        interactionPower = Math.pow(1 - normDist, 2);

                        // Only inject movement energy if the mouse is actually moving
                        const mouseSpeed = Math.abs(mvx) + Math.abs(mvy);
                        if (mouseSpeed > 0.1) {
                            // Injection of energy into the wave system
                            const waveImpulse = Math.sin(normDist * 10 - timeRef.current * 6) * 1.5;
                            p.vz += interactionPower * 3 + interactionPower * waveImpulse;

                            // Edge-to-edge XY repulsion (subtle)
                            const xyForce = interactionPower * 0.05;
                            p.vx += (dx / distToMouse) * xyForce;
                            p.vy += (dy / distToMouse) * xyForce;

                            p.vx += mvx * interactionPower * 0.01;
                            p.vy += mvy * interactionPower * 0.01;
                        }
                    }

                    // 4. INTEGRATION
                    const ax = (p.ix - p.x) * springK;
                    const ay = (p.iy - p.y) * springK;
                    p.vx += ax;
                    p.vy += ay;

                    p.vx *= friction;
                    p.vy *= friction;
                    p.vz *= friction;

                    p.x += p.vx;
                    p.y += p.vy;
                    p.z += p.vz;

                    // 5. PROJECTION & DRAW
                    let rx = p.x;
                    let ry = p.y;
                    let rz = p.z;

                    let tempY = ry * cosP - rz * sinP;
                    let tempZ = ry * sinP + rz * cosP;
                    ry = tempY;
                    rz = tempZ;

                    let tempX = rx * cosY + rz * sinY;
                    tempZ = -rx * sinY + rz * cosY;
                    rx = tempX;
                    rz = tempZ;

                    const tz = rz + 650;
                    const perspective = 800 / (800 + tz);
                    const projectedX = centerX + (rx + parallaxRef.current.x) * perspective;
                    const projectedY = centerY + (ry + parallaxRef.current.y) * perspective;

                    const zFocus = 650;
                    const zDiff = Math.max(0, tz - zFocus);
                    const blurFactor = 1 + (zDiff / 90);

                    const brightnessBoost = 1 + interactionPower * 3.5;
                    const radius = p.baseSize * perspective * 2.2 * blurFactor * (p.isGold ? 1.2 : 1.0);

                    const alphaBase = p.isGold ? 0.7 : 0.455; // Reduced brightness by 30%
                    const alpha = Math.min(1.0, alphaBase * (1 / blurFactor) * brightnessBoost);

                    const gradient = ctx.createRadialGradient(
                        projectedX, projectedY, 0,
                        projectedX, projectedY, radius
                    );

                    gradient.addColorStop(0, `rgba(${p.baseColor}, ${alpha})`);
                    gradient.addColorStop(0.4, `rgba(${p.baseColor}, ${alpha * 0.35})`);
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                    ctx.beginPath();
                    ctx.fillStyle = gradient;
                    ctx.arc(projectedX, projectedY, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.rx = e.clientX;
            mouseRef.current.ry = e.clientY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        handleResize();
        draw();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 0,
                background: '#030303'
            }}
        />
    );
};

export default ParticleBackground;
