let territories = neighborHoods;

let selectedTerritory = {};

let user = {
	territories: [],
	troopCount: 0,
	points: 2,
	selectedHero: {}
};

let zombies = {
	territories: [],
	troopCount: 0,
	points: 2
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


function begin() {
	setupGame();
	startGame();
	startPlayersTurn(user);
};


function setupGame() {
	territories = assignTerritories(territories);
	setBoard(territories);
}

function startGame() {
	let currentPlayer = user;
	let gameOver = false;
}

function startPlayersTurn(player) {

	let newTroops = 0;
	let numTerritories = player.territories.length;

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

	// populate controlls
	if (user.points < 10) {
		var message = "Do you want to buy more troops? You can get " + pointsToTroopConversion[user.points] + " more troops!";
	} else {
		var message = "Do you want to buy more troops? You can get 30 more troops!";
	}

	let visualDiv = $('#visual');
	let controlDiv = $('#control');
	let messageDiv = $('#message');

	controlDiv.html('');

	let noButton = $('<a>')
	let yesButton = $('<a>')
	noButton.text('No');
	yesButton.text('Yes');

	noButton.on('click', (x) => {
		placeTroops(newTroops);
	})

	yesButton.on('click', (x) => {
		newTroops += pointsToTroopConversion[user.points];
		user.points = 0;
		placeTroops(newTroops);
	});

	controlDiv.append(yesButton);
	controlDiv.append(noButton);

	visualDiv.html("<img src='" + user.selectedHero.imageURL + " ' />");

	messageDiv.html(message);

}

function placeTroops(numberOfTroops) {
	let visualDiv = $('#visual');
	let controlDiv = $('#control');
	let messageDiv = $('#message');

	visualDiv.html('');
	controlDiv.html('');
	messageDiv.html('');

	for (var i = 0; i < numberOfTroops; i++) {
		controlDiv.append($('<a class="btn btn-primary" > troop </a>' ));
	}
};


function playGame() {

	playerTurn(currentPlayer);
	gameOver = currentPlayer.territories.length >= 40;
	currentPlayer === user ? currentPlayer = zombies : currentPlayer = user;

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

	user.territories = userTerritories;
	zombies.territories = zombiesTerritories;

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

		polygon.on( 'click', (x) => {selectedTerritory = territory});


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
	let announcement = ''
	if (winner == user) {
		announcement = $('<h1>').text('Congratulations you beat the Zombies!!!')
	} else{
		announcement = $('<h1>').text('You DIED!!! Zombies win this time!')
	}
	$(document.body).html(announcement);
}

function clearControlls() {
	let controls = $('#controls');
	controls.html('');
}

function playerHasMoves(player) {
	return (player.territories / player.troopCount) > 1;
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
		$("#userDie").attr("src","images/zombie_killer.jpg");

    // Hide the Modal
    $("#myBtn").click(function(){
        $("#myModal").modal("hide");
    });
});

$( "#hero" ).click(function() {
		$('.modal').modal('hide');
		user.selectedHero.name = 'Russell Okung'
		user.selectedHero.imageURL = 'images/okung.png'
		begin();
		$("#userDie").attr("src", user.selectedHero.imageURL);
});
$( "#hero1" ).click(function() {
		$('.modal').modal('hide');
		user.selectedHero.name = 'Peyton Manning'
		user.selectedHero.imageURL = 'images/manning.png'
		begin();
		$("#userDie").attr("src", user.selectedHero.imageURL);
});
$( "#hero2" ).click(function() {
		$('.modal').modal('hide');
		user.selectedHero.name = 'CJ Anderson'
		user.selectedHero.imageURL = 'images/anderson.png'
		begin();
		$("#userDie").attr("src", user.selectedHero.imageURL);
});
$( "#hero3" ).click(function() {
		$('.modal').modal('hide');
		user.selectedHero.name = 'Demaryius Thomas'
		user.selectedHero.imageURL = 'images/thomas.png'
		begin();
		$("#userDie").attr("src", user.selectedHero.imageURL);
});
$( "#hero4" ).click(function() {
		$('.modal').modal('hide');
		user.selectedHero.name = 'John Elway'
		user.selectedHero.imageURL = 'images/elway.png'
		begin();
		$("#userDie").attr("src", user.selectedHero.imageURL);
});
