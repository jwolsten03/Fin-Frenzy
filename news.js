(function() {
    const newsBg = new Image();
    newsBg.src = "assets/news-bg.png"; // ✅ optional background, or fallback color

    const newsItems = [
        "📰 NEWS TAB COMING SOON!",
        "Stay tuned for updates, new events, and announcements!",
        "Thank you for playing Fin Frenzy! 💙"
    ];

    function drawNewsScreen(ctx, canvas) {
        if (newsBg.complete && newsBg.naturalWidth > 0) {
            ctx.drawImage(newsBg, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = "#001";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    
        // ✨ ADD THIS OVERLAY BEFORE DRAWING TEXT
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";  // black with 50% transparency
        ctx.fillRect(50, 120, canvas.width - 100, newsItems.length * 40 + 60);
    
        ctx.fillStyle = "#fff";
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.fillText("NEWS", canvas.width / 2, 80);
    
        ctx.font = "20px Arial";
        let y = 150;
        for (let item of newsItems) {
            ctx.fillText(item, canvas.width / 2, y);
            y += 40;
        }
    
        ctx.font = "16px Arial";
        ctx.fillStyle = "#aaa";
        ctx.fillText("Press B or ESC to return", canvas.width / 2, canvas.height - 40);
    }
    

    // Expose to global scope
    window.drawNewsScreen = drawNewsScreen;
})();
