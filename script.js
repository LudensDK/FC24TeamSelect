document.getElementById('start-btn').addEventListener('click', async () => {
    const minOverall = parseInt(document.getElementById('min-overall').value);
    const threshold = parseInt(document.getElementById('threshold').value);

    const response = await fetch('/data/teams.csv');
    const data = await response.text();
    const teams = parseCSV(data);

    const homeTeam = getRandomTeam(teams, team => team.overall >= minOverall);

    let awayTeam;
   {
        awayTeam = getRandomTeam(teams, team => 
            team.overall >= homeTeam.overall - threshold && 
            team.overall <= homeTeam.overall + threshold &&
            team.team_id !== homeTeam.team_id
        );
    }

    displayTeam('home', homeTeam);
    displayTeam('away', awayTeam);
});

document.getElementById('reset-btn').addEventListener('click', () => {
    resetTeam('home');
    resetTeam('away');
});

function parseCSV(data) {
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = isNaN(values[index]) ? values[index] : parseInt(values[index]);
            return obj;
        }, {});
    });
}

function getRandomTeam(teams, condition) {
    const filteredTeams = teams.filter(condition);
    if (filteredTeams.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * filteredTeams.length);
    return filteredTeams[randomIndex];
}

function displayTeam(prefix, team) {
    if (team) {

        const emblemBaseUrl = 'https://cdn.futbin.com/content/fifa24/img/clubs/';
        let emblemUrl = `${emblemBaseUrl}${team.team_id}.png`;

        const img = new Image();
    img.onerror = function() {
        emblemUrl = '/data/def.png';
        document.getElementById(`${prefix}-emblem`).src = emblemUrl;
    };

    img.src = emblemUrl;

        document.getElementById(`${prefix}-emblem`).src = emblemUrl;
        document.getElementById(`${prefix}-name`).textContent = team.team_name;
        document.getElementById(`${prefix}-league`).textContent = team.league_name;
    } else {
        alert('No team found to display!');
    }
}

function resetTeam(prefix) {
    document.getElementById(`${prefix}-emblem`).src = '/data/def.png';
    document.getElementById(`${prefix}-name`).textContent = 'Team name';
    document.getElementById(`${prefix}-league`).textContent = 'League';
}
