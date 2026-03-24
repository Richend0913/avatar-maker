/**
 * Avatar Renderer - Canvas 2D drawing functions
 * Draws cute cartoon-style avatars using geometric shapes, arcs, and bezier curves.
 */

function renderAvatar(canvas, state) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const S = W / 300; // scale factor (base design is 300x300)
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // ─── Background ───
    drawBackground(ctx, W, H, state);

    // ─── Face ───
    drawFace(ctx, cx, cy, S, state);

    // ─── Ears ───
    drawEars(ctx, cx, cy, S, state);

    // ─── Hair (back layer) ───
    drawHairBack(ctx, cx, cy, S, state);

    // ─── Eyes ───
    drawEyes(ctx, cx, cy, S, state);

    // ─── Eyebrows ───
    drawEyebrows(ctx, cx, cy, S, state);

    // ─── Nose ───
    drawNose(ctx, cx, cy, S, state);

    // ─── Mouth ───
    drawMouth(ctx, cx, cy, S, state);

    // ─── Blush ───
    drawBlush(ctx, cx, cy, S, state);

    // ─── Hair (front layer) ───
    drawHairFront(ctx, cx, cy, S, state);

    // ─── Accessory ───
    drawAccessory(ctx, cx, cy, S, state);
}

// ─── Background ───────────────────────────────────────────
function drawBackground(ctx, W, H, state) {
    if (state.bgGradient && state.bgGradientColor) {
        const grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, state.bgColor);
        grad.addColorStop(1, state.bgGradientColor);
        ctx.fillStyle = grad;
    } else {
        ctx.fillStyle = state.bgColor || '#E8D5FF';
    }
    ctx.fillRect(0, 0, W, H);
}

// ─── Face Shapes ──────────────────────────────────────────
function drawFace(ctx, cx, cy, S, state) {
    ctx.save();
    ctx.fillStyle = state.skinColor || '#FDDCB5';

    const faceY = cy + 10 * S;
    const shape = state.faceShape || 0;

    ctx.beginPath();
    switch (shape) {
        case 0: // Round
            ctx.ellipse(cx, faceY, 95 * S, 100 * S, 0, 0, Math.PI * 2);
            break;
        case 1: // Oval / elongated
            ctx.ellipse(cx, faceY, 82 * S, 110 * S, 0, 0, Math.PI * 2);
            break;
        case 2: // Square-ish
            roundedRect(ctx, cx - 90 * S, faceY - 95 * S, 180 * S, 200 * S, 40 * S);
            break;
        case 3: // Heart
            // Wider top, narrower chin
            ctx.moveTo(cx, faceY + 105 * S);
            ctx.bezierCurveTo(cx - 20 * S, faceY + 70 * S, cx - 100 * S, faceY + 30 * S, cx - 90 * S, faceY - 30 * S);
            ctx.bezierCurveTo(cx - 80 * S, faceY - 80 * S, cx - 30 * S, faceY - 100 * S, cx, faceY - 70 * S);
            ctx.bezierCurveTo(cx + 30 * S, faceY - 100 * S, cx + 80 * S, faceY - 80 * S, cx + 90 * S, faceY - 30 * S);
            ctx.bezierCurveTo(cx + 100 * S, faceY + 30 * S, cx + 20 * S, faceY + 70 * S, cx, faceY + 105 * S);
            break;
    }
    ctx.fill();

    // Face outline
    ctx.strokeStyle = darkenColor(state.skinColor || '#FDDCB5', 0.15);
    ctx.lineWidth = 2 * S;
    ctx.stroke();
    ctx.restore();
}

