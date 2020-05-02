export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

// Définit la taille du canvas à la taille de la fenêtre
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Pour les prochains changement de taille
window.onresize = () => {
    if (ctx instanceof CanvasRenderingContext2D) {
        ctx.save();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.restore();
        console.info('Le canvas a été redimensionné');
    }
};

export const buffer = document.createElement('canvas');
export const bufferCtx = buffer.getContext('2d');

buffer.width = canvas.width;
buffer.height = canvas.height;