function rollDice() {
  document.getElementById('status').innerHTML = ''
  let zombieDie = document.getElementById('zombieDie')
  let userDie = document.getElementById('userDie')
  let status = document.getElementById('status')
  let zDie = Math.floor(Math.random() * 6) + 1
  let uDie = Math.floor(Math.random() * 6) + 1
  let diceTotal = zDie + uDie
  $("#zombieDie").attr("src","images/b"+zDie+".png");
  $("#userDie").attr("src","images/r"+uDie+".png");

  if(zDie === uDie) {
    status.innerHTML += "Tie... roll again"
    $("#winner").attr("src","images/tie.jpg");

  } else if (zDie > uDie) {
    $("#winner").attr("src","images/zombie.gif");

  }else{
    $("#winner").attr("src","images/zombie_killer.jpg");
  }
}
