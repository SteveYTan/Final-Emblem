var angApp = angular.module('angApp', ['ngRoute']);

// ---- FACTORIES
angApp.factory('gameFactory', function($http){
	var factory = {};
	var name = '';
	var info;
	var team = 'villian';
	var difficulty = 'normal';
	var enemy = [12,89,42,15];
	var diffX = 1;

	

	factory.maketeam = function(data, callback)
	{
		team = data;
		callback(data);
	}
	factory.setdifficulty = function (d, callback)
	{
		difficulty = d;
		if (d == 'hard')
		{
			diffX = 1.3;
		}


		callback(d);
	}
	factory.getpokemon = function(numberArray, callback){
		var data = [];
		//console.log(numberArray);
		var count = 0;
		for (var i = 0; i < numberArray.length; i++)
		{
			//$http.get('http://pokeapi.co/api/v2/pokemon/' + numberArray[i]).success(function(output){
			// old HTTP Request

			$http.get('http://pokeapi.salestock.net/api/v2/pokemon/' + numberArray[i]).success(function(output){
				
				var pokemon = {

					//output.stats[0] = Speed
					//output.stats[1] = SP Def
					//output.stats[2] = SP Atk

					name: output.name,
					img :  "<img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+ output.id + ".png'>",
					hp : Math.ceil(1.5 * (output.stats[5].base_stat + 100)),
					attack: Math.ceil((output.stats[4].base_stat+ output.stats[2].base_stat)/2),


					status : 'ntrdy',
					//timer : 6 + Math.ceil(400/(output.speed + 40)),
					timer : 6 + Math.ceil(400/(output.stats[0].base_stat+ 40)),
					cooldown : 0,
					maxmoves : 2 + Math.ceil(output.stats[0].base_stat/20),
					moves: 2 + Math.ceil(output.stats[0].base_stat/20),
					type1: output.types[0].type.name,
					player: "player1"

					
				};
				console.log(output.types);

				if(output.types[1])
				{
					pokemon.type2 = output.types[1].type.name;
				}
				console.log(pokemon);
				data.push(pokemon);
				count++
				{
					if (count == numberArray.length)
						{ callback(data);}
				}

			})
			

		}
		
		//callback(data);

	}
	factory.getteam = function()
	{
		if (team == 'villian')
		{
			return [40,6,134];
			//40,6,113
		}
		else{
			return team;
		}

	}
	factory.getdifficulty = function()
	{
		if (difficulty == 'easy')
		{
			enemy = [12,89,42];
			return difficulty;
		}
		else if(difficulty == 'hard')
		{
			enemy = [91,89,106,42,150];
			return difficulty;
		}
		else{
			difficulty = 'normal'
			enemy = [12,89,42,15];
			return difficulty;
		}
	}
	factory.getdiffX = function(){
		return diffX;
	}
	factory.getenemies = function()
	{
		return enemy;
		
	}

	return factory;
});


