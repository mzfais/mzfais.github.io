const API_KEY = "781b9f98a499473eb1bd835f95938ad7";
const BASE_URL = "https://api.football-data.org/v2/";

const LEAGUE_ID = 2014;

const BASE_ENDPOINT = `${BASE_URL}competitions/${LEAGUE_ID}/`;

const fetchAPI = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(res => {
            if (res.status !== 200) {
                console.log("Error: " + res.status);
                return Promise.reject(new Error(res.statusText))
            } else {
                return Promise.resolve(res)
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.log(err)
        })
};

function showPageContents(page) {
    if ("caches" in window) {
        caches.match(BASE_ENDPOINT + page).then(response => {
            if (response) {
                response.json().then(data => {
                    showContent(page, data)
                })
            }
        })
    }
    showProgress(true);
    fetchAPI(BASE_ENDPOINT + page)
        .then(data => {
            showContent(page, data);
            showProgress(false);
        })
        .catch(error => {
            console.log(error)
            showProgress(false);
        })
}

function showContent(page, data) {
    switch (page) {
        case 'teams':
            showTeam(data);
            break;
        case 'standings':
            showStanding(data);
            break;
        case 'matches':
            showMatches(data);
            break;
        case 'scorers':
            showScorers(data);
            break;
    }
}

function showTeam(data, isFav = false) {
    setPageTitle("Daftar Klub Favorit");
    if (!isFav) {
        setPageTitle("Daftar Tim Liga Spanyol");
        data = data.teams;
    }
    let teams = "";
    let teamsElement = document.getElementById("content-list");
    data.forEach(team => {
        teams += `
        <li class="collection-item avatar">
          <img src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="${team.name}" class="square">
          <span class="title">${team.name}</span>
          <p>Berdiri: ${team.founded} <br>
             Markas: ${team.venue}
          </p>
          <a href="javascript:void(0);" id="link_${team.id}" class="link-item"><i class="material-icons">grade</i></a>
        </li>
        `;
    });
    teamsElement.innerHTML = '<ul class="collection">' + teams + '</ul>';
    let link = document.querySelectorAll('.link-item');
    let i = 0;
    link.forEach(btn => {
        let x = i;
        let favClass = "link-item fav-content";
        let favTitle = "Hapus dari Favorit";
        if (isFav) {
            btn.setAttribute("title", favTitle);
            btn.classList = favClass;
        }
        else {
            let fav = getById(data[x].id).then(fav_item => fav_item.id)
                .catch(() => {
                    return 0
                });
            fav.then(function (a) {
                if (a != 0) {
                    favClass = "link-item fav-content";
                    favTitle = "Hapus dari Favorit";
                } else {
                    favClass = "link-item unfav-content";
                    favTitle = "Tambahkan ke Favorit";
                }
                btn.setAttribute("title", favTitle);
                btn.classList = favClass;
            });
        }
        btn.onclick = () => {
            toggleFav(data[x], btn);
        }
        i += 1;
    })
}

function showStanding(data) {
    setPageTitle("Klasemen Sementara Liga Spanyol");
    let standings = "";
    let standingElement = document.getElementById("content-list");

    data.standings[0].table.forEach(standing => {
        standings += `
                <tr>
                    <td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/></td>
                    <td>${standing.team.name}</td>
                    <td>${standing.won}</td>
                    <td>${standing.draw}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.points}</td>
                    <td>${standing.goalsFor}</td>
                    <td>${standing.goalsAgainst}</td>
                    <td>${standing.goalDifference}</td>
                </tr>
        `;
    });

    standingElement.innerHTML = `
            <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
                <table class="striped responsive-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nama Tim</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>P</th>
                            <th>GF</th>
                            <th>GA</th>
                            <th>GD</th>
                        </tr>
                     </thead>
                    <tbody id="standings">
                        ${standings}
                    </tbody>
                </table>
            </div>
    `;
}

function showMatches(data) {
    setPageTitle("Jadwal Pertandingan Liga Spanyol");
    let matches = "";
    let matchElement = document.getElementById("content-list");

    data.matches.forEach(match => {
        let d = new Date(match.utcDate).toLocaleDateString("id");
        let scoreHomeTeam = (match.score.fullTime.homeTeam == null ? 0 : match.score.fullTime.homeTeam);
        let scoreAwayTeam = (match.score.fullTime.awayTeam == null ? 0 : match.score.fullTime.awayTeam);
        matches += `
                <tr>
                    <td>${match.homeTeam.name} vs ${match.awayTeam.name}</td>
                    <td>${d}</td>
                    <td>${scoreHomeTeam}:${scoreAwayTeam}</td>
                </tr>
        `;
    });

    matchElement.innerHTML = `
            <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
                <table class="striped responsive-table">
                    <thead>
                        <tr>
                            <th>Peserta</th>
                            <th>Tanggal</th>
                            <th>Skor Akhir</th>
                        </tr>
                     </thead>
                    <tbody id="matches">
                        ${matches}
                    </tbody>
                </table>
            </div>
    `;
}

function showScorers(data) {
    setPageTitle("Daftar Top Skor Liga Spanyol");
    let scorers = "";
    let scorerElement = document.getElementById("content-list");

    data.scorers.forEach(scorer => {
        scorers += `
                <tr>
                    <td>${scorer.player.name}</td>
                    <td>${scorer.team.name}</td>
                    <td>${scorer.numberOfGoals}</td>
                </tr>
        `;
    });

    scorerElement.innerHTML = `
            <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
                <table class="striped responsive-table">
                    <thead>
                        <tr>
                            <th>Nama Pemain</th>
                            <th>Klub</th>
                            <th>Jumlah Gol</th>
                        </tr>
                     </thead>
                    <tbody id="scorers">
                        ${scorers}
                    </tbody>
                </table>
            </div>
    `;
}

function showFavourites() {
    showProgress(true);
    getAll().then(fav_item => {
        if (fav_item.length < 1) document.getElementById("content-list").innerHTML = '<div class="center-align"><h4>Belum ada daftar klub Favorit...!</h4></div>';
        else showTeam(fav_item, true);
        showProgress(false);
    }).catch(err => {
        document.getElementById("content-list").innerHTML = '<div class="center-align"><h4>' + err + '</h4></div>';
        showProgress(false);
    });
}

function setPageTitle(title) {
    document.querySelector('h3.header').innerHTML = title
}

function toggleFav(team, el) {
    const className = el.classList;
    if (className == 'link-item fav-content') {
        el.classList = 'link-item unfav-content';
        deleteFav(team.id).then(() => {
            M.toast({ html: 'Klub telah dihapus dari daftar Favorit' });
            let page = window.location.hash.substr(1);
            if (page === "favourites") showFavourites();
        })
    } else if (className == 'link-item unfav-content') {
        el.classList = 'link-item fav-content';
        addToFavourite(team).then(() => {
            M.toast({ html: 'Klub telah ditambahkan ke daftar Favorit' })
        })
    }

}

function showProgress(show) {
    const contents = document.querySelector("#body-content");
    const progress = document.querySelector(".progress");
    if (show) {
        progress.style.display = "block";
        contents.style.display = "none";
    } else {
        progress.style.display = "none";
        contents.removeAttribute("style");
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}