(function() {
    const settingsBg = new Image();
    settingsBg.src = "assets/settings-bg.png";  // ✅ make sure the filename matches

    let settings = JSON.parse(localStorage.getItem("finfrenzy_settings")) || {
        musicEnabled: true,
        soundEnabled: true
    };

    function saveSettings() {
        localStorage.setItem("finfrenzy_settings", JSON.stringify(settings));
    }

    function toggleMusic() {
        settings.musicEnabled = !settings.musicEnabled;
        saveSettings();
        applySettings();
    }    
    

    function toggleSound() {
        settings.soundEnabled = !settings.soundEnabled;
        saveSettings();
        // No need to pause anything — sound effects are short and only play on triggers.
    }
    
    function applySettings() {
        if (settings.musicEnabled) {
            backgroundMusic.play().catch(e => console.warn("Autoplay blocked.", e));
        } else {
            backgroundMusic.pause();
        }
    }
    

    function resetProgress() {
        if (confirm("Are you sure you want to reset all progress?")) {
            localStorage.clear();
            alert("Progress reset!");
            location.reload();
        }
    }

    function drawSettingsScreen(ctx, canvas) {
        // Draw background image if loaded
        if (settingsBg.complete && settingsBg.naturalWidth > 0) {
            ctx.drawImage(settingsBg, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    
        // Optional: add a dark transparent overlay for better text readability
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Draw title
        ctx.fillStyle = "#fff";
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.fillText("SETTINGS", canvas.width / 2, 80);
    
        // Draw settings options
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        let y = 150;
    
        ctx.fillText(`1. Music: ${settings.musicEnabled ? "ON" : "OFF"}`, 100, y); y += 40;
        ctx.fillText(`2. Sound Effects: ${settings.soundEnabled ? "ON" : "OFF"}`, 100, y); y += 40;
        ctx.fillText(`3. Reset Progress`, 100, y); y += 40;
    
        // Instructional text
        ctx.fillText(`Press 1 to toggle Music`, 100, y + 40);
        ctx.fillText(`Press 2 to toggle Sound`, 100, y + 60);
        ctx.fillText(`Press 3 to Reset Progress`, 100, y + 80);
        ctx.fillText(`Press B or ESC to return`, 100, y + 120);
    }
    

    // Expose to global scope
    window.settings = settings;
    window.toggleMusic = toggleMusic;
    window.toggleSound = toggleSound;
    window.resetProgress = resetProgress;
    window.drawSettingsScreen = drawSettingsScreen;
})();
