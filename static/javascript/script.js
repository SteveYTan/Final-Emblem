angApp.controller('mainController', function($scope, gameFactory, $location){
	
	var today = new Date();
	var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10){
    	dd='0'+dd
    } 
    if(mm<10){
    	mm='0'+mm
    } 
    var d = yyyy+'/'+mm+'/'+dd;
    var newdate = new Date(d);

    console.log(newdate);


    
    $scope.game = function(){

    	var pokearray = [];
    	pokearray.push($scope.newTeam.a);
    	pokearray.push($scope.newTeam.b);
    	pokearray.push($scope.newTeam.c);

    	console.log("hello!!!");

    	gameFactory.maketeam(pokearray, function(){

    	});
    	gameFactory.setdifficulty($scope.difficulty, function(){

    	});


    	$location.path('/game');
    }


})

angApp.controller('gameController', function($scope, gameFactory, $compile){
	console.log("You in the game controller");
	var world1 = [ //default world
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

	];
	$scope.arr1 = [1,2,3,4,5,6,7,8];
	$scope.selectedItem = [1,1];
	$scope.team = [];
	$scope.enemy = [];



	$scope.highlight = function(i, j){

		if (($scope.world[i][j].className == 'grid + ground' && ($scope.world[i][j].pokemon.name != "")) && ( $scope.world[i][j].pokemon.player != 'enemy' &&
			$scope.world[i][j].pokemon.name != 'null'))
		{
			$scope.world[$scope.selectedItem[0]][$scope.selectedItem[1]].className = 'grid + ground';

			$scope.selectedItem = [i,j];
			$scope.getTargets(i,j);
			$scope.world[i][j].className = "grid ground highlight";


		}
		//console.log($scope.world[i][j]);
		//console.log($scope.team);

	}

	$scope.create = function(world){
		var newworld = [];
		for (var i = 0; i < world.length; i++){

			var row = [];

			for (var j = 0; j < world[i].length; j++){
				var grid = { 
					column: i + 1,
					row: j + 1,

					className: "grid + ",
					class2Name: "nothl",

					pokemon : {
						name: "null" ,
						img: ""

					}
				};
				if (world[i][j] == 0)
				{
				//grid.background =  "<div ng-class='{" + 'highlight' + " : selectedItem === item}' ng-click='changeClass(i , j )' class='ground grid'>";
				grid.className += 'ground';
			}
			if (world[i][j] == 1)
			{
				grid.className += ' block ';

			}
			row.push(grid);

		}
		newworld.push(row);
	}
	return newworld;

}
var time = 0;
$scope.draw = function(world){
	var output = '';
	var x = $scope.selectedItem[0];
	var y = $scope.selectedItem[1];

	for(var i=0; i<world.length; i++)
	{
		output += "<div class='row'>";
		for(var j=0; j<world[i].length; j++)
		{
			output += 
			//class name\
			"<div class = '" +
			world[i][j].className + "'" +

			" ng-click = 'highlight("+i+","+ j+")' " +

			"ng-class = '" + world[i][j].class2Name + "'" +

			">" 

			+ world[i][j].pokemon.img  


			+ "</div>";
		}
		output += "</div>";
	}
	document.getElementById('world').innerHTML = output;

	document.getElementById('ui').innerHTML = $scope.uiMaker(x,y);


	$('.grid').replaceWith($('.grid'));
	//$('.targets').replaceWith($('.targets'));
	$compile($('.grid'))($scope);
	$compile($('.target'))($scope);

}
$scope.uiMaker = function(x,y)
{

	var string = "<div class = 'player1'><table><th>Pokemon</th><th> HP</th><th>Moves</th>";

	for (var i = 0; i < $scope.team.length; i++) {
		string += "<tr><td>" + $scope.team[i].name + "</td>"
		+ "<td>" + $scope.team[i].hp + "</td>";

		if ($scope.team[i].hp != '')
		{
			string += "<td>" + $scope.team[i].moves + "/"
			+ $scope.team[i].maxmoves + "</td>"
		}
		string += "</tr>";

	};

	string += " </table>";

	for (var i = 0; i < $scope.team.length; i++){
		string += "<span class = 'ninja'>";

		if( $scope.team[i].cooldown < $scope.team[i].timer)
		{	
			string += "<li>"  + $scope.team[i].name;
			string += "   [" + $scope.team[i].cooldown 
			+ "]" + "<span>"+$scope.team[i].timer+"</span>";
		}
		else{
			if ($scope.team[i].hp != '')
			{
				string += "<li>" + $scope.team[i].name 
				+ " <span class = 'right'> is ready! </span></li>";}
			}
			string += "</li>";

		}
		string += "</div>"+
		"<div class = 'option'>"

		+ "<h1>";
		if( $scope.world[x][y].pokemon.name != 'null')
			{string += $scope.world[x][y].pokemon.name }
		string += "</h1><h3>Select Attack Target</h3>";
		if ($scope.targets)
		{
			for (var i = 0; i < $scope.targets.length; i++) {
				string += "<button ng-click = 'attack("+$scope.targets[i].x+","+$scope.targets[i].y+","+ $scope.targets[i].n+")' class = 'target'>"+ $scope.targets[i].name+" </button>"
			};
		}
		string += "</div>" 
		+ " <div class = 'player2'> "
		+ "<h3 class = 'm'> Difficulty-"+ gameFactory.getdifficulty() +"</h3>"
		+ "<table><th> Name</th><th> HP</th><th>Atk</th>";

		for (var i = 0; i < $scope.enemy.length; i++) {
			string += "<tr>"
			+ "<td>"+ $scope.enemy[i].name +"</td>"
			+ "<td>"+ $scope.enemy[i].hp +"</td>"
			+ "<td>"+ $scope.enemy[i].attack +"</td></tr>";
		};

		+ "</table></div>";

		return string;
	}
	$scope.key = function(e){

	//console.log(e.keyCode);
	var x = $scope.selectedItem[0]
	var y = $scope.selectedItem[1]
	var temppoke = $scope.world[x][y].pokemon;

	
	if ((e.keyCode == 87 && $scope.world[x][y].pokemon.status == 'ready') && ( ($scope.world[x-1][y].pokemon.name == 'null' || 
		$scope.world[x-1][y].pokemon.name == '' )&&
		$scope.world[x-1][y].className == 'grid + ground'))
	{
		$scope.world[x][y].pokemon = $scope.world[x-1][y].pokemon;
		$scope.world[x-1][y].pokemon = temppoke;
		$scope.highlight(x-1,y);

		$scope.syncPoke($scope.world[x-1][y]);
		$scope.move($scope.world[x-1][y]);

	}
	if ((e.keyCode == 83 && $scope.world[x][y].pokemon.status == 'ready'

		) && ( ($scope.world[x+1][y].pokemon.name == 'null' || 
			$scope.world[x+1][y].pokemon.name == '' ) &&
		$scope.world[x+1][y].className == 'grid + ground'))
	{
		$scope.world[x][y].pokemon = $scope.world[x+1][y].pokemon;
		$scope.world[x+1][y].pokemon = temppoke;
		$scope.highlight(x+1,y);
		$scope.syncPoke($scope.world[x+1][y]);
		$scope.move($scope.world[x+1][y]);
	}
	if ((e.keyCode == 65 && $scope.world[x][y].pokemon.status == 'ready') &&( ($scope.world[x][y-1].pokemon.name == 'null' || 
		$scope.world[x][y-1].pokemon.name == '' )&&
		$scope.world[x][y-1].className == 'grid + ground'))
	{
		$scope.world[x][y].pokemon = $scope.world[x][y-1].pokemon;
		$scope.world[x][y-1].pokemon = temppoke;
		$scope.highlight(x,y-1);
		$scope.syncPoke($scope.world[x][y-1]);
		$scope.move($scope.world[x][y-1]);
	}
	if ((e.keyCode == 68 && $scope.world[x][y].pokemon.status == 'ready') && ( ($scope.world[x][y+1].pokemon.name == 'null' || 
		$scope.world[x][y+1].pokemon.name == '' ) &&
		$scope.world[x][y+1].className == 'grid + ground'))
	{
		$scope.world[x][y].pokemon = $scope.world[x][y+1].pokemon;
		$scope.world[x][y+1].pokemon = temppoke;
		$scope.highlight(x,y+1);
		$scope.syncPoke($scope.world[x][y+1]);
		$scope.move($scope.world[x][y+1]);
	}


}
$scope.move = function(grid){
	$scope.team[grid.pokemon.n]

	if ($scope.team[grid.pokemon.n].status == 'ready')
	{
		$scope.team[grid.pokemon.n].moves -= 1;
		$scope.draw($scope.world);

		if($scope.team[grid.pokemon.n].moves == 0)
		{
			//console.log("no moves");
			$scope.team[grid.pokemon.n].status = 'notrdy';
			$scope.team[grid.pokemon.n].cooldown = 0;
			$scope.targets = [];
		}

	}

}
$scope.hello = function(){
	console.log("you are in main/hello()");
}
$scope.setTeam1 = function(){

	$scope.world[2][1].pokemon = $scope.team[0];
	$scope.world[2][1].pokemon.n = 0;

	$scope.world[3][2].pokemon = $scope.team[1];
	$scope.world[3][2].pokemon.n = 1;
	
	$scope.world[4][1].pokemon = $scope.team[2];
	$scope.world[4][1].pokemon.n = 2;


}

$scope.setEnemy = function(){

	$scope.enemy[0].player = 'enemy';
	$scope.enemy[0].n = 0;
	$scope.enemy[0].x = 1;
	$scope.enemy[0].y = 13;
	$scope.enemy[0].hp = Math.ceil($scope.enemy[0].hp * gameFactory.getdiffX());
	$scope.enemy[0].attack = Math.ceil($scope.enemy[0].attack * gameFactory.getdiffX());
	$scope.world[1][13].pokemon = $scope.enemy[0];

	$scope.world[1][13].className += ' enemy';

	$scope.enemy[1].player = 'enemy';
	$scope.enemy[1].n = 1;
	$scope.enemy[1].x = 3;
	$scope.enemy[1].y = 11;
	$scope.enemy[1].hp = Math.ceil($scope.enemy[1].hp * gameFactory.getdiffX());
	$scope.world[3][11].pokemon = $scope.enemy[1];
	$scope.world[3][11].className += ' enemy';

	$scope.enemy[2].player = 'enemy';
	$scope.enemy[2].n = 2;
	$scope.enemy[2].x = 7;
	$scope.enemy[2].y = 13;
	$scope.enemy[2].hp = Math.ceil($scope.enemy[2].hp * gameFactory.getdiffX());
	$scope.world[7][13].pokemon = $scope.enemy[2];
	$scope.world[7][13].className += ' enemy';

	if ($scope.enemy[3])
	{
		$scope.enemy[3].player = 'enemy';
		$scope.enemy[3].n = 3;
		$scope.enemy[3].x = 4;
		$scope.enemy[3].y = 10;
		$scope.enemy[3].hp = Math.ceil($scope.enemy[3].hp * gameFactory.getdiffX());
		$scope.world[4][10].pokemon = $scope.enemy[3];
		$scope.world[4][10].className += ' enemy';
	}
	if($scope.enemy[4])
	{
		$scope.enemy[4].player = 'enemy';
		$scope.enemy[4].n = 4;
		$scope.enemy[4].x = 6;
		$scope.enemy[4].y = 12;
		$scope.enemy[4].hp = Math.ceil($scope.enemy[4].hp * gameFactory.getdiffX());
		$scope.world[6][12].pokemon = $scope.enemy[4];
		$scope.world[6][12].className += ' enemy';
	}

}
$scope.syncPoke = function (obj){
	console.log($scope.world[obj.column-1][obj.row-1].pokemon);
	console.log($scope.team[obj.pokemon.n]);
	// $scope.world[obj.column-1][obj.row-1].pokemon =
	// $scope.team[obj.pokemon.n];

}
$scope.updatePokemon = function()
{	
	
	for (var i = 0; i < $scope.team.length; i++){

		if ($scope.team[i].status != "ready"){
			$scope.team[i].cooldown++;
			if ($scope.team[i].cooldown == $scope.team[i].timer)
			{
				$scope.team[i].status = 'ready';
				$scope.team[i].moves = $scope.team[i].maxmoves;
				$scope.getTargets($scope.selectedItem[0],$scope.selectedItem[1]);
			}
		}
	}
}
$scope.getTargets = function(x,y){
	$scope.targets = [];
	
	if ($scope.world[x-1][y].pokemon.name != 'null')
	{
		if($scope.world[x-1][y].pokemon.player == 'enemy')
		{
			$scope.targets.push($scope.world[x-1][y].pokemon);
		}
	}
	if ($scope.world[x+1][y].pokemon.name != 'null')
	{
		if($scope.world[x+1][y].pokemon.player == 'enemy')
		{
			$scope.targets.push($scope.world[x+1][y].pokemon);
		}
	}
	if ($scope.world[x][y-1].pokemon.name != 'null')
	{
		if($scope.world[x][y-1].pokemon.player == 'enemy')
		{
			$scope.targets.push($scope.world[x][y-1].pokemon);
		}
	}
	if ($scope.world[x][y+1].pokemon.name != 'null')
	{
		if($scope.world[x][y+1].pokemon.player == 'enemy')
		{
			$scope.targets.push($scope.world[x][y+1].pokemon);
		}
	}
	
}
$scope.attack = function(x,y,id)
{
	var a = $scope.selectedItem[0];
	var b = $scope.selectedItem[1];
	var z = $scope.world[a][b].pokemon.n;
	var pokemon = {
		name: "",
		hp: '',
		img: ""
	};
	if($scope.team[z].status == 'ready'){
		

		var att1 = Math.ceil(($scope.world[a][b].pokemon.attack + 30) 
			* $scope.typeBonus($scope.world[a][b].pokemon, $scope.world[x][y].pokemon));


		var att2 = Math.ceil(($scope.enemy[id].attack+30) * 2/3 * 
			$scope.typeBonus($scope.world[x][y].pokemon, $scope.world[a][b].pokemon));



		$scope.enemy[id].hp -= att1;
		if ($scope.enemy[id].hp <= 0)
		{

			if($scope.world[x][y].pokemon.player == 'enemy'
				&& $scope.world[x][y].pokemon.n == id)
			{

				$scope.world[x][y].pokemon = pokemon;
				$scope.world[x][y].className = 'grid + ground';
				$scope.world[x][y].player = '';
			}

			$scope.enemy[id] = {
				name: "" ,
				hp: '',
				attack: '',
				img: ""

			}; 

			$scope.getTargets(a,b);

		}

		if ($scope.enemy[id].name !=''){
			$scope.team[z].hp -= att2;
			if ($scope.team[z].hp <= 0)
			{
				$scope.targets = '';
				$scope.team[z] = {
					name: "" ,
					hp: '',
					img: "",
					maxmoves: "",
					moves: ""
				}; 
				$scope.world[a][b].pokemon = pokemon;
				$scope.world[a][b].className = 'grid + ground';
			}
		}

		$scope.targets = [];
		$scope.team[z].status = 'notrdy';
		$scope.team[z].cooldown = 0;

	}
	
}
$scope.aiMove = function(){
	for (var i = 0; i < $scope.enemy.length; i++) {
		if ($scope.enemy[i].status != 'ready')
		{
			$scope.enemy[i].cooldown++;

			if($scope.enemy[i].cooldown == 10)
			{
				if($scope.world[$scope.enemy[i].x][$scope.enemy[i].y].player = 'enemy')
				{
					$scope.checkandgo($scope.enemy[i].x, $scope.enemy[i].y, i)

				}
				$scope.aiSync(i);
				$scope.enemy[i].cooldown = 0;
				//$scope.getTargets($scope.selectedItem[0], $scope.selectedItem[1]);
				
			}
		}
		
	};
	

}
$scope.aiSync = function(i){
	
	if($scope.enemy[i].x)
	{
		$scope.world[$scope.enemy[i].x][$scope.enemy[i].y].pokemon = $scope.enemy[i];
		$scope.world[$scope.enemy[i].x][$scope.enemy[i].y].row = $scope.world[$scope.enemy[i].x][$scope.enemy[i].y].pokemon.x;
		$scope.world[$scope.enemy[i].x][$scope.enemy[i].y].column = $scope.world[$scope.enemy[i].x][$scope.enemy[i].y].pokemon.y;
	}
	
}
$scope.checkandgo = function(x,y,i)
{
	
	if ($scope.world[x][y].pokemon.player == 'enemy' && $scope.world[x][y].className == 'grid + ground enemy')
	{
		var temp = $scope.world[x][y];
		temp.pokemon.cooldown = 0;
		var random = Math.floor(Math.random() * 5);
		var counter = 0;
		while(counter < 1)
		{
			if (random == 0){
			//console.log("I wait");
			counter++;
		}
		if(random == 1){
			if (($scope.world[x-1][y].className == 'grid + ground'
				&& !$scope.world[x-1][y].pokemon.x) && ( $scope.world[x-1][y].pokemon.player != 'player1'))
			{

				$scope.world[x][y] = $scope.world[x-1][y];
				$scope.world[x-1][y] = temp;
				$scope.enemy[i].x = x - 1;
				counter++;
			}
			else{
				random = 0;
			}
		}
		if(random == 2){
			if(($scope.world[x+1][y].className == 'grid + ground'
				&& !$scope.world[x+1][y].pokemon.x) && ($scope.world[x+1][y].pokemon.player != 'player1'))
			{
				//console.log("I move down");
				$scope.world[x][y] = $scope.world[x+1][y];
				$scope.world[x+1][y] = temp;
				$scope.enemy[i].x = x + 1;
				counter++;
			}
			else{
				random = 0;
			}
		}
		if(random == 3){
			if(($scope.world[x][y-1].className == 'grid + ground'
				&& !$scope.world[x][y-1].pokemon.y) && ($scope.world[x][y-1].pokemon.player != 'player1'))
			{

				$scope.world[x][y] = $scope.world[x][y-1];
				$scope.world[x][y-1] = temp;
				$scope.enemy[i].y = y - 1;
				counter++;
			}
			else{
				random = 0;
			}
		}
		if(random == 4){
			if(($scope.world[x][y+1].className == 'grid + ground'
				&& !$scope.world[x][y+1].pokemon.y) && ($scope.world[x][y+1].pokemon.player != 'player1'))
			{
				//console.log("I move right");
				$scope.world[x][y] = $scope.world[x][y+1];
				$scope.world[x][y+1] = temp;
				$scope.enemy[i].y = y+1;
				counter++;
			}
			else
			{
				random = 0;
				//random = Math.floor(Math.random() * 5);
			}
		}
		$scope.draw($scope.world);	

	}
}

}
$scope.aiAttack = function(){}



$scope.world = world1;
$scope.world = $scope.create(world1);

var teamarray = gameFactory.getteam();
gameFactory.getpokemon(teamarray, 
	function(poke){
		$scope.team = poke;
		$scope.setTeam1();
		$scope.draw($scope.world);
	});
var hard = gameFactory.getdifficulty();
var enemyarray = gameFactory.getenemies();
gameFactory.getpokemon(enemyarray,

	function(poke2){
		$scope.enemy = poke2;
		$scope.setEnemy();
		$scope.draw($scope.world);
	})

var mSeconds = 0;
$scope.loop = function(){
	$scope.draw($scope.world);

	if (mSeconds == 8)
	{

		mSeconds = 0;
		$scope.updatePokemon();
		$scope.aiMove();
		$scope.getTargets;

	}
	mSeconds++;

}
$scope.debug = function(){
	console.log($scope.enemy);
	console.log($scope.team);
}
$scope.typeBonus = function(pokemonA, pokemonB)
{
	
	var multiplier = typing[pokemonA.type1][pokemonB.type1];
	var multiplier2 = 0;
	if (pokemonA.type2)
	{
		multiplier2 = typing[pokemonA.type2][pokemonB.type1]
	}

	if (pokemonB.type2)
	{
		multiplier *= typing[pokemonA.type1][pokemonB.type2];
		if (pokemonA.type2){
			multiplier2 *= typing[pokemonA.type2][pokemonB.type2];}
		}

		if (multiplier < multiplier2)
		{
			multiplier = multiplier2;
		}
		if(multiplier >= 2)
		{
			console.log("It was Super Effective!");
		}



		return multiplier;


	}



	setInterval($scope.loop, 250);



	var typing = {
		normal : {
			normal: 1,
			fighting: 1,
			flying: 1,
			poison: 1,
			ground: 1,
			rock: .5,
			bug: 1,
			ghost: 0,
			steel: .5,
			fire: 1,
			water: 1,
			grass: 1,
			electric: 1,
			psychic: 1,
			ice: 1,
			dragon: 1,
			dark: 1,
			fairy: 1,
		},
		fighting : {
			normal: 2,
			fighting: 1,
			poison: .5,
			flying: .5,
			ground: .1,
			rock: 2,
			bug: .5,
			ghost: 0,
			steel: 2,
			fire: 1,
			water: 1,
			grass: 1,
			electric: 1,
			psychic: .5,
			ice: 2,
			dragon: 1,
			dark: 2,
			fairy: .5
		},
		flying : {
			normal: 1,
			fighting: 2,
			poison: 1,
			flying: 1,
			ground: 1,
			rock: .5,
			bug: 2,
			ghost: 1,
			steel: .5,
			fire: 1,
			water: 1,
			grass: 2,
			electric: .5,
			psychic: 1,
			ice: 1,
			dragon: 1,
			dark: 1,
			fairy: 1
		},
		poison : {
			normal: 1,
			fighting: 1,
			flying: 1,
			poison: .5,
			ground: .5,
			rock: .5,
			bug: 2,
			ghost: 1,
			steel: .5,
			fire: 1,
			water: 1,
			grass: 2,
			electric: 1,
			psychic: 1,
			ice: 1,
			dragon: 1,
			dark: 1,
			fairy: 2
		},
		ground : {
			normal: 1,
			fighting: 1,
			flying: 0,
			poison: 2,
			ground: 1,
			rock: 2,
			bug: .5,
			ghost: 1,
			steel: 2,
			fire: 2,
			water: 1,
			grass: .5,
			electric: 2,
			psychic: 1,
			ice: 1,
			dragon: 1,
			dark: 1,
			fairy: 1
		},
		rock : {
			normal: 1,
			fighting: .5,
			flying: 2,
			poison: 1,
			ground: .5,
			rock: 1,
			bug: 2,
			ghost: 1,
			steel: .5,
			fire: 2,
			water: 1,
			grass: 1,
			electric: 1,
			psychic: 1,
			ice: 2,
			dragon: 1,
			dark: 1,
			fairy: 1
		},
		bug : {
			normal: 1,
			fighting: .5,
			flying: .5,
			poison: .5,
			ground: 1,
			rock: 1,
			bug: 1,
			ghost: .5,
			steel: .5,
			fire: .5,
			water: 1,
			grass: 2,
			electric: 1,
			psychic: 2,
			ice: 1,
			dragon: 1,
			dark: 2,
			fairy: .5
		},
		ghost : {
			normal: 0,
			fighting: 1,
			flying: 1,
			poison: 1,
			ground: 1,
			rock: 1,
			bug: 1,
			ghost: 2,
			steel: 1,
			fire: 1,
			water: 1,
			grass: 1,
			electric: 1,
			psychic: 2,
			ice: 1,
			dragon: 1,
			dark: .5,
			fairy: 1
		},
		steel : {
			normal: 1,
			fighting: 1,
			flying: 1,
			poison: 1,
			ground: 1,
			rock: 2,
			bug: 1,
			ghost: 1,
			steel: .5,
			fire: .5,
			water: .5,
			grass: 1,
			electric: .5,
			psychic: 1,
			ice: 2,
			dragon: 1,
			dark: 1,
			fairy: 1
		},
		fire : {
			normal: 1,
			fighting: 1,
			flying: 1,
			poison: 1,
			ground: 1,
			rock: .5,
			bug: 2,
			ghost: 1,
			steel: 2,
			fire: .5,
			water: .5,
			grass: 2,
			electric: 1,
			psychic: 1,
			ice: 2,
			dragon: .5,
			dark: 1,
			fairy: 1
		},
		water : {
			normal: 1,
			fighting: 1,
			flying: 1,
			poison: 1,
			ground: 2,
			rock: 2,
			bug: 1,
			ghost: 1,
			steel: 1,
			fire: 2,
			water: .5,
			grass: .5,
			electric: 1,
			psychic: 1,
			ice: 1,
			dragon: .5,
			dark: 1,
			fairy: 1
		},
		grass : {
			normal: 1,
			fighting: 1,
			flying: .5,
			poison: .5,
			ground: 2,
			rock: 2,
			bug: .5,
			ghost: 1,
			steel: .5,
			fire: .5,
			water: 2,
			grass: .5,
			electric: 1,
			psychic: 1,
			ice: 1,
			dragon: .5,
			dark: 1,
			fairy: 1
		},
		electric : {
			normal: 1,
			fighting: 1,
			flying: 2,
			poison: 1,
			ground: 0,
			rock: 1,
			bug: 1,
			ghost: 1,
			steel: 1,
			fire: 1,
			water: 2,
			grass: .5,
			electric: .5,
			psychic: 1,
			ice: 1,
			dragon: .5,
			dark: 1,
			fairy: 1
		},
		psychic : {
			normal: 1,
			fighting: 2,
			flying: 1,
			poison: 2,
			ground: 1,
			rock: 1,
			bug: 1,
			ghost: 1,
			steel: .5,
			fire: 1,
			water: 1,
			grass: 1,
			electric: 1,
			psychic: .5,
			ice: 1,
			dragon: 1,
			dark: 0,
			fairy: 1
		},
		ice : {
			normal: 1,
			fighting: 1,
			flying: 2,
			poison: 1,
			ground: 2,
			rock: 1,
			bug: 1,
			ghost: 1,
			steel: .5,
			fire: .5,
			water: .5,
			grass: 2,
			electric: 1,
			psychic: 1,
			ice: .5,
			dragon: 2,
			dark: 1,
			fairy: 1
		},
		dragon : {
			normal: 1,
			fighting: 1,
			flying: 1,
			poison: 1,
			ground: 1,
			rock: 1,
			bug: 1,
			ghost: 1,
			steel: .5,
			fire: 1,
			water: 1,
			grass: 1,
			electric: 1,
			psychic: 1,
			ice: 1,
			dragon: 2,
			dark: 1,
			fairy: 0
		},
		dark : {
			normal: 1,
			fighting: .5,
			flying: 1,
			poison: 1,
			ground: 1,
			rock: 1,
			bug: 1,
			ghost: 2,
			steel: 1,
			fire: 1,
			water: 1,
			grass: 1,
			electric: 1,
			psychic: 2,
			ice: 1,
			dragon: 1,
			dark: .5,
			fairy: .5
		},
		fairy : {
			normal: 1,
			fighting: 2,
			flying: 1,
			poison: .5,
			ground: 1,
			rock: 1,
			bug: 1,
			ghost: 1,
			steel: .5,
			fire: .5,
			water: 1,
			grass: 1,
			electric: 1,
			psychic: 1,
			ice: 1,
			dragon: 2,
			dark: 2,
			fairy: 1
		}

	};




})






