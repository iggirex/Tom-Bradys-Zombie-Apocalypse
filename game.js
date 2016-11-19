let territories = neighborHoods;

let user = {
	territories: [],
	troopCount: 0,
	points: 0
};

let zombies = {
	territories: [],
	troopCount: 0,
	points: 0
};

playGame();

function playGame() {

	territories = assignTerritories(territories);
	setBoard(territories);

	let currentPlayer = user;
	let gameOver = false;

	// TODO Game Logig
	// while(!gameOver) {
	// 	playerTurn(currentPlayer);
	// 	gameOver = currentPlayer.territories.length >= 22;
	// 	if(gameOver) break;
	// 	currentPlayer === user ? currentPlayer = zombies : currentPlayer = user;
	// }
	//
	// announceWinner(currentPlayer);

}

function assignTerritories(territories) {

	let counter = 1;
	let userTerritories = [];
	let zombiesTerritories = [];

	while (territories.length > 0) {

		let element = territories.splice(Math.floor(Math.random() * territories.length ), 1);

		if (counter % 2 == 0 ) {
			userTerritories.push(element[0]);
		} else {
			zombiesTerritories.push(element[0]);
		}

		counter ++
	}

	for (territory of userTerritories) {
		territory.owner = 'user';
		user.troopCount += territory.troops;
	}

	for (territory of zombiesTerritories) {
		territory.owner = 'zombies';
		zombies.troopCount += territory.troops;
	}

	let assignedTerritories = zombiesTerritories.concat(userTerritories);

	return assignedTerritories;

}

function setBoard(territories) {
	for (let territory of territories) {

		if (territory.owner == 'user') {
			color = 'blue';
		} else {
			color = 'red'
		}

		let polygon = L.polygon([
			territory.coordinates[0].reverse(),
			territory.coordinates[1].reverse(),
			territory.coordinates[2].reverse(),
			territory.coordinates[3].reverse()
		], {color: color}).addTo(map)

		polygon.bindPopup(territory.name);
		placeMarkers(territory, color);
	}
}

function placeMarkers(territory, color) {
	let long = 0;
	let lat = 0;

	for (point of territory.coordinates) {
		long += point[0];
		lat += point[1];
	}

	long = long / territory.coordinates.length;
	lat = lat / territory.coordinates.length;

	let marker = L.marker([long, lat]).addTo(map);

	for(var i = 1; i < territory.troops; i++) {
		let center = [long, lat];
		let newPoint = [(long + territory.coordinates[i][0]) / 2, (lat + territory.coordinates[i][1]) / 2]
		let marker = L.marker(newPoint).addTo(map);
	}
}

// function playerTurn(player) {
//
// 	// Player spend cards
//
// 	// Player place markers
//
// 	// while (playerHasMoves()) {
// 		// if playerPasses break
// 		// SelectTerritory
// 		// SelectTerritory to Attack
// 		// SelectNumber of men to attack with
// 		// Enter Battle
// 		// Player chooses to end turn
// // 	}
//
// 	// drawCard()
// }
//
// function spendCards(player) {
// 	if(player.points < 2) {
// 		return
// 	}
// 	clearInstructions();
//
// }
// // TODO clearInstructions()
// function battle() {
//
// }
