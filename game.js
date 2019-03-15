window.onload = function(){ ini(); }

//Global Constants
const ScreenSizeX = 40;
const ScreenSizeY = 120;

const FPS = 30;
const SecodsBetweenFrames = 1 / FPS;

//Global Vars
var TheScreen = "";

//Player Class
var Player;

//List
var Level = [];
var EnemeyList = [];
var ProjectileList = [];

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //MapKey////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Money = "<span id=\"money\">*</span>";
const Floor = "<span id=\"floor\">#</span>";
const MeleeEnemy = "<span id=\"enemey\">x</span>";
const RangedEnemy = "<span id=\"enemey\">0</span>";
const Door = "<span id=\"door\">B</span>";
const Wall = "<span id=\"wall\">$</span>";
const Sword = "<span id=\"metalweapon\">t</span>";
const PlayerChar = "<span id=\"player\">S</span>";
const Bow = "<span id=\"woodweapon\">c</span>";
const Sheild = "<span id=\"armor\">u</span>";
const Helm = "<span id=\"armor\">n</span>";
const Armor = "<span id=\"armor\">y</span>";
const Staff = "<span id=\"woodweapon\">!</span>";
const Potion = "<span id=\"potion\">a</span>";
const Attack = "<span id=\"attack\">+</span>";


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //Initialise////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ini()
{
	 /////////
	//Set Up

	
	 ////////////////////
	//Player Class Setup
	PlayerSetup();
    
     ////////////////////////
	//Enemy Base Class Setup
	EnemeySetup();
	
	 ////////////////////
	//Creates first Map
	GenerateMap();
	
	//Set Game Loop and Start Game
	setInterval( Main, SecodsBetweenFrames * 1000 );
}

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //Main//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Main()
{
    //Update Enemys and attacks
    Update();
        
    //Render Screen
    Render();
}

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //Input/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.onkeydown = function( e ) 
{
	if ( !e ) { e = window.event; }
    //W
    if( e.keyCode == 87 ){ Player.MoveNorth = true; }

    //A
    if( e.keyCode == 65 ){ Player.MoveWest = true; }
            
    //S
    if( e.keyCode == 83 ){ Player.MoveSouth = true; }	

     //D
     if( e.keyCode == 68 ){ Player.MoveEast = true; }
        
     //Space
     if( e.keyCode == 32 ){ Player.AttackState = true; }
}

document.onkeyup = function( e ) 
{
    if ( !e ) { e = window.event; }
    //W
    if( e.keyCode == 87 ){ Player.MoveNorth = false; }

    //A
    if( e.keyCode == 65 ){ Player.MoveWest = false; }
            
    //S
    if( e.keyCode == 83 ){ Player.MoveSouth = false; }	

    //D
    if( e.keyCode == 68 ){ Player.MoveEast = false; }
        
    //Space
    if( e.keyCode == 32 ){ Player.AttackState = false; }
}


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //Render////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Render()
{
	 //Renderer the screen in text
	//Clears the screen var
	TheScreen = "";
	
    //Renders the screen
    var Tmp;
    for( var X = 0; X < ScreenSizeX; X++ )
    {
        for( var Y = 0; Y < ScreenSizeY; Y++ )
        {  
            //Render Player
            if( ( Player.X == X ) && ( Player.Y == Y ) )
            {
                TheScreen += PlayerChar;
            }
            else
            {
                //Sets map to temp char
                Tmp = Level[X][Y];
                   
                //Check list for enemey at this coords and overwrites temp char if there is
                for( var i = 0; i < EnemeyList.length; i++ )
                {
                    if( ( EnemeyList[i].X == X ) && ( EnemeyList[i].Y == Y ) ){ Tmp = EnemeyList[i].Char; }
                }
                    
                //Check list for attack at this coords overwrites temp char if there is
                for( var i = 0; i < ProjectileList.length; i++ )
                {
                    if( ( ProjectileList[i].X == X ) && ( ProjectileList[i].Y == Y ) ){ Tmp = Attack; }
                }
                    
                //Write char to screen var
                TheScreen += Tmp;

            }
        }
        TheScreen += "</br>";
    }
        
    //Renders stats and score
    TheScreen += "</br>";
    TheScreen += ( "Health: " + Player.Health + "\\" + Player.MaxHealth + "    " );//Display health
    TheScreen += ( "Score: " + Player.Score + "    " );//Display Score
    TheScreen += "Weapon: ";                                   ///////////////////////////
    if( Player.Weapon == 1 ){ TheScreen += "Fists"; }         ///////////////////////////
    else if( Player.Weapon == 10 ){ TheScreen += "Sword"; }  //Display Players Weapon///
    else if( Player.Weapon == 7 ){ TheScreen += "Bow"; }    ///////////////////////////
    else if( Player.Weapon == 3 ){ TheScreen += "Staff"; } ///////////////////////////
    
	//Displays it to the html file
	document.getElementById( "thescreen" ).innerHTML = TheScreen.toString();
}

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //Update////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Update()
{
    //Update Player
    Player.Update();
    
    //Update Attacks
    for( var i = 0; i < ProjectileList.length; i++ )
    {
        //Check if anyone is hit
        if( !( ProjectileList[i].IsPlayers )  )//if not players projectile
        {
            //Hit player if in same location
            if
            ( 
                ( ProjectileList[i].X == Player.X ) && 
                ( ProjectileList[i].Y == Player.Y ) 
            )
            { 
                Player.TakeDamage( ProjectileList[i].Damage ); 
            }
        }
        else
        {
            for( var j = 0; j < EnemeyList.lenth; j++ )
            {
                if
                ( 
                    ( ProjectileList[i].X == EnemeyList[j].X ) && 
                    ( ProjectileList[i].Y == EnemeyList[j].Y ) 
                )
                {
                    EnemeyList[j].TakeDamage( ProjectileList[i].Damage );
                }
            }
        }

        //Update or clear projectiles     
        if( ProjectileList[i].Timer < 0.0 )//If timer over
        {
           ProjectileList.splice( i, 1 );//Remove item
        }
        else//Else update timer
        {
            ProjectileList[i].Update();
        }
    }
    
    //Update AI
    for( var i = 0; i < EnemeyList.lenth; i++ )
    {
       if( EnemeyList[i].Health < 0.0 )//if dead
       {
           EnemeyList.splice( i, 1 );//Remove
       }
       else//Else update timer
       {
           EnemeyList[i].Update();
       }
    }  
}

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //GenerateMap///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function GenerateMap()
{
	var AmmountOfObjects = Math.floor( ( Math.random() * 12 ) + 3 );
	var AmmountOfEnemeys = Math.floor( ( Math.random() * 12 ) + 3 );
	var Tmp;//Tmp storage
    var TmpX, TmpY;//Tmp storage
	
	//Make floor and walls
	for( var i = 0; i < ScreenSizeX ; i++ ) 
	{
		Level[i] = [];
		for( var j = 0; j < ScreenSizeY ; j++ )
		{
			if
            ( 
                ( i == 0 ) || ( i == ( ScreenSizeX - 1 ) ) || 
                ( j == 0 ) || ( j == ( ScreenSizeY - 1 ) ) 
            )
            { 
                Level[i][j] = Wall; 
            }
			else{ Level[i][j] = Floor; }
		}
	}
	
	//add drops and doors
	while( AmmountOfObjects > 0 )
	{
        Tmp  = Math.floor( ( Math.random() * 40 ) + 1 );//Money has large chance, Potion has some chance and everything else has a chance value of 1
        TmpX = Math.floor( ( Math.random() * ( ScreenSizeX - 2 ) ) + 1 );
        TmpY = Math.floor( ( Math.random() * ( ScreenSizeY - 2 ) ) + 1 );

		if( Tmp > 7 )//Money
		{
			if( Level[TmpX][TmpY] == Floor )
            {
                Level[TmpX][TmpY] = Money;
                AmmountOfObjects--;
            }
		}
		else if( Tmp == 1 )//Sword
		{
			if( Level[TmpX][TmpY] == Floor )
            {
                Level[TmpX][TmpY] = Sword;
                AmmountOfObjects--;
            }
		}
		else if( Tmp == 2 )//Bow
		{
			if( Level[TmpX][TmpY] == Floor )
            {
                Level[TmpX][TmpY] = Bow;
                AmmountOfObjects--;
            }
		}
		else if( Tmp == 3 )//Staff
		{
			if( Level[TmpX][TmpY] == Floor )
            {
                Level[TmpX][TmpY] = Staff;
                AmmountOfObjects--;
            }
		}
		
		else if( Tmp == 4 )//Helm
		{
			if( Level[TmpX][TmpY] == Floor )
            {
                Level[TmpX][TmpY] = Helm;
                AmmountOfObjects--;
            }
		}
		else if( Tmp == 5 )//Armor
		{
			if( Level[TmpX][TmpY] == Floor )
            {
                Level[TmpX][TmpY] = Armor;
                AmmountOfObjects--;
            }
		}
		else if( Tmp == 6 )//Shield
		{
			if( Level[TmpX][TmpY] == Floor )
            {
                Level[TmpX][TmpY] = Sheild;
                AmmountOfObjects--;
            }
		}
        else if( ( Tmp > 6 ) && ( Tmp < 13 ) )//Potion
		{
			if( Level[TmpX][TmpY] == Floor )
            {
                Level[TmpX][TmpY] = Potion;
                AmmountOfObjects--;
            }
		}
	}
	
	//Add Enemeys
	while( AmmountOfEnemeys > 0 )
	{
        Tmp = Math.floor( ( Math.random() * 2 ) + 1 );//1 melee, 2 ranged

        //Enemy Setup
        var Char;
        if( Tmp == 1 ){ Char = MeleeEnemy; }
        else{ Char = RangedEnemy; }
        
        //Create Enemey, Push onto the list and decrement count
        EnemeyList.push( EnemeySetup( 10, 10, Char ) );
		AmmountOfEnemeys--;
        
	}
}

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //Player////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function PlayerSetup()
{
	 ////////////////////
	//Player Class Setup
	Player = new Object();
	
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 //Stats///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	Player.Health = 50;
	Player.MaxHealth = 50;
	Player.Armor = [ false, false, false ]; //No Armor( Head, Body, Sheild ), increases max health by 10 with body 30
	Player.Weapon = 1; //1 = Fists, 10 = sword, 7 = bow, staff = 3   //Reuses value for attack damage  
	Player.AttackCooldown = 0; //Players attack cooldown
    Player.MoveCooldown = 0; //Players Move cooldown
    Player.HitCooldown = 0;//Hit cooldown, so player doesnt die very quickly
	Player.FacingDirection = 0;//0 = North, 1 = East, 2 = South, 3 = West 
    Player.Score = 0;
    
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 //Input///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	Player.MoveNorth = false;
    Player.MoveSouth = false;
    Player.MoveEast = false;
    Player.MoveWest = false;
    Player.AttackState = false;
	
	   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	  //Position///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//Sets in the Center
	Player.X = ( ScreenSizeX / 2 );
	Player.Y = ( ScreenSizeY / 2 );
	
       //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	  //Functions///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
       ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //Player Attack/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//Players attack, based on what weapon they have
	Player.Attack = function()
	{
		if( !( Player.AttackCooldown > 0 ) )//1 = Fists, 10 = sword, 7 = bow, staff = 3   //Reuses value for attack damage
		{
            //North
		    if( Player.FacingDirection == 0 )
		    {
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
                //Fists////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 1 )
                { 
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 1 ), ( Player.Y ), true, 0  ) ); 
                    Player.AttackCooldown = 0.3; 
                } 
                
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
                //Sword////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 10 )
                { 
                    //Layer 1
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 1 ), ( Player.Y ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 1 ), ( Player.Y + 1 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 1 ), ( Player.Y - 1 ), true, 0 ) ); 
                    
                    //Layer 2
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 2 ), ( Player.Y ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 2 ), ( Player.Y + 1 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 2 ), ( Player.Y - 1 ), true, 0 ) ); 
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 2 ), ( Player.Y + 2 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 2 ), ( Player.Y - 2 ), true, 0 ) ); 
                    
                    Player.AttackCooldown = 0.3; 
                } 
                
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
                //Staff////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 3 )
                { 
                    for( var i = 1; i < 11; i++ )
                    {
                       ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - i ), ( Player.Y ), true, 0 ) ); 
                    }

                    Player.AttackCooldown = 0.5; 
                } 
                
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
                //Bow//////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 7 )
                { 
                    ProjectileList.push( ProjectileSetup( 0.5, Player.Weapon, ( Player.X - 1 ), ( Player.Y ), true, 0 ) ); 
                    Player.AttackCooldown = 0.25; 
                }
		    }
		
            //South
		    else if( Player.FacingDirection == 2 )
		    {
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
			    //Fists////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 1 )
                { 
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 1 ), ( Player.Y ), true, 0 ) );
                    Player.AttackCooldown = 0.3; 
                } 
                
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
                //Sword////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 10 )
                { 
                    //Layer 1
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 1 ), ( Player.Y ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 1 ), ( Player.Y + 1 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 1 ), ( Player.Y - 1 ), true, 0 ) ); 
                    
                    //Layer 2
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 2 ), ( Player.Y ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 2 ), ( Player.Y + 1 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 2 ), ( Player.Y - 1 ), true, 0 ) ); 
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 2 ), ( Player.Y + 2 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 2 ), ( Player.Y - 2 ), true, 0 ) ); 
                    
                    Player.AttackCooldown = 0.3; 
                } 
                
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
                //Staff////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 3 )
                { 
                    for( var i = 1; i < 11; i++ )
                    {
                       ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + i ), ( Player.Y ), true, 0 ) ); 
                    }

                    Player.AttackCooldown = 0.5; 
                } 
                
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
                //Bow//////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 7 )
                { 
                    ProjectileList.push( ProjectileSetup( 0.5, Player.Weapon, ( Player.X + 1 ), ( Player.Y ), true, 2 ) ); 
                    Player.AttackCooldown = 0.25; 
                }
		    }	
		
            //West
		    else if( Player.FacingDirection == 3 )
		    { 
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
			    //Fists////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 1 )
                { 
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X ), ( Player.Y - 1 ), true, 0 ) );
                    Player.AttackCooldown = 0.3; 
                } 
                
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
                //Sword////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 10 )
                { 
                    //Layer 1
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X ), ( Player.Y - 1 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 1 ), ( Player.Y - 1 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 1 ), ( Player.Y - 1 ), true, 0 ) ); 
                    
                    //Layer 2
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X ), ( Player.Y - 2 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 1 ), ( Player.Y - 2 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 1 ), ( Player.Y - 2 ), true, 0 ) ); 
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 2 ), ( Player.Y - 2 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 2 ), ( Player.Y - 2 ), true, 0 ) ); 
                    
                    Player.AttackCooldown = 0.3; 
                } 
                
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
                //Staff////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 3 )
                { 
                    for( var i = 1; i < 11; i++ )
                    {
                       ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X ), ( Player.Y - i ), true, 0 ) ); 
                    }

                    Player.AttackCooldown = 0.5; 
                } 
                
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
                //Bow//////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 7 )
                { 
                    ProjectileList.push( ProjectileSetup( 0.5, Player.Weapon, ( Player.X ), ( Player.Y - 1 ), true, 3 ) ); 
                    Player.AttackCooldown = 0.25; 
                }
		    }
		
            //East
		    else if( Player.FacingDirection == 1 )
		    {
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
				//Fists////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 1 )
                { 
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X ), ( Player.Y + 1 ), true, 0 ) );
                    Player.AttackCooldown = 0.3;
                } 
                
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
                //Sword////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 10 )
                { 
                    //Layer 1
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X ), ( Player.Y + 1 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 1 ), ( Player.Y + 1 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 1 ), ( Player.Y + 1 ), true, 0 ) ); 
                    
                    //Layer 2
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X ), ( Player.Y + 2 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 1 ), ( Player.Y + 2 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 1 ), ( Player.Y + 2 ), true, 0 ) ); 
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X + 2 ), ( Player.Y + 2 ), true, 0 ) );
                    ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X - 2 ), ( Player.Y + 2 ), true, 0 ) ); 
                    
                    Player.AttackCooldown = 0.3; 
                } 
                
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
                //Staff////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 3 )
                { 
                    for( var i = 1; i < 11; i++ )
                    {
                       ProjectileList.push( ProjectileSetup( 0.15, Player.Weapon, ( Player.X ), ( Player.Y + i ), true, 0 ) ); 
                    }

                    Player.AttackCooldown = 0.5; 
                } 
                
                 ///////////////////////////////////////////////////////////////////////////////////////////////////////
                //Bow//////////////////////////////////////////////////////////////////////////////////////////////////
			    if( Player.Weapon == 7 )
                { 
                    ProjectileList.push( ProjectileSetup( 0.5, Player.Weapon, ( Player.X ), ( Player.Y + 1 ), true, 1 ) ); 
                    Player.AttackCooldown = 0.25; 
                }
		    }
		}
	};
	
       ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //Player TakeDamage/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//Called when a hit occurs
	Player.TakeDamage = function( DamagePoints )
	{
		Player.Health -= DamagePoints;
        Player.HitCooldown = 1.0;
		if( Player.Health < 1 )
		{
            
		}
	};
	
       ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //Player PickUp/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//Called when player walks over an object
	Player.PickUp = function()
	{
        if( !( Level[Player.X][Player.Y] == Floor ) )//Ignore if floor
        {
            if( Level[Player.X][Player.Y] == Money )
            {
                Level[Player.X][Player.Y] = Floor;
                Player.Score += 10;
            }
            else if( Level[Player.X][Player.Y] == Door )
            {
                //ToDo/////////////////////////////////////////////////////////////////////////////////////////////    ToDo
            }
            else if( Level[Player.X][Player.Y] == Sword )//Sword
            {
                if( Player.Weapon == 10 )
                {
                    Player.Score += 50;
                    Level[Player.X][Player.Y] = Floor; 
                }
                else
                {
                    Player.Weapon = 10;
                    Level[Player.X][Player.Y] = Floor;
                }
            }
            else if( Level[Player.X][Player.Y] == Bow )//Bow
            {
                if( Player.Weapon == 7 )
                {
                    Player.Score += 50;
                    Level[Player.X][Player.Y] = Floor; 
                }
                else
                {
                    Player.Weapon = 7;
                    Level[Player.X][Player.Y] = Floor;
                }
            }
            else if( Level[Player.X][Player.Y] == Staff )//Staff
            {
                if( Player.Weapon == 3 )
                {
                    Player.Score += 50;
                    Level[Player.X][Player.Y] = Floor; 
                }
                else
                {
                    Player.Weapon = 3;
                    Level[Player.X][Player.Y] = Floor;
                }
            }
            else if( Level[Player.X][Player.Y] == Helm )//Helm
            {
                if( Player.Armor[0] )
                {
                    Player.Score += 50;
                    Level[Player.X][Player.Y] = Floor; 
                }
                else
                {
                    Player.Armor[0] = true;
                    Player.MaxHealth += 25;
                    Player.Health += 25;
                    Level[Player.X][Player.Y] = Floor;
                }
            }
            else if( Level[Player.X][Player.Y] == Armor )//Armor
            {
                if( Player.Armor[1] )
                {
                    Player.Score += 50;
                    Level[Player.X][Player.Y] = Floor; 
                }
                else
                {
                    Player.Armor[1] = true;
                    Player.MaxHealth += 50;
                    Player.Health += 50;
                    Level[Player.X][Player.Y] = Floor;
                }
            }
            else if( Level[Player.X][Player.Y] == Sheild )//Sheild
            {
                if( Player.Armor[2] )
                {
                    Player.Score += 50;
                    Level[Player.X][Player.Y] = Floor; 
                }
                else
                {
                    Player.Armor[2] = true;
                    Player.MaxHealth += 25;
                    Player.Health += 25;
                    Level[Player.X][Player.Y] = Floor;
                }
            }
            else if( Level[Player.X][Player.Y] == Potion )//Potion
            {
                //Drain potion to health or score if health is full
                for( var Health = 25; Health > 0; Health-- )
                {
                    if( Player.Health == Player.MaxHealth ){ Player.Score++; }
                    else{ Player.Health++; }
                }
                Level[Player.X][Player.Y] = Floor;
            }
        }
	};
	
       ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //Player Move///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//Moves player and checks for edge walls
	Player.Move = function( Direction )
	{
        if( !( Player.MoveCooldown > 0.0 ) )
        {
            Player.MoveCooldown = 0.1;
            
            //Change players facing direction
            Player.FacingDirection = Direction;
            
            //North
            if( Direction == 0 )
            {
                if( Player.X > 1 )//Check for edge
                {
                    if( !( CheckForEnemey( ( Player.X - 1 ), ( Player.Y ) ) ) ){ Player.X--; }//Check for Enemey Colision if not, move
                }
            }
            //South
            else if( Direction == 2 )
            {
                if( Player.X < ( ScreenSizeX - 2 ) )//Check for edge
                {
                    if( !( CheckForEnemey( ( Player.X + 1 ), ( Player.Y ) ) ) ){ Player.X++; }//Check for Enemey Colision if not, move
                }
            }	
            //West
            else if( Direction == 3 )
            { 
                if( ( Player.Y > 1 ) )//Check for edge
                {
                    if( !( CheckForEnemey( ( Player.X ), ( Player.Y - 1 ) ) ) ){ Player.Y--; }//Check for Enemey Colision if not, move
                }
                
            }
            //East
            else if( Direction == 1 )
            {
                    if( Player.Y < ( ScreenSizeY - 2 ) )//Check for edge
                    {
                        if( !( CheckForEnemey( ( Player.X ), ( Player.Y + 1 ) ) ) ){ Player.Y++; }//Check for Enemey Colision if not, move
                    }
            }
            
            Player.PickUp();//Check if there is a object under player
        }
	};
    
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     //Player Update/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Player.Update = function()
	{
        //Decroment cooldown by fps
        if( Player.AttackCooldown > 0.0 ){ Player.AttackCooldown -= SecodsBetweenFrames; }
        
        if( Player.MoveCooldown > 0.0 ){ Player.MoveCooldown -= SecodsBetweenFrames; }
        
        if( Player.HitCooldown > 0.0 ){ Player.HitCooldown -= SecodsBetweenFrames; }
        
        //Input
        if( Player.AttackState ){ Player.Attack(); }
        else if( Player.MoveNorth ){ Player.Move( 0 ); }
        else if( Player.MoveSouth ){ Player.Move( 2 ); }
        else if( Player.MoveEast ){ Player.Move( 1 ); } 
        else if( Player.MoveWest ){ Player.Move( 3 ); }
    }
}

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //Enemey////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function EnemeySetup( Health, AttackPower, Char )
{
     /////////////////////////
	//Enemey Base Class Setup
	var Enemey = new Object();
    
       //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	  //Stats///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Default Values
    
    Enemey.Health = Health;
    Enemey.AttackPower = AttackPower;
    Enemey.Char = Char;
    Enemey.X = Math.floor( ( Math.random() * ( ScreenSizeX - 2 ) ) + 1 );
    Enemey.Y = Math.floor( ( Math.random() * ( ScreenSizeY - 2 ) ) + 1 );
    Enemey.DamageDelay = 0;
    Enemey.MoveDelay = 0;
    Enemey.AttackDelay = 0;
    
    
       //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	  //Functions///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
       ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //Enemey Update/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Called every frame to update the Enemey
	Enemey.Update = function()
	{
        //ToDo: ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ToDo
        Enemey.DamageDelay -= SecodsBetweenFrames;
        //Update position and decriment timers
            //if timer is less than 0.01
                //Check if player is near and if so aproch and attack
               
    }
    
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     //Enemey Update/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Enemey.TakeDamage = function( Damage )
    {
        if( Enemey.DamageDelay < 0.0 )
        {
            Enemey.Health -= Damage;
            Enemey.DamageDelay = 1.0;
        }
    }
    
    //Return Enemey to store in list
    return Enemey;
}

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //Projectile////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ProjectileSetup( Timer, Damage, X, Y, IsPlayers, Direction )
{
     //////////////////////////////
	//Projectile Base Class Setup
	var Projectile = new Object();
    
       //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	  //Stats///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Default Values
    Projectile.Timer = Timer;
    Projectile.Damage = Damage;//Damage and ID
    Projectile.X = X;
    Projectile.Y = Y;
    Projectile.IsPlayers = IsPlayers; 
    Projectile.Direction = Direction;//For bow
    
    
       //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	  //Functions///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
       ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //Projectile Update/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Called every frame to update the Projectile
	Projectile.Update = function()
	{
        if( Projectile.Damage == 7 )//0 = North, 1 = East, 2 = South, 3 = West 
        {
            if( Projectile.Direction == 0 )//North
            {
                Projectile.X--;
            }
            else if( Projectile.Direction == 2 )//South
            {
                Projectile.X++;
            }
            else if( Projectile.Direction == 1 )//East
            {
                Projectile.Y++;
            }
            else if( Projectile.Direction == 3 )//West
            {
                Projectile.Y--;
            }
        }
        Projectile.Timer -= SecodsBetweenFrames;     
    }
    
    //Return Projectile to store in list
    return Projectile;
}

//Check if ther is a enemey for colision and return true if so
function CheckForEnemey( X, Y )
{
    for( var i = 0; i < EnemeyList.length; i++ )
    {
        if( ( EnemeyList[i].X == X ) && ( EnemeyList[i].Y == Y ) ){ return true; }
    }
    return false;
}