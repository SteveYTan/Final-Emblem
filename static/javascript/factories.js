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
			$http.get('http://pokeapi.co/api/v1/pokemon/' + numberArray[i]).success(function(output){
				
				var pokemon = {
					name: output.name,
					img :  "<img src='http://pokeapi.co/media/img/"+ output.national_id + ".png'>",
					hp : Math.ceil(1.5 * (output.hp + 100)),
					attack: Math.ceil((output.attack+ output.sp_atk)/2),
					status : 'ntrdy',
					timer : 6 + Math.ceil(400/(output.speed + 40)),
					cooldown : 0,
					maxmoves : 2 + Math.ceil(output.speed/20),
					moves: 2 + Math.ceil(output.speed/20),
					type1: output.types[0].name,
					player: "player1"

					
				};
				//console.log(output.types.0.name);
				if(output.types[1])
				{
					pokemon.type2 = output.types[1].name;
				}
				//console.log(pokemon);
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


