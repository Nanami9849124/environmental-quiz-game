document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("data-entry-form");
    const winRatesTable = document.getElementById("win-rates-table").getElementsByTagName("tbody")[0];
    const matchHistoryTable = document.getElementById("match-history-table").getElementsByTagName("tbody")[0];
    const playerStatsTable = document.getElementById("player-stats-table").getElementsByTagName("tbody")[0];
    const viewMatchesButton = document.getElementById("view-matches");
    const viewPlayerStatsButton = document.getElementById("view-player-stats");
    let data = [];

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const teamCaptain = document.getElementById("team-captain").value;
        const player1 = document.getElementById("player1").value;
        const player2 = document.getElementById("player2").value;
        const player3 = document.getElementById("player3").value;
        const player4 = document.getElementById("player4").value;
        const player5 = document.getElementById("player5").value;
        const winLoss = document.getElementById("win-loss").value;
        
        const players = [player1, player2, player3, player4, player5];
        
        const matchData = { teamCaptain, players, winLoss };
        db.collection("matches").add(matchData).then(() => {
            loadData();
        });

        form.reset();
    });

    viewMatchesButton.addEventListener("click", () => {
        const selectedCaptain = document.getElementById("select-captain").value;
        updateMatchHistoryTable(selectedCaptain);
    });

    viewPlayerStatsButton.addEventListener("click", () => {
        const selectedPlayer = document.getElementById("select-player").value;
        updatePlayerStatsTable(selectedPlayer);
    });

    function loadData() {
        db.collection("matches").get().then((querySnapshot) => {
            data = [];
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
            });
            updateWinRatesTable();
        });
    }

    function updateWinRatesTable() {
        const winCounts = {};
        const lossCounts = {};
        
        data.forEach(entry => {
            if (!winCounts[entry.teamCaptain]) {
                winCounts[entry.teamCaptain] = 0;
                lossCounts[entry.teamCaptain] = 0;
            }
            if (entry.winLoss === "Win") {
                winCounts[entry.teamCaptain]++;
            } else {
                lossCounts[entry.teamCaptain]++;
            }
        });
        
        while (winRatesTable.firstChild) {
            winRatesTable.removeChild(winRatesTable.firstChild);
        }
        
        Object.keys(winCounts).forEach(teamCaptain => {
            const wins = winCounts[teamCaptain];
            const losses = lossCounts[teamCaptain];
            const winRate = wins / (wins + losses);
            const row = winRatesTable.insertRow();
            
            row.insertCell(0).innerText = teamCaptain;
            row.insertCell(1).innerText = wins;
            row.insertCell(2).innerText = losses;
            const winRateCell = row.insertCell(3);
            winRateCell.innerText = (winRate * 100).toFixed(2) + "%";
            
            if (winRate >= 0.75) {
                winRateCell.className = "win-rate";
            } else if (winRate >= 0.5) {
                winRateCell.className = "medium-win-rate";
            } else {
                winRateCell.className = "low-win-rate";
            }
        });
    }

    function updateMatchHistoryTable(teamCaptain) {
        while (matchHistoryTable.firstChild) {
            matchHistoryTable.removeChild(matchHistoryTable.firstChild);
        }
        
        data.forEach(entry => {
            if (entry.teamCaptain === teamCaptain) {
                const row = matchHistoryTable.insertRow();
                
                row.insertCell(0).innerText = entry.teamCaptain;
                row.insertCell(1).innerText = entry.players.join(", ");
                row.insertCell(2).innerText = entry.winLoss;
            }
        });
    }

    function updatePlayerStatsTable(player) {
        const winCounts = {};
        const lossCounts = {};
        
        data.forEach(entry => {
            entry.players.forEach(p => {
                if (!winCounts[p]) {
                    winCounts[p] = 0;
                    lossCounts[p] = 0;
                }
                if (entry.winLoss === "Win") {
                    winCounts[p]++;
                } else {
                    lossCounts[p]++;
                }
            });
        });
        
        while (playerStatsTable.firstChild) {
            playerStatsTable.removeChild(playerStatsTable.firstChild);
        }
        
        const wins = winCounts[player] || 0;
        const losses = lossCounts[player] || 0;
        const winRate = wins / (wins + losses);
        const row = playerStatsTable.insertRow();
        
        row.insertCell(0).innerText = player;
        row.insertCell(1).innerText = wins;
        row.insertCell(2).innerText = losses;
        const winRateCell = row.insertCell(3);
        winRateCell.innerText = (winRate * 100).toFixed(2) + "%";
        
        if (winRate >= 0.75) {
            winRateCell.className = "win-rate";
        } else if (winRate >= 0.5) {
            winRateCell.className = "medium-win-rate";
        } else {
            winRateCell.className = "low-win-rate";
        }
    }

    // Initial call to populate tables from Firestore
    loadData();
});
