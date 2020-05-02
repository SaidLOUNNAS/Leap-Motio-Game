/**
 * Leap Motion
 */

const controller = new Leap.Controller();
controller.connect(); // Ouvre la connexion WebSocket

controller.on('frame', (f) => {
    frame = f;
});

export let frame;