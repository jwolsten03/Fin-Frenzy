(function() {
    let sharkActive = false;
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
        sharkEventTimer = sharkEventDuration;  // reset timer
        sharkX = canvas.width + 100;
        sharkNoticeTimer = 120;  // show notice for 2 seconds (120 frames at 60 FPS)
        sharkY = Math.random() * (canvas.height - 100);
    }    

    function updateSharkEvent() {
        if (!sharkActive) return;
    
        sharkX -= sharkSpeed;
        
        // Smoothly track the player's vertical position
        const smoothing = 0.03;  // adjust 0.03–0.1 for more or less sharpness
        const targetY = player.y + player.height / 2 - 240 / 2;  // center the shark
        sharkY += (targetY - sharkY) * smoothing;
        // Check collision with player:
        const imageWidth = 240;
        const imageHeight = 240;
        const hitboxWidth = 100;   // or experiment with 140 or 120 if needed
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

    
        // Smooth wraparound logic:
        if (sharkX < -imageWidth) {
            sharkX = canvas.width + 100;  // instantly move back to right side
            sharkY = Math.random() * (canvas.height - 100);  // new random height
            console.log("Shark loops back to right side!");
        }
        // Decrease event timer
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