let territories = neighborHoods;

let user = {
	territories: [],
	numberOfGuys: 0,
	points: 0
};

let zombies = {
	territories: [],
	numberOfGuys: 0,
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
	}

	for (territory of zombiesTerritories) {
		territory.owner = 'zombies'
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
			[territory.coordinates[0][1], territory.coordinates[0][0]],
			[territory.coordinates[1][1], territory.coordinates[1][0]],
			[territory.coordinates[2][1], territory.coordinates[2][0]],
			[territory.coordinates[3][1], territory.coordinates[3][0]]
		], {color: color}).addTo(map)

		// polygon.bindPopup(territory.name);
		// placeMarkers(territory);
	}
}
//
// // TODO placeMarkers(territories)
//
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
