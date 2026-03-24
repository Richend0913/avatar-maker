/**
 * Avatar Maker - Main Application Logic
 * Handles UI interactions, state management, and canvas updates.
 */

(function () {
    'use strict';

    // ─── Default State ───────────────────────────────────────
    const DEFAULT_STATE = {
        faceShape: 0,
        skinColor: '#FDEBD0',
        hairStyle: 0,
        hairColor: '#2C1810',
        eyeStyle: 0,
        eyeColor: '#2C1810',
        mouthStyle: 0,
        eyebrowStyle: 0,
        accessory: 0,
        bgColor: '#E8D5FF',
        bgGradient: false,
        bgGradientColor: '#E0E0FF'
    };

    // ─── Options for randomization ───────────────────────────
    const RANDOM_OPTIONS = {
        faceShape: [0, 1, 2, 3],
        skinColor: ['#FDEBD0', '#FDDCB5', '#F5C9A8', '#DEB887', '#C68642', '#8D6E63', '#A1887F', '#6D4C41'],
        hairStyle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        hairColor: ['#2C1810', '#212121', '#5D4037', '#D4A574', '#D32F2F', '#FF9800', '#1565C0', '#FF6B9D', '#7B1FA2', '#FFD700'],
        eyeStyle: [0, 1, 2, 3, 4, 5, 6, 7],
        eyeColor: ['#2C1810', '#4A6741', '#2196F3', '#795548', '#6A1B9A', '#F57F17'],
        mouthStyle: [0, 1, 2, 3, 4, 5],
        eyebrowStyle: [0, 1, 2, 3, 4],
        accessory: [0, 0, 0, 1, 2, 3, 4, 5, 6],  // weighted toward "none"
        bgColor: ['#E8D5FF', '#FFE0F0', '#D0E8FF', '#E0F7FA', '#C8E6C9', '#FFF9C4', '#FFCCBC', '#F3E5F5', '#FFFFFF', '#263238', '#FF6B9D', '#7C4DFF'],
        bgGradientColor: ['#E0E0FF', '#FFE0F0', '#D0E8FF', '#F0F4C3', '#FFCCBC', '#B2EBF2']
    };

    // ─── State ───────────────────────────────────────────────
    let state = loadState();

    const canvas = document.getElementById('avatarCanvas');

    // ─── Initial Render ──────────────────────────────────────
    render();
    syncUI();

    // ─── Tab Switching ───────────────────────────────────────
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.option-group').forEach(g => g.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('tab-' + this.dataset.tab).classList.add('active');
        });
    });

    // ─── Option Buttons ──────────────────────────────────────
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const key = this.dataset.key;
            const value = parseInt(this.dataset.value);

            // Deselect siblings
            this.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');

            state[key] = value;
            saveState();
            render();
        });
    });

    // ─── Color Swatches ──────────────────────────────────────
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', function () {
            const key = this.dataset.key;
            const value = this.dataset.value;

            // Deselect siblings in same grid
            this.parentElement.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');

            state[key] = value;
            saveState();
            render();
        });
    });

    // ─── Gradient Toggle ─────────────────────────────────────
    const gradToggle = document.getElementById('bgGradientToggle');
    const gradColorRow = document.getElementById('gradientColorRow');

    gradToggle.addEventListener('change', function () {
        state.bgGradient = this.checked;
        gradColorRow.style.display = this.checked ? 'block' : 'none';
        saveState();
        render();
    });

    // Init gradient UI from state
    if (state.bgGradient) {
        gradToggle.checked = true;
        gradColorRow.style.display = 'block';
    }

    // ─── Random Button ───────────────────────────────────────
    document.getElementById('btnRandom').addEventListener('click', function () {
        Object.keys(RANDOM_OPTIONS).forEach(key => {
            const opts = RANDOM_OPTIONS[key];
            state[key] = opts[Math.floor(Math.random() * opts.length)];
        });
        state.bgGradient = Math.random() > 0.5;

        saveState();
        syncUI();
        render();

        // Fun animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => { this.style.transform = ''; }, 150);
    });

    // ─── Reset Button ────────────────────────────────────────
    document.getElementById('btnReset').addEventListener('click', function () {
        state = { ...DEFAULT_STATE };
        saveState();
        syncUI();
        render();
    });

    // ─── Preview Button ──────────────────────────────────────
    document.getElementById('btnPreview').addEventListener('click', function () {
        const previewCanvas = document.getElementById('previewCanvas');
        renderAvatar(previewCanvas, state);
        document.getElementById('previewModal').classList.add('active');
    });

    document.getElementById('closePreview').addEventListener('click', function () {
        document.getElementById('previewModal').classList.remove('active');
    });

    // ─── Download Button ─────────────────────────────────────
    document.getElementById('btnDownload').addEventListener('click', function () {
        document.getElementById('paymentModal').classList.add('active');
    });

    document.getElementById('modalDownload').addEventListener('click', function () {
        document.getElementById('previewModal').classList.remove('active');
        document.getElementById('paymentModal').classList.add('active');
    });

    document.getElementById('closePayment').addEventListener('click', function () {
        document.getElementById('paymentModal').classList.remove('active');
    });

    document.getElementById('confirmPayment').addEventListener('click', function () {
        // Placeholder: In production, integrate Stripe here
        // For now, generate and download the high-res image
        downloadHighRes();
        document.getElementById('paymentModal').classList.remove('active');
    });

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });

    // ─── Core Functions ──────────────────────────────────────

    function render() {
        renderAvatar(canvas, state);
    }

    function syncUI() {
        // Sync option buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            const key = btn.dataset.key;
            const value = parseInt(btn.dataset.value);
            btn.classList.toggle('selected', state[key] === value);
        });

        // Sync color swatches
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            const key = swatch.dataset.key;
            const value = swatch.dataset.value;
            swatch.classList.toggle('selected', state[key] === value);
        });

        // Sync gradient toggle
        gradToggle.checked = state.bgGradient;
        gradColorRow.style.display = state.bgGradient ? 'block' : 'none';
    }

    function downloadHighRes() {
        const hiRes = document.createElement('canvas');
        hiRes.width = 600;
        hiRes.height = 600;
        renderAvatar(hiRes, state);

        const link = document.createElement('a');
        link.download = 'avatar-' + Date.now() + '.png';
        link.href = hiRes.toDataURL('image/png');
        link.click();
    }

    function saveState() {
        try {
            localStorage.setItem('avatarMakerState', JSON.stringify(state));
        } catch (e) {
            // localStorage may be unavailable
        }
    }

    function loadState() {
        try {
            const saved = localStorage.getItem('avatarMakerState');
            if (saved) {
                return { ...DEFAULT_STATE, ...JSON.parse(saved) };
            }
        } catch (e) {
            // ignore
        }
        return { ...DEFAULT_STATE };
    }
})();
