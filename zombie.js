function rollDice() {
  document.getElementById('status').innerHTML = ''
  let zombieDie = document.getElementById('zombieDie')
  let userDie = document.getElementById('userDie')
  let status = document.getElementById('status')
  let zDie = Math.floor(Math.random() * 6) + 1
  let uDie = Math.floor(Math.random() * 6) + 1
  let diceTotal = zDie + uDie
  $("#zombieDie").attr("src","images/B"+zDie+".png");
  $("#userDie").attr("src","images/O"+uDie+".png");
  $("#zombieDie").effect( "bounce" );
  $("#userDie").effect( "bounce" );


  if(zDie === uDie) {
    status.innerHTML += "Tie... Roll Again"
    $("#winner").attr("src","images/tie.png");
    $("#winner").effect( "pulsate" );
  } else if (zDie > uDie) {
    $("#winner").attr("src","images/zombie.gif");
    $("#winner").effect( "puff" );


  }else{
    $("#winner").attr("src",user.selectedHero.imageURL);
    $("#winner").effect( "puff" );

  }
}