// ─── Ears ─────────────────────────────────────────────────
function drawEars(ctx, cx, cy, S, state) {
    ctx.save();
    const faceY = cy + 10 * S;
    ctx.fillStyle = state.skinColor || '#FDDCB5';
    const skinDark = darkenColor(state.skinColor || '#FDDCB5', 0.1);

    // Left ear
    ctx.beginPath();
    ctx.ellipse(cx - 90 * S, faceY - 5 * S, 16 * S, 22 * S, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = skinDark;
    ctx.lineWidth = 1.5 * S;
    ctx.stroke();

    // Inner ear
    ctx.beginPath();
    ctx.ellipse(cx - 90 * S, faceY - 3 * S, 8 * S, 12 * S, 0, 0, Math.PI * 2);
    ctx.fillStyle = darkenColor(state.skinColor || '#FDDCB5', 0.08);
    ctx.fill();

    // Right ear
    ctx.fillStyle = state.skinColor || '#FDDCB5';
    ctx.beginPath();
    ctx.ellipse(cx + 90 * S, faceY - 5 * S, 16 * S, 22 * S, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = skinDark;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx + 90 * S, faceY - 3 * S, 8 * S, 12 * S, 0, 0, Math.PI * 2);
    ctx.fillStyle = darkenColor(state.skinColor || '#FDDCB5', 0.08);
    ctx.fill();

    ctx.restore();
}

// ─── Eyes ─────────────────────────────────────────────────
function drawEyes(ctx, cx, cy, S, state) {
    ctx.save();
    const eyeY = cy + 5 * S;
    const eyeSpacing = 32 * S;
    const eyeColor = state.eyeColor || '#2C1810';
    const style = state.eyeStyle || 0;

    [-1, 1].forEach(side => {
        const ex = cx + side * eyeSpacing;

        switch (style) {
            case 0: // Round big
                // White
                ctx.beginPath();
                ctx.ellipse(ex, eyeY, 18 * S, 20 * S, 0, 0, Math.PI * 2);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1.5 * S;
                ctx.stroke();
                // Iris
                ctx.beginPath();
                ctx.ellipse(ex, eyeY + 2 * S, 12 * S, 13 * S, 0, 0, Math.PI * 2);
                ctx.fillStyle = eyeColor;
                ctx.fill();
                // Pupil
                ctx.beginPath();
                ctx.arc(ex, eyeY + 3 * S, 5 * S, 0, Math.PI * 2);
                ctx.fillStyle = '#111';
                ctx.fill();
                // Highlight
                ctx.beginPath();
                ctx.arc(ex + 4 * S, eyeY - 3 * S, 4 * S, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(ex - 2 * S, eyeY + 5 * S, 2 * S, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.fill();
                break;

            case 1: // Almond
                ctx.beginPath();
                ctx.moveTo(ex - 18 * S, eyeY);
                ctx.quadraticCurveTo(ex, eyeY - 18 * S, ex + 18 * S, eyeY);
                ctx.quadraticCurveTo(ex, eyeY + 12 * S, ex - 18 * S, eyeY);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1.5 * S;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(ex + 2 * S, eyeY, 8 * S, 0, Math.PI * 2);
                ctx.fillStyle = eyeColor;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(ex + 2 * S, eyeY + 1 * S, 4 * S, 0, Math.PI * 2);
                ctx.fillStyle = '#111';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(ex + 5 * S, eyeY - 3 * S, 3 * S, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.fill();
                break;

            case 2: // Cat-eye
                ctx.beginPath();
                ctx.moveTo(ex - 18 * S, eyeY + 3 * S);
                ctx.quadraticCurveTo(ex, eyeY - 20 * S, ex + 20 * S, eyeY - 6 * S);
                ctx.quadraticCurveTo(ex, eyeY + 14 * S, ex - 18 * S, eyeY + 3 * S);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1.5 * S;
                ctx.stroke();
                // Vertical pupil
                ctx.beginPath();
                ctx.ellipse(ex + 2 * S, eyeY, 5 * S, 10 * S, 0, 0, Math.PI * 2);
                ctx.fillStyle = eyeColor;
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(ex + 2 * S, eyeY + 1 * S, 2 * S, 7 * S, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#111';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(ex + 5 * S, eyeY - 4 * S, 2.5 * S, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.fill();
                break;

            case 3: // Sleepy / half-closed
                ctx.beginPath();
                ctx.moveTo(ex - 16 * S, eyeY);
                ctx.quadraticCurveTo(ex, eyeY - 8 * S, ex + 16 * S, eyeY);
                ctx.quadraticCurveTo(ex, eyeY + 10 * S, ex - 16 * S, eyeY);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1.5 * S;
                ctx.stroke();
                // Eyelid
                ctx.beginPath();
                ctx.moveTo(ex - 16 * S, eyeY);
                ctx.quadraticCurveTo(ex, eyeY - 8 * S, ex + 16 * S, eyeY);
                ctx.quadraticCurveTo(ex, eyeY + 2 * S, ex - 16 * S, eyeY);
                ctx.fillStyle = state.skinColor || '#FDDCB5';
                ctx.fill();
                // Small iris
                ctx.beginPath();
                ctx.arc(ex, eyeY + 3 * S, 6 * S, 0, Math.PI * 2);
                ctx.fillStyle = eyeColor;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(ex, eyeY + 3 * S, 3 * S, 0, Math.PI * 2);
                ctx.fillStyle = '#111';
                ctx.fill();
                break;

            case 4: // Sparkle / star eyes
                ctx.beginPath();
                ctx.ellipse(ex, eyeY, 17 * S, 19 * S, 0, 0, Math.PI * 2);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1.5 * S;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(ex, eyeY + 1 * S, 12 * S, 0, Math.PI * 2);
                ctx.fillStyle = eyeColor;
                ctx.fill();
                // Star highlight
                drawStar(ctx, ex + 3 * S, eyeY - 3 * S, 5, 5 * S, 2 * S);
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(ex - 3 * S, eyeY + 4 * S, 2.5 * S, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.fill();
                break;

            case 5: // Dot eyes (simple cute)
                ctx.beginPath();
                ctx.arc(ex, eyeY, 7 * S, 0, Math.PI * 2);
                ctx.fillStyle = '#111';
                ctx.fill();
                // Highlight
                ctx.beginPath();
                ctx.arc(ex + 2 * S, eyeY - 2 * S, 2.5 * S, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.fill();
                break;

            case 6: // Wink (right eye closed)
                if (side === -1) {
                    // Normal open eye
                    ctx.beginPath();
                    ctx.ellipse(ex, eyeY, 16 * S, 18 * S, 0, 0, Math.PI * 2);
                    ctx.fillStyle = 'white';
                    ctx.fill();
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 1.5 * S;
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(ex, eyeY + 1 * S, 10 * S, 0, Math.PI * 2);
                    ctx.fillStyle = eyeColor;
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(ex, eyeY + 2 * S, 5 * S, 0, Math.PI * 2);
                    ctx.fillStyle = '#111';
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(ex + 4 * S, eyeY - 3 * S, 3 * S, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255,255,255,0.85)';
                    ctx.fill();
                } else {
                    // Wink
                    ctx.beginPath();
                    ctx.moveTo(ex - 14 * S, eyeY);
                    ctx.quadraticCurveTo(ex, eyeY + 10 * S, ex + 14 * S, eyeY);
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 2.5 * S;
                    ctx.stroke();
                }
                break;

            case 7: // X eyes (fun/dizzy)
                ctx.save();
                ctx.strokeStyle = eyeColor;
                ctx.lineWidth = 3 * S;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(ex - 8 * S, eyeY - 8 * S);
                ctx.lineTo(ex + 8 * S, eyeY + 8 * S);
                ctx.moveTo(ex + 8 * S, eyeY - 8 * S);
                ctx.lineTo(ex - 8 * S, eyeY + 8 * S);
                ctx.stroke();
                ctx.restore();
                break;
        }
    });

    ctx.restore();
}

// ─── Eyebrows ─────────────────────────────────────────────
function drawEyebrows(ctx, cx, cy, S, state) {
    ctx.save();
    const browY = cy - 18 * S;
    const browSpacing = 32 * S;
    const style = state.eyebrowStyle || 0;
    ctx.strokeStyle = darkenColor(state.hairColor || '#2C1810', 0.1);
    ctx.lineWidth = 3 * S;
    ctx.lineCap = 'round';

    [-1, 1].forEach(side => {
        const bx = cx + side * browSpacing;
        ctx.beginPath();
        switch (style) {
            case 0: // Natural arch
                ctx.moveTo(bx - 14 * S * side, browY + 2 * S);
                ctx.quadraticCurveTo(bx, browY - 6 * S, bx + 14 * S * side, browY);
                break;
            case 1: // Straight
                ctx.moveTo(bx - 14 * S, browY);
                ctx.lineTo(bx + 14 * S, browY);
                break;
            case 2: // Thick
                ctx.lineWidth = 5 * S;
                ctx.moveTo(bx - 14 * S * side, browY + 1 * S);
                ctx.quadraticCurveTo(bx, browY - 6 * S, bx + 14 * S * side, browY);
                break;
            case 3: // Thin high arch
                ctx.lineWidth = 2 * S;
                ctx.moveTo(bx - 12 * S * side, browY + 4 * S);
                ctx.quadraticCurveTo(bx, browY - 10 * S, bx + 12 * S * side, browY + 2 * S);
                break;
            case 4: // Angry
                ctx.moveTo(bx - 14 * S * side, browY - 4 * S);
                ctx.lineTo(bx + 10 * S * side, browY + 6 * S);
                break;
        }
        ctx.stroke();
    });
    ctx.restore();
}

// ─── Nose ─────────────────────────────────────────────────
function drawNose(ctx, cx, cy, S, state) {
    ctx.save();
    const noseY = cy + 22 * S;
    ctx.fillStyle = darkenColor(state.skinColor || '#FDDCB5', 0.1);
    ctx.strokeStyle = darkenColor(state.skinColor || '#FDDCB5', 0.18);
    ctx.lineWidth = 1.5 * S;
    ctx.lineCap = 'round';

    // Simple cute nose - small curved line
    ctx.beginPath();
    ctx.moveTo(cx - 4 * S, noseY);
    ctx.quadraticCurveTo(cx, noseY + 6 * S, cx + 4 * S, noseY);
    ctx.stroke();

    // Tiny nose dot
    ctx.beginPath();
    ctx.arc(cx, noseY + 2 * S, 2 * S, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// ─── Mouth ────────────────────────────────────────────────
function drawMouth(ctx, cx, cy, S, state) {
    ctx.save();
    const mouthY = cy + 42 * S;
    const style = state.mouthStyle || 0;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (style) {
        case 0: // Happy smile
            ctx.beginPath();
            ctx.moveTo(cx - 18 * S, mouthY - 2 * S);
            ctx.quadraticCurveTo(cx, mouthY + 18 * S, cx + 18 * S, mouthY - 2 * S);
            ctx.strokeStyle = '#C0392B';
            ctx.lineWidth = 2.5 * S;
            ctx.stroke();
            // Fill smile
            ctx.beginPath();
            ctx.moveTo(cx - 16 * S, mouthY);
            ctx.quadraticCurveTo(cx, mouthY + 14 * S, cx + 16 * S, mouthY);
            ctx.fillStyle = '#E74C3C';
            ctx.fill();
            // Tongue hint
            ctx.beginPath();
            ctx.ellipse(cx, mouthY + 8 * S, 6 * S, 4 * S, 0, 0, Math.PI);
            ctx.fillStyle = '#FF8A80';
            ctx.fill();
            break;

        case 1: // Closed smile
            ctx.beginPath();
            ctx.moveTo(cx - 16 * S, mouthY);
            ctx.quadraticCurveTo(cx, mouthY + 12 * S, cx + 16 * S, mouthY);
            ctx.strokeStyle = '#C0392B';
            ctx.lineWidth = 2.5 * S;
            ctx.stroke();
            break;

        case 2: // Open mouth (surprised)
            ctx.beginPath();
            ctx.ellipse(cx, mouthY + 4 * S, 12 * S, 14 * S, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#C0392B';
            ctx.fill();
            ctx.strokeStyle = '#8B0000';
            ctx.lineWidth = 2 * S;
            ctx.stroke();
            // Inner mouth
            ctx.beginPath();
            ctx.ellipse(cx, mouthY + 6 * S, 8 * S, 9 * S, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#6B0000';
            ctx.fill();
            // Tongue
            ctx.beginPath();
            ctx.ellipse(cx, mouthY + 14 * S, 6 * S, 5 * S, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#FF8A80';
            ctx.fill();
            break;

        case 3: // Neutral
            ctx.beginPath();
            ctx.moveTo(cx - 14 * S, mouthY + 2 * S);
            ctx.lineTo(cx + 14 * S, mouthY + 2 * S);
            ctx.strokeStyle = '#C0392B';
            ctx.lineWidth = 2.5 * S;
            ctx.stroke();
            break;

        case 4: // Cat mouth :3
            ctx.beginPath();
            ctx.moveTo(cx - 16 * S, mouthY + 2 * S);
            ctx.quadraticCurveTo(cx - 5 * S, mouthY + 10 * S, cx, mouthY);
            ctx.quadraticCurveTo(cx + 5 * S, mouthY + 10 * S, cx + 16 * S, mouthY + 2 * S);
            ctx.strokeStyle = '#C0392B';
            ctx.lineWidth = 2.5 * S;
            ctx.stroke();
            break;

        case 5: // Smirk
            ctx.beginPath();
            ctx.moveTo(cx - 10 * S, mouthY + 2 * S);
            ctx.quadraticCurveTo(cx + 5 * S, mouthY + 12 * S, cx + 18 * S, mouthY - 4 * S);
            ctx.strokeStyle = '#C0392B';
            ctx.lineWidth = 2.5 * S;
            ctx.stroke();
            break;
    }
    ctx.restore();
}

// ─── Blush ────────────────────────────────────────────────
function drawBlush(ctx, cx, cy, S, state) {
    ctx.save();
    const blushY = cy + 20 * S;
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#FF6B9D';

    ctx.beginPath();
    ctx.ellipse(cx - 48 * S, blushY, 14 * S, 8 * S, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(cx + 48 * S, blushY, 14 * S, 8 * S, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// ─── Hair Back Layer ──────────────────────────────────────
function drawHairBack(ctx, cx, cy, S, state) {
    ctx.save();
    const hairColor = state.hairColor || '#2C1810';
    const faceY = cy + 10 * S;
    const style = state.hairStyle || 0;

    ctx.fillStyle = hairColor;

    // Back hair for long styles
    if (style === 2 || style === 4 || style === 5 || style === 8) {
        ctx.beginPath();
        if (style === 2) { // Long straight back
            ctx.ellipse(cx, faceY - 10 * S, 100 * S, 120 * S, 0, 0.3, Math.PI - 0.3);
            ctx.fill();
            // Long hair drape
            ctx.beginPath();
            roundedRect(ctx, cx - 95 * S, faceY - 20 * S, 50 * S, 130 * S, 20 * S);
            ctx.fill();
            ctx.beginPath();
            roundedRect(ctx, cx + 45 * S, faceY - 20 * S, 50 * S, 130 * S, 20 * S);
            ctx.fill();
        } else if (style === 4) { // Ponytail back
            // Ponytail
            ctx.moveTo(cx + 60 * S, faceY - 60 * S);
            ctx.quadraticCurveTo(cx + 120 * S, faceY - 40 * S, cx + 110 * S, faceY + 40 * S);
            ctx.quadraticCurveTo(cx + 100 * S, faceY + 80 * S, cx + 70 * S, faceY + 60 * S);
            ctx.quadraticCurveTo(cx + 90 * S, faceY + 10 * S, cx + 70 * S, faceY - 50 * S);
            ctx.fill();
        } else if (style === 5) { // Twin tails back
            [-1, 1].forEach(side => {
                ctx.beginPath();
                ctx.moveTo(cx + side * 70 * S, faceY - 40 * S);
                ctx.quadraticCurveTo(cx + side * 100 * S, faceY, cx + side * 90 * S, faceY + 70 * S);
                ctx.quadraticCurveTo(cx + side * 80 * S, faceY + 100 * S, cx + side * 60 * S, faceY + 80 * S);
                ctx.quadraticCurveTo(cx + side * 70 * S, faceY + 20 * S, cx + side * 55 * S, faceY - 30 * S);
                ctx.fill();
            });
        } else if (style === 8) { // Wavy long back
            ctx.beginPath();
            ctx.moveTo(cx - 95 * S, faceY - 30 * S);
            ctx.quadraticCurveTo(cx - 110 * S, faceY + 20 * S, cx - 90 * S, faceY + 70 * S);
            ctx.quadraticCurveTo(cx - 80 * S, faceY + 110 * S, cx - 60 * S, faceY + 100 * S);
            ctx.lineTo(cx - 60 * S, faceY - 10 * S);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx + 95 * S, faceY - 30 * S);
            ctx.quadraticCurveTo(cx + 110 * S, faceY + 20 * S, cx + 90 * S, faceY + 70 * S);
            ctx.quadraticCurveTo(cx + 80 * S, faceY + 110 * S, cx + 60 * S, faceY + 100 * S);
            ctx.lineTo(cx + 60 * S, faceY - 10 * S);
            ctx.fill();
        }
    }
    ctx.restore();
}

// ─── Hair Front Layer ─────────────────────────────────────
function drawHairFront(ctx, cx, cy, S, state) {
    ctx.save();
    const hairColor = state.hairColor || '#2C1810';
    const hairDark = darkenColor(hairColor, 0.15);
    const faceY = cy + 10 * S;
    const style = state.hairStyle || 0;

    ctx.fillStyle = hairColor;

    switch (style) {
        case 0: // Short cropped
            // Top hair volume
            ctx.beginPath();
            ctx.ellipse(cx, faceY - 80 * S, 85 * S, 45 * S, 0, 0, Math.PI * 2);
            ctx.fill();
            // Sides
            ctx.beginPath();
            ctx.ellipse(cx - 75 * S, faceY - 40 * S, 28 * S, 45 * S, 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx + 75 * S, faceY - 40 * S, 28 * S, 45 * S, -0.3, 0, Math.PI * 2);
            ctx.fill();
            // Bangs
            ctx.beginPath();
            ctx.moveTo(cx - 70 * S, faceY - 50 * S);
            ctx.quadraticCurveTo(cx - 30 * S, faceY - 35 * S, cx, faceY - 45 * S);
            ctx.quadraticCurveTo(cx + 30 * S, faceY - 35 * S, cx + 70 * S, faceY - 50 * S);
            ctx.quadraticCurveTo(cx + 50 * S, faceY - 90 * S, cx, faceY - 95 * S);
            ctx.quadraticCurveTo(cx - 50 * S, faceY - 90 * S, cx - 70 * S, faceY - 50 * S);
            ctx.fill();
            break;

        case 1: // Buzz cut / very short
            ctx.beginPath();
            ctx.ellipse(cx, faceY - 70 * S, 90 * S, 40 * S, 0, 0, Math.PI * 2);
            ctx.fill();
            // Small fuzz texture
            ctx.fillStyle = hairDark;
            for (let i = 0; i < 30; i++) {
                const angle = (i / 30) * Math.PI;
                const rx = cx + Math.cos(angle) * (70 + Math.random() * 15) * S;
                const ry = faceY - 50 * S - Math.sin(angle) * (25 + Math.random() * 10) * S;
                ctx.beginPath();
                ctx.arc(rx, ry, 2 * S, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case 2: // Long straight
            // Top cap
            ctx.beginPath();
            ctx.ellipse(cx, faceY - 80 * S, 100 * S, 50 * S, 0, 0, Math.PI * 2);
            ctx.fill();
            // Straight bangs
            ctx.beginPath();
            ctx.moveTo(cx - 85 * S, faceY - 50 * S);
            ctx.lineTo(cx - 80 * S, faceY - 30 * S);
            ctx.lineTo(cx - 50 * S, faceY - 35 * S);
            ctx.lineTo(cx - 25 * S, faceY - 28 * S);
            ctx.lineTo(cx, faceY - 32 * S);
            ctx.lineTo(cx + 25 * S, faceY - 28 * S);
            ctx.lineTo(cx + 50 * S, faceY - 35 * S);
            ctx.lineTo(cx + 80 * S, faceY - 30 * S);
            ctx.lineTo(cx + 85 * S, faceY - 50 * S);
            ctx.quadraticCurveTo(cx + 50 * S, faceY - 100 * S, cx, faceY - 105 * S);
            ctx.quadraticCurveTo(cx - 50 * S, faceY - 100 * S, cx - 85 * S, faceY - 50 * S);
            ctx.fill();
            break;

        case 3: // Bob
            ctx.beginPath();
            ctx.ellipse(cx, faceY - 75 * S, 100 * S, 50 * S, 0, 0, Math.PI * 2);
            ctx.fill();
            // Bob sides
            ctx.beginPath();
            roundedRect(ctx, cx - 98 * S, faceY - 55 * S, 45 * S, 80 * S, 20 * S);
            ctx.fill();
            ctx.beginPath();
            roundedRect(ctx, cx + 53 * S, faceY - 55 * S, 45 * S, 80 * S, 20 * S);
            ctx.fill();
            // Side-swept bangs
            ctx.beginPath();
            ctx.moveTo(cx - 80 * S, faceY - 40 * S);
            ctx.quadraticCurveTo(cx - 30 * S, faceY - 30 * S, cx + 20 * S, faceY - 40 * S);
            ctx.quadraticCurveTo(cx + 50 * S, faceY - 45 * S, cx + 80 * S, faceY - 50 * S);
            ctx.quadraticCurveTo(cx + 50 * S, faceY - 95 * S, cx, faceY - 100 * S);
            ctx.quadraticCurveTo(cx - 50 * S, faceY - 95 * S, cx - 80 * S, faceY - 50 * S);
            ctx.fill();
            break;

        case 4: // Ponytail
            // Top
            ctx.beginPath();
            ctx.ellipse(cx, faceY - 80 * S, 95 * S, 48 * S, 0, 0, Math.PI * 2);
            ctx.fill();
            // Bangs
            ctx.beginPath();
            ctx.moveTo(cx - 75 * S, faceY - 45 * S);
            ctx.quadraticCurveTo(cx - 20 * S, faceY - 30 * S, cx + 10 * S, faceY - 38 * S);
            ctx.quadraticCurveTo(cx + 40 * S, faceY - 45 * S, cx + 75 * S, faceY - 50 * S);
            ctx.quadraticCurveTo(cx + 50 * S, faceY - 95 * S, cx, faceY - 100 * S);
            ctx.quadraticCurveTo(cx - 50 * S, faceY - 95 * S, cx - 75 * S, faceY - 45 * S);
            ctx.fill();
            // Ponytail band
            ctx.beginPath();
            ctx.ellipse(cx + 68 * S, faceY - 55 * S, 8 * S, 10 * S, 0.3, 0, Math.PI * 2);
            ctx.fillStyle = '#FF6B9D';
            ctx.fill();
            break;

        case 5: // Twin tails
            // Top
            ctx.fillStyle = hairColor;
            ctx.beginPath();
            ctx.ellipse(cx, faceY - 78 * S, 95 * S, 48 * S, 0, 0, Math.PI * 2);
            ctx.fill();
            // Bangs with center part
            ctx.beginPath();
            ctx.moveTo(cx - 75 * S, faceY - 42 * S);
            ctx.quadraticCurveTo(cx - 35 * S, faceY - 28 * S, cx, faceY - 45 * S);
            ctx.quadraticCurveTo(cx + 35 * S, faceY - 28 * S, cx + 75 * S, faceY - 42 * S);
            ctx.quadraticCurveTo(cx + 50 * S, faceY - 95 * S, cx, faceY - 100 * S);
            ctx.quadraticCurveTo(cx - 50 * S, faceY - 95 * S, cx - 75 * S, faceY - 42 * S);
            ctx.fill();
            // Hair bands
            [-1, 1].forEach(side => {
                ctx.beginPath();
                ctx.ellipse(cx + side * 68 * S, faceY - 38 * S, 8 * S, 10 * S, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#FF6B9D';
                ctx.fill();
            });
            break;

        case 6: // Curly / afro
            ctx.fillStyle = hairColor;
            // Big curly volume
            for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2;
                const r = (95 + Math.sin(i * 3) * 12) * S;
                const bx = cx + Math.cos(angle) * r * 0.85;
                const by = faceY - 30 * S + Math.sin(angle) * r * 0.9;
                ctx.beginPath();
                ctx.arc(bx, by, 30 * S, 0, Math.PI * 2);
                ctx.fill();
            }
            // Center fill
            ctx.beginPath();
            ctx.arc(cx, faceY - 40 * S, 80 * S, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 7: // Spiky
            ctx.fillStyle = hairColor;
            // Base
            ctx.beginPath();
            ctx.ellipse(cx, faceY - 75 * S, 90 * S, 45 * S, 0, 0, Math.PI * 2);
            ctx.fill();
            // Spikes
            const spikes = [
                { angle: -0.8, len: 50 }, { angle: -0.5, len: 60 },
                { angle: -0.2, len: 55 }, { angle: 0.1, len: 65 },
                { angle: 0.4, len: 55 }, { angle: 0.7, len: 45 },
                { angle: -1.1, len: 35 }, { angle: 1.0, len: 35 }
            ];
            spikes.forEach(spike => {
                const baseX = cx + Math.cos(spike.angle + Math.PI / 2) * 70 * S;
                const baseY = faceY - 70 * S + Math.sin(spike.angle) * 20 * S;
                const tipX = baseX + Math.cos(spike.angle - Math.PI / 2) * spike.len * S;
                const tipY = baseY - spike.len * S * 0.8;
                ctx.beginPath();
                ctx.moveTo(baseX - 15 * S, baseY);
                ctx.lineTo(tipX, tipY);
                ctx.lineTo(baseX + 15 * S, baseY);
                ctx.fill();
            });
            break;

        case 8: // Wavy long
            ctx.fillStyle = hairColor;
            // Top
            ctx.beginPath();
            ctx.ellipse(cx, faceY - 78 * S, 100 * S, 50 * S, 0, 0, Math.PI * 2);
            ctx.fill();
            // Wavy bangs
            ctx.beginPath();
            ctx.moveTo(cx - 85 * S, faceY - 45 * S);
            ctx.bezierCurveTo(cx - 60 * S, faceY - 25 * S, cx - 40 * S, faceY - 40 * S, cx - 15 * S, faceY - 28 * S);
            ctx.bezierCurveTo(cx + 10 * S, faceY - 40 * S, cx + 40 * S, faceY - 25 * S, cx + 60 * S, faceY - 35 * S);
            ctx.quadraticCurveTo(cx + 80 * S, faceY - 42 * S, cx + 90 * S, faceY - 50 * S);
            ctx.quadraticCurveTo(cx + 55 * S, faceY - 100 * S, cx, faceY - 105 * S);
            ctx.quadraticCurveTo(cx - 55 * S, faceY - 100 * S, cx - 85 * S, faceY - 50 * S);
            ctx.fill();
            break;

        case 9: // Mohawk
            ctx.fillStyle = hairColor;
            // Mohawk strip
            ctx.beginPath();
            ctx.moveTo(cx - 15 * S, faceY - 50 * S);
            ctx.quadraticCurveTo(cx - 20 * S, faceY - 130 * S, cx, faceY - 140 * S);
            ctx.quadraticCurveTo(cx + 20 * S, faceY - 130 * S, cx + 15 * S, faceY - 50 * S);
            ctx.fill();
            // Base
            ctx.beginPath();
            ctx.ellipse(cx, faceY - 70 * S, 30 * S, 35 * S, 0, 0, Math.PI * 2);
            ctx.fill();
            // Shaved sides (darker skin)
            ctx.fillStyle = darkenColor(state.skinColor || '#FDDCB5', 0.05);
            ctx.beginPath();
            ctx.ellipse(cx - 55 * S, faceY - 55 * S, 35 * S, 25 * S, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx + 55 * S, faceY - 55 * S, 35 * S, 25 * S, -0.2, 0, Math.PI * 2);
            ctx.fill();
            break;
    }

    ctx.restore();
}

// ─── Accessories ──────────────────────────────────────────
function drawAccessory(ctx, cx, cy, S, state) {
    ctx.save();
    const faceY = cy + 10 * S;
    const acc = state.accessory || 0;

    switch (acc) {
        case 0: // None
            break;

        case 1: // Round glasses
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2.5 * S;
            [-1, 1].forEach(side => {
                ctx.beginPath();
                ctx.arc(cx + side * 32 * S, cy + 5 * S, 20 * S, 0, Math.PI * 2);
                ctx.stroke();
            });
            // Bridge
            ctx.beginPath();
            ctx.moveTo(cx - 12 * S, cy + 5 * S);
            ctx.quadraticCurveTo(cx, cy, cx + 12 * S, cy + 5 * S);
            ctx.stroke();
            // Temple arms
            ctx.beginPath();
            ctx.moveTo(cx - 52 * S, cy + 5 * S);
            ctx.lineTo(cx - 80 * S, cy - 2 * S);
            ctx.moveTo(cx + 52 * S, cy + 5 * S);
            ctx.lineTo(cx + 80 * S, cy - 2 * S);
            ctx.stroke();
            break;

        case 2: // Square glasses
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 3 * S;
            [-1, 1].forEach(side => {
                const gx = cx + side * 32 * S;
                ctx.beginPath();
                roundedRect(ctx, gx - 20 * S, cy - 10 * S, 40 * S, 30 * S, 5 * S);
                ctx.stroke();
            });
            ctx.beginPath();
            ctx.moveTo(cx - 12 * S, cy + 2 * S);
            ctx.lineTo(cx + 12 * S, cy + 2 * S);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx - 52 * S, cy);
            ctx.lineTo(cx - 80 * S, cy - 5 * S);
            ctx.moveTo(cx + 52 * S, cy);
            ctx.lineTo(cx + 80 * S, cy - 5 * S);
            ctx.stroke();
            break;

        case 3: // Sunglasses
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 3 * S;
            [-1, 1].forEach(side => {
                ctx.beginPath();
                const gx = cx + side * 32 * S;
                ctx.moveTo(gx - 22 * S, cy - 3 * S);
                ctx.quadraticCurveTo(gx, cy - 15 * S, gx + 22 * S, cy - 3 * S);
                ctx.quadraticCurveTo(gx, cy + 18 * S, gx - 22 * S, cy - 3 * S);
                ctx.fill();
                ctx.stroke();
            });
            ctx.beginPath();
            ctx.moveTo(cx - 10 * S, cy);
            ctx.quadraticCurveTo(cx, cy - 5 * S, cx + 10 * S, cy);
            ctx.strokeStyle = '#111';
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx - 54 * S, cy - 2 * S);
            ctx.lineTo(cx - 82 * S, cy - 8 * S);
            ctx.moveTo(cx + 54 * S, cy - 2 * S);
            ctx.lineTo(cx + 82 * S, cy - 8 * S);
            ctx.stroke();
            break;

        case 4: // Baseball cap
            ctx.fillStyle = '#2196F3';
            // Cap dome
            ctx.beginPath();
            ctx.ellipse(cx, faceY - 75 * S, 100 * S, 50 * S, 0, Math.PI, Math.PI * 2);
            ctx.fill();
            // Brim
            ctx.beginPath();
            ctx.ellipse(cx + 10 * S, faceY - 68 * S, 80 * S, 15 * S, 0.1, 0, Math.PI);
            ctx.fillStyle = '#1976D2';
            ctx.fill();
            ctx.strokeStyle = '#1565C0';
            ctx.lineWidth = 2 * S;
            ctx.stroke();
            // Button on top
            ctx.beginPath();
            ctx.arc(cx, faceY - 120 * S, 5 * S, 0, Math.PI * 2);
            ctx.fillStyle = '#1565C0';
            ctx.fill();
            break;

        case 5: // Beanie
            ctx.fillStyle = '#E91E63';
            ctx.beginPath();
            ctx.moveTo(cx - 95 * S, faceY - 60 * S);
            ctx.quadraticCurveTo(cx - 100 * S, faceY - 120 * S, cx, faceY - 135 * S);
            ctx.quadraticCurveTo(cx + 100 * S, faceY - 120 * S, cx + 95 * S, faceY - 60 * S);
            ctx.fill();
            // Ribbed edge
            ctx.fillStyle = '#C2185B';
            ctx.beginPath();
            ctx.ellipse(cx, faceY - 62 * S, 97 * S, 12 * S, 0, 0, Math.PI * 2);
            ctx.fill();
            // Pom pom
            ctx.beginPath();
            ctx.arc(cx, faceY - 135 * S, 12 * S, 0, Math.PI * 2);
            ctx.fillStyle = '#FCE4EC';
            ctx.fill();
            break;

        case 6: // Crown
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#FFA000';
            ctx.lineWidth = 2 * S;
            ctx.beginPath();
            ctx.moveTo(cx - 50 * S, faceY - 80 * S);
            ctx.lineTo(cx - 55 * S, faceY - 120 * S);
            ctx.lineTo(cx - 30 * S, faceY - 100 * S);
            ctx.lineTo(cx, faceY - 130 * S);
            ctx.lineTo(cx + 30 * S, faceY - 100 * S);
            ctx.lineTo(cx + 55 * S, faceY - 120 * S);
            ctx.lineTo(cx + 50 * S, faceY - 80 * S);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Jewels
            ctx.beginPath();
            ctx.arc(cx, faceY - 105 * S, 5 * S, 0, Math.PI * 2);
            ctx.fillStyle = '#E53935';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cx - 30 * S, faceY - 92 * S, 3 * S, 0, Math.PI * 2);
            ctx.fillStyle = '#2196F3';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cx + 30 * S, faceY - 92 * S, 3 * S, 0, Math.PI * 2);
            ctx.fillStyle = '#4CAF50';
            ctx.fill();
            break;
    }

    ctx.restore();
}

// ─── Helper Functions ─────────────────────────────────────

function roundedRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
}

function drawStar(ctx, cx, cy, points, outer, inner) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
}

function darkenColor(hex, amount) {
    hex = hex.replace('#', '');
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - Math.floor(255 * amount));
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - Math.floor(255 * amount));
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - Math.floor(255 * amount));
    return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
}
