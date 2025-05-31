(function() {
    let sharkActive = false;
    let sharkWarningTimer = 0;    // counts down before shark arrives
    const sharkWarningDuration = 180;  // e.g., 3 seconds at 60fps
    let sharkX = 0;
    let sharkY = 0;
    let sharkSpeed = 10;
    let sharkNoticeTimer = 0;
    let sharkEventTimer = 0;
    const sharkEventDuration = 1800;  // e.g., 10 seconds at 60fps

    // Load your new shark image
    let sharkImage = new Image();
    sharkImage.src = "assets/fish-shark.png";  // ✅ make sure the path matches exactly

    function startSharkEvent() {
        console.log("Shark event started!");
        sharkActive = true;
        sharkWarningTimer = sharkWarningDuration;  // start warning countdown
        sharkEventTimer = sharkEventDuration;  // reset timer
        sharkX = canvas.width + 100;
        sharkNoticeTimer = 120;  // show notice for 2 seconds (120 frames at 60 FPS)
        sharkY = Math.random() * (canvas.height - 100);
    }    

    function updateSharkEvent() {
        // If we’re still flashing the warning, delay shark activation
        if (sharkNoticeTimer > 0) {
            sharkNoticeTimer--;
            if (sharkNoticeTimer === 0) {
                console.log("Shark event started!");
                sharkActive = true;
                sharkEventTimer = sharkEventDuration;
                sharkX = canvas.width + 100;
                sharkY = Math.random() * (canvas.height - 100);
            }
            return;  // skip shark movement until after notice finishes
        }
    
        if (!sharkActive) return;
    
        sharkX -= sharkSpeed;
    
        // Smooth tracking...
        const smoothing = 0.04;
        const targetY = player.y + player.height / 2 - 240 / 2;
        sharkY += (targetY - sharkY) * smoothing;
    
        // Hitbox check...
        const imageWidth = 240;
        const imageHeight = 240;
        const hitboxWidth = 100;
        const hitboxHeight = 80;
        const offsetX = (imageWidth - hitboxWidth) / 2;
        const offsetY = (imageHeight - hitboxHeight) / 2;
    
        if (
            player.x < sharkX + offsetX + hitboxWidth &&
            player.x + player.width > sharkX + offsetX &&
            player.y < sharkY + offsetY + hitboxHeight &&
            player.y + player.height > sharkY + offsetY
        ) {
            if (damageCooldown === 0) {
                if (activePowerUps.shield) {
                    activePowerUps.shield = false;
                } else {
                    health -= 50;
                    damageFlashTimer = 10;
    
                    if (health <= 0) {
                        handleGameOver();
                    }
                }
                damageCooldown = 30;
            }
        }
    
        if (sharkX < -imageWidth) {
            sharkX = canvas.width + 100;
            sharkY = Math.random() * (canvas.height - 100);
            console.log("Shark loops back to right side!");
        }
    
        sharkEventTimer--;
        if (sharkEventTimer <= 0) {
            endSharkEvent();
        }
    }
    
    
    

    function drawSharkEvent(ctx) {
        if (!sharkActive) return;

        if (sharkImage.complete && sharkImage.naturalWidth > 0) {
            ctx.drawImage(sharkImage, sharkX, sharkY, 240, 240);  // adjust size as needed
        } else {
            // fallback gray block if image not loaded
            ctx.fillStyle = "gray";
            ctx.fillRect(sharkX, sharkY, 100, 60);
        }
        // Draw the event notice overlay if active
        if (sharkNoticeTimer > 0) {
            const flashAlpha = 0.5 + 0.5 * Math.sin((120 - sharkNoticeTimer) / 5);  // cycles between 0 and 1
        
            ctx.save();
            ctx.globalAlpha = flashAlpha;
        
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, canvas.height / 2 - 50, canvas.width, 100);
        
            ctx.fillStyle = "#ff4444";
            ctx.font = "bold 48px Arial";
            ctx.textAlign = "center";
            ctx.fillText("⚠ SHARK ATTACK! ⚠", canvas.width / 2, canvas.height / 2 + 15);
        
            ctx.restore();
        
            sharkNoticeTimer--;
        }        
    }

    function endSharkEvent() {
        console.log("Shark event ended!");
        sharkActive = false;
        targetFacing = 1;  // smoothly flip back right
    }

    // Expose to global window so game.js can call them
    window.startSharkEvent = startSharkEvent;
    window.updateSharkEvent = updateSharkEvent;
    window.drawSharkEvent = drawSharkEvent;
    window.endSharkEvent = endSharkEvent;

    // Optional: allow game.js to check status
    window.isSharkEventActive = function() {
        return sharkActive;
    };
})();