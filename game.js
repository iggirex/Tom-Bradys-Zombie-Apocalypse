let territories = neighborHoods;

let selectedTerritory = {};

let user = {
	territories: [],
	troopCount: 0,
	points: 0,
	selectedHero: {}
};

let zombies = {
	territories: [],
	troopCount: 0,
	points: 0
};

let pointsToTroopConversion =  {
	[2]: 2,
	[3]: 4,
	[4]: 7,
	[5]: 10,
	[6]: 13,
	[7]: 17,
	[8]: 21,
	[9]: 25,
	[10]: 30
}

playGame();

function playGame() {

	territories = assignTerritories(territories);
	setBoard(territories);

	let currentPlayer = user;
	let gameOver = false;

	// while(!gameOver) {
	// 	// playerTurn(currentPlayer);
	// 	// gameOver = currentPlayer.territories.length >= 40;
	// 	if(gameOver) break;
	// 	currentPlayer === user ? currentPlayer = zombies : currentPlayer = user;
	// }

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

		//adding this extra to name attackable territories
		polygon.bindPopup(territory.name);
		// stuff

		polygon.on( 'click', selectedTerritory = territory);
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

function announceWinner(winner) {
	if (winner == user) {
		let announcement = $('<h1>').text('Congratulations you beat the Zombies!!!')
	} else{
		let announcement = $('<h1>').text('You DIED!!! Zombies win this time!')
	}
	$(document.body).html(announcement);
}

function playerTurn(player) {

	let newTroops = 0;
	let numTerritories = player.territory.length;

	if (numTerritories > 36) {
		newTroops += 9;
	} else if(numTerritories > 33) {
		newTroops += 8;
	} else if(numTerritories > 30) {
		newTroops += 7;
	} else if(numTerritories > 27) {
		newTroops += 6;
	} else if(numTerritories > 24) {
		newTroops += 5;
	} else if(numTerritories > 21) {
		newTroops += 4;
	} else if(numTerritories > 18) {
		newTroops += 3;
	} else if(numTerritories > 15) {
		newTroops += 2;
	} else if(numTerritories > 12) {
		newTroops += 1;
	}

	spendPoints(player)

	// Player place markers

	while (playerHasMoves()) {
		// if playerPasses break
		// SelectTerritory
		// SelectTerritory to Attack
		// SelectNumber of men to attack with
		// Enter Battle
		// Player chooses to end turn
	}

	drawCard(player)
}

function spendPoints(player) {
	if (player.points < 2) return;
	clearControlls()
	// populate controlls
	if (player.points < 10) {
		let message = "Do you want to buy more troops? You can get " + pointsToTroopConversion[player.points] + " more troops!";
	} else {
		let message = "Do you want to buy more troops? You can get 30 more troops!";
	}




}

function clearControlls() {
	let controls = $('#controls');
	controls.html('');
}

function playerHasMoves(player) {
	return (player.territory / player.troopCount) > 1;
}

function drawCard(player) {
	if(Math.random() * 100 < 20) {
		player.points += 2;
	} else {
		player.points += 1;
	}
}

// function battle() {
//
// }


$(document).ready(function(){
    // Show the Modal on load
    $("#myModal").modal("show");

    // Hide the Modal
    $("#myBtn").click(function(){
        $("#myModal").modal("hide");
    });
});

$( "#hero" ).click(function() {
		$('.modal').modal('hide');
		user.selectedHero.name = 'Russell Okung'
		user.selectedHero.imageURL = 'images/okung.png'
});
$( "#hero1" ).click(function() {
		$('.modal').modal('hide');
		user.selectedHero.name = 'Peyton Manning'
		user.selectedHero.imageURL = 'images/manning.png'
});
$( "#hero2" ).click(function() {
		$('.modal').modal('hide');
		user.selectedHero.name = 'CJ Anderson'
		user.selectedHero.imageURL = 'images/anderson.png'
});
$( "#hero3" ).click(function() {
		$('.modal').modal('hide');
		user.selectedHero.name = 'Demaryius Thomas'
		user.selectedHero.imageURL = 'images/thomas.png'
});
$( "#hero4" ).click(function() {
		$('.modal').modal('hide');
		user.selectedHero.name = 'John Elway'
		user.selectedHero.imageURL = 'images/elway.png'
});
