(function(global) {
    'use strict';

    const artists = {
            prem: {
                name: "Prem Dhillon",
                image: "images/prem.jpeg",
                songs: [{
                    title: "Shoes Off",
                    file: "Prem Dhillon/ShoesOff.mp3",
                    poster: "images/ShoesOff.jpeg"
                }, {
                    title: "Putt Jam Te Lau",
                    file: "Prem Dhillon/Putt Jam Te Lau.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "London",
                    file: "Prem Dhillon/London.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "Map",
                    file: "Prem Dhillon/Map.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "Made For This Shi",
                    file: "Prem Dhillon/Made For This Shi.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "UNDERCOVER",
                    file: "Prem Dhillon/UNDERCOVER.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "NOTHIN",
                    file: "Prem Dhillon/Nothin.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "GT",
                    file: "Prem Dhillon/GT.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "DEALER",
                    file: "Prem Dhillon/Dealer.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "GD UP",
                    file: "Prem Dhillon/GD UP.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "Wannabes",
                    file: "Prem Dhillon/Wannabes.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "Get At Me",
                    file: "Prem Dhillon/Get At Me.mp3",
                    poster: "images/Get At Me.jpeg"
                }, {
                    title: "Bootcut",
                    file: "Prem Dhillon/Boot cut.mp3",
                    poster: "images/bootcut.jpeg"

                }, {
                    title: "3am In Gillco",
                    file: "Prem Dhillon/3am In Gillco.mp3",
                    poster: "images/3am In Gillco.jpeg"
                }, {
                    title: "Lying Anyway",
                    file: "Prem Dhillon/Lying Anyway.mp3",
                    poster: "images/Lying Anyway.jpeg"
                }, {
                    title: "By MoonLight",
                    file: "Prem Dhillon/By Moonlight.mp3",
                    poster: "images/Lying Anyway.jpeg"
                }, {
                    title: "Blackberry Sap",
                    file: "Prem Dhillon/Blackberry Sap.mp3",
                    poster: "images/neveragain.jpeg"
                }, {
                    title: "Nah They Can'nt",
                    file: "Prem Dhillon/Nah They Cant.mp3",
                    poster: "images/neveragain.jpeg"
                }, {
                    title: "No Soul There",
                    file: "Prem Dhillon/No Soul There.mp3",
                    poster: "images/moveon.jpeg"
                }, {
                    title: "Move On",
                    file: "Prem Dhillon/Move On.mp3",
                    poster: "images/moveon.jpeg"
                }, {
                    title: "Those Dayz",
                    file: "Prem Dhillon/Those Dayz.mp3",
                    poster: "images/flowersaints.jpeg"
                }, {
                    title: "Flower & Saints",
                    file: "Prem Dhillon/Flowersaints.mp3",
                    poster: "images/flowersaints.jpeg"
                }, {
                    title: "Never Again",
                    file: "Prem Dhillon/Never Again.mp3",
                    poster: "images/neveragain.jpeg"
                }, {
                    title: "U Dnt Even Knw",
                    file: "Prem Dhillon/U Dnt Even Knw.mp3",
                    poster: "images/udntevenknw.jpeg"
                }, {
                    title: "Badmashi",
                    file: "Prem Dhillon/Badmashi.mp3",
                    poster: "images/badmashi.jpeg"
                }, {
                    title: "Can't Be Us",
                    file: "Prem Dhillon/Cant Be Us.mp3",
                    poster: "images/Cant Be Us.jpeg"
                }, {
                    title: "ASTARR",
                    file: "Prem Dhillon/ASTARR.mp3",
                    poster: "images/ASTARR.jpeg"
                }, {
                    title: "Damn Daddy",
                    file: "Prem Dhillon/Damn Daddy.mp3",
                    poster: "images/Damn Daddy.jpeg"
                }, {
                    title: "RUBICON",
                    file: "Prem Dhillon/RUBICON.mp3",
                    poster: "images/RUBICON.jpeg"
                }, {
                    title: "BADBOY",
                    file: "Prem Dhillon/BADBOY.mp3",
                    poster: "images/ASTARR.jpeg"
                }, {
                    title: "TOP DAWG",
                    file: "Prem Dhillon/TOP DAWG.mp3",
                    poster: "images/ASTARR.jpeg"
                }, {
                    title: "Busy Doin Nothin",
                    file: "Prem Dhillon/Busy Doin Nothin.mp3",
                    poster: "images/Busy Doin Nothin.jpeg"
                }, {
                    title: "Still Mine",
                    file: "Prem Dhillon/Still Mine.mp3",
                    poster: "images/Still Mine.jpeg"
                }, {
                    title: "Silicone",
                    file: "Prem Dhillon/Silicone.mp3",
                    poster: "images/Silicone.jpeg"
                }, {
                    title: "Old Skool",
                    file: "Prem Dhillon/Old Skool.mp3",
                    poster: "images/Old Skool.jpeg"
                }, {
                    title: "Majha Block",
                    file: "Prem Dhillon/Majha Block.mp3",
                    poster: "images/Majha Block.jpeg"
                }, {
                    title: "TYPE SHII",
                    file: "Prem Dhillon/TYPE SHII.mp3",
                    poster: "images/ASTARR.jpeg"
                }, {
                    title: "Wake Up Call",
                    file: "Prem Dhillon/Wake Up Call.mp3",
                    poster: "images/Wake Up Call.jpeg"
                }, {
                    title: "Back Of Car",
                    file: "Prem Dhillon/Back Of Car.mp3",
                    poster: "images/Back Of Car.jpeg"
                }, {
                    title: "26 Blvd",
                    file: "Prem Dhillon/26 Blvd.mp3",
                    poster: "images/neveragain.jpeg"
                }, {
                    title: "All Ace",
                    file: "Prem Dhillon/All Ace.mp3",
                    poster: "images/allace.jpeg"
                }]
            },
            sidhu: {
                name: "Sidhu Moosewala",
                image: "images/sidhu.jpeg",
                songs: [{
                    title: "Eyes On Me",
                    file: "Sidhu Moosewala/Eyes On Me.mp3",
                    poster: "images/Eyes On Me.jpeg"
                },{
                    title: "The Last Ride",
                    file: "Sidhu Moosewala/The Last Ride.mp3",
                    poster: "images/ride.jpeg"
                },{
                    title: "Game",
                    file: "Sidhu Moosewala/Game.mp3",
                    poster: "images/game.jpeg"
                },{
                    title: "0008",
                    file: "Sidhu Moosewala/0008.mp3",
                    poster: "images/0008.jpeg"
                },{
                    title: "Take Notes",
                    file: "Sidhu Moosewala/Take Notes.mp3",
                    poster: "images/0008.jpeg"
                },{
                    title: "Neal",
                    file: "Sidhu Moosewala/Neal.mp3",
                    poster: "images/0008.jpeg"
                },{
                    title: "Same Beef",
                    file: "Sidhu Moosewala/Same Beef.mp3",
                    poster: "images/samebeef.jpeg"
                },{
                    title: "Warning Shots",
                    file: "Sidhu Moosewala/Warning Shots.mp3",
                    poster: "images/shot.jpeg"
                },{
                    title: "Flop Song",
                    file: "Sidhu Moosewala/Flop Song.mp3",
                    poster: "images/Flop.jpeg"
                }, {
                    title: "Levels",
                    file: "Sidhu Moosewala/Levels.mp3",
                    poster: "images/levels.jpeg"
                }, {
                    title: "Legend",
                    file: "Sidhu Moosewala/Legend.mp3",
                    poster: "images/legend.jpeg"
                }, {
                    title: "Mafia",
                    file: "Sidhu Moosewala/Mafia.mp3",
                    poster: "images/mafia.jpeg"
                }, {
                    title: "Just Listen",
                    file: "Sidhu Moosewala/Just Listen.mp3",
                    poster: "images/Just Listen.jpeg"
                }, {
                    title: "Jaat Da Muqabala",
                    file: "Sidhu Moosewala/Jaat Da Muqabala.mp3",
                    poster: "images/pbx1.jpeg"
                }, {
                    title: "410",
                    file: "Sidhu Moosewala/410.mp3",
                    poster: "images/410.jpeg"
                }, {
                    title: "Barota",
                    file: "Sidhu Moosewala/Barota.mp3",
                    poster: "images/Barota.jpeg"
                }, {
                    title: "SCAPEGOAT",
                    file: "Sidhu Moosewala/Scapegoat.mp3",
                    poster: "images/scapegoat.jpeg"
                }, {
                    title: "Never fold",
                    file: "Sidhu Moosewala/Neverfold.mp3",
                    poster: "images/Neverfold.jpeg"
                }, {
                    title: "Signed To God",
                    file: "Sidhu Moosewala/Signed To God.mp3",
                    poster: "images/Signed To God.jpeg"
                }, {
                    title: "Love sick",
                    file: "Sidhu Moosewala/Love sick.mp3",
                    poster: "images/Neverfold.jpeg"
                }, {
                    title: "Attach",
                    file: "Sidhu Moosewala/Attach.mp3",
                    poster: "images/Attach.jpeg"
                }, {
                    title: "Lock",
                    file: "Sidhu Moosewala/Lock.mp3",
                    poster: "images/Lock.jpeg"
                }, {
                    title: "Watch Out",
                    file: "Sidhu Moosewala/Watch Out.mp3",
                    poster: "images/Watch Out.jpeg"
                }, {
                    title: "Wiseman",
                    file: "Sidhu Moosewala/Wiseman.mp3",
                    poster: "images/Wiseman.jpeg"
                }, {
                    title: "US",
                    file: "Sidhu Moosewala/US.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "UNFUCKWITHABLE",
                    file: "Sidhu Moosewala/Unfuckwithable.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "295",
                    file: "Sidhu Moosewala/295.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "ULTIMATUM",
                    file: "Sidhu Moosewala/Ultimatum.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "TRAIL DAY SKIT",
                    file: "Sidhu Moosewala/TrialDaySkit.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "THESE DAYS",
                    file: "Sidhu Moosewala/TheseDays.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "SIDHU SON",
                    file: "Sidhu Moosewala/SidhuSon.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "REGRET",
                    file: "Sidhu Moosewala/Regret.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "REAL ONE SKIT",
                    file: "Sidhu Moosewala/RealOneSkit.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "RACKS AND ROUNDS",
                    file: "Sidhu Moosewala/RacksAndRounds.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "POWER",
                    file: "Sidhu Moosewala/Power.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "PIND HOOD DAMN GOOD",
                    file: "Sidhu Moosewala/PindHoodDamnGood.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "MOSSEDRILLA",
                    file: "Sidhu Moosewala/MosseDrilla.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "ME AND MY GIRLFRIEND",
                    file: "Sidhu Moosewala/MeAndMyGirlfriend.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "MALWA BLOCK",
                    file: "Sidhu Moosewala/Malwa_Block.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "INVINICIBLE",
                    file: "Sidhu Moosewala/Invincible.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "IDGAF",
                    file: "Sidhu Moosewala/IDGAF.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "G SHIT",
                    file: "Sidhu Moosewala/GShit.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "FACTS SKIT",
                    file: "Sidhu Moosewala/FactsSkit.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "CHACHA HU SKIT",
                    file: "Sidhu Moosewala/ChachaHuuSkit.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "GOAT",
                    file: "Sidhu Moosewala/GOAT.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "CELEBRITY KILLER",
                    file: "Sidhu Moosewala/Celebrity Killer.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "CALABOOSE",
                    file: "Sidhu Moosewala/Calaboose.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "BURBERRY",
                    file: "Sidhu Moosewala/Burberry.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "BUILT DIFFERENT",
                    file: "Sidhu Moosewala/BuiltDifferent.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "BROWN SHORTIE",
                    file: "Sidhu Moosewala/BrownShortie.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "BOO CALL SKIT",
                    file: "Sidhu Moosewala/BooCallSkit.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "BITCH I'M BACK",
                    file: "Sidhu Moosewala/Bitch I M Back.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "B W",
                    file: "Sidhu Moosewala/B W.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "AROMA",
                    file: "Sidhu Moosewala/Aroma.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "AMLI TALK SKIT",
                    file: "Sidhu Moosewala/Amli Talk Skit.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }]
            },
            shubh: {
                name: "Shubh",
                image: "images/shubh.jpeg",
                songs: [{
                    title: "Ace",
                    file: "Shubh/Ace.mp3",
                    poster: "images/chapter4.jpeg"
                }, {

                    title: "Bounce",
                    file: "Shubh/Bounce.mp3",
                    poster: "images/chapter4.jpeg"
                }, {

                    title: "Moves",
                    file: "Shubh/Moves.mp3",
                    poster: "images/chapter4.jpeg"
                }, {

                    title: "Broken",
                    file: "Shubh/Broken.mp3",
                    poster: "images/chapter4.jpeg"
                }, {

                    title: "Sohniye",
                    file: "Shubh/Sohniye.mp3",
                    poster: "images/sohniye.jpeg"
                }, {
                    title: "We Rollin",
                    file: "Shubh/We Rollin.mp3",
                    poster: "images/We Rollin.jpeg"
                }, {
                    title: "Supreme",
                    file: "Shubh/Supreme.mp3",
                    poster: "images/Supreme.jpeg"
                }, {
                    title: "Balenci",
                    file: "Shubh/Balenci.mp3",
                    poster: "images/Balenci.jpeg"
                }, {
                    title: "Buckle Up",
                    file: "Shubh/Buckle Up.mp3",
                    poster: "images/Buckle Up.jpeg"
                }, {
                    title: "No Love",
                    file: "Shubh/No Love.mp3",
                    poster: "images/No Love.jpeg"
                }, {
                    title: "Aura",
                    file: "Shubh/Aura.mp3",
                    poster: "images/Aura.jpeg"
                }, {
                    title: "Baller",
                    file: "Shubh/Baller.mp3",
                    poster: "images/Baller.jpeg"
                }, {
                    title: "Bandana",
                    file: "Shubh/Bandana.mp3",
                    poster: "images/Bandana.jpeg"
                }, {
                    title: "Bars",
                    file: "Shubh/Bars.mp3",
                    poster: "images/Bars.jpeg"
                }, {
                    title: "Offshore",
                    file: "Shubh/Offshore.mp3",
                    poster: "images/Offshore.jpeg"
                }, {
                    title: "Still Rollin",
                    file: "Shubh/Still Rollin.mp3",
                    poster: "images/Still Rollin.jpeg"
                }, {
                    title: "OG",
                    file: "Shubh/OG.mp3",
                    poster: "images/OG.jpeg"
                }, {
                    title: "Be Mine",
                    file: "Shubh/Be Mine.mp3",
                    poster: "images/Be Mine.jpeg"
                }, {
                    title: "You and Me",
                    file: "Shubh/You and Me.mp3",
                    poster: "images/You and Me.jpeg"
                }, {
                    title: "King Shit",
                    file: "Shubh/King Shit.mp3",
                    poster: "images/King Shit.jpeg"
                }, {
                    title: "Her",
                    file: "Shubh/Her.mp3",
                    poster: "images/Her.jpeg"
                }, {
                    title: "Hood Anthem",
                    file: "Shubh/Hood Anthem.mp3",
                    poster: "images/Hood Anthem.jpeg"
                }, {
                    title: "Carti",
                    file: "Shubh/Carti.mp3",
                    poster: "images/Carti.jpeg"
                }, {
                    title: "Cheques",
                    file: "Shubh/Cheques.mp3",
                    poster: "images/Cheques.jpeg"
                }, {
                    title: "Dior",
                    file: "Shubh/Dior.mp3",
                    poster: "images/Dior.jpeg"
                }, {
                    title: "Fell For You",
                    file: "Shubh/Fell For You.mp3",
                    poster: "images/Fell For You.jpeg"
                }, {
                    title: "Ice",
                    file: "Shubh/Ice.mp3",
                    poster: "images/Ice.jpeg"
                }, {
                    title: "In Love",
                    file: "Shubh/In Love.mp3",
                    poster: "images/In Love.jpeg"
                }, {
                    title: "MVP",
                    file: "Shubh/MVP.mp3",
                    poster: "images/MVP.jpeg"
                }, {
                    title: "One Love",
                    file: "Shubh/One Love.mp3",
                    poster: "images/One Love.jpeg"
                }, {
                    title: "Reckless",
                    file: "Shubh/Reckless.mp3",
                    poster: "images/Reckless.jpeg"
                }, {
                    title: "Routine",
                    file: "Shubh/Routine.mp3",
                    poster: "images/Routine.jpeg"
                }, {
                    title: "Ruger",
                    file: "Shubh/Ruger.mp3",
                    poster: "images/Ruger.jpeg"
                }, {
                    title: "Top G",
                    file: "Shubh/Top G.mp3",
                    poster: "images/Top G.jpeg"
                }, {
                    title: "Ruthless",
                    file: "Shubh/Ruthless.mp3",
                    poster: "images/Ruthless.jpeg"
                }, {
                    title: "Safety Off",
                    file: "Shubh/Safety Off.mp3",
                    poster: "images/Safety Off.jpeg"
                }, {
                    title: "The Flow",
                    file: "Shubh/The Flow.mp3",
                    poster: "images/The Flow.jpeg"
                }, {
                    title: "Together",
                    file: "Shubh/Together.mp3",
                    poster: "images/Together.jpeg"
                }]
            },
            sukha: {
                name: "Sukha",
                image: "images/sukha.jpeg",
                songs: [{
                    title: "Attraction",
                    file: "Sukha/Attraction.mp3",
                    poster: "images/Attraction.jpeg"
                }, {
                    title: "8 Asle",
                    file: "Sukha/8 Asle.mp3",
                    poster: "images/8 Asle.jpeg"
                }, {
                    title: "Dil Dardeh",
                    file: "Sukha/Dil Dardeh.mp3",
                    poster: "images/Dil Dardeh.jpeg"
                }, {
                    title: "Armed",
                    file: "Sukha/ARMED.mp3",
                    poster: "images/8 Asle.jpeg"
                }, {
                    title: "Hey Luv",
                    file: "Sukha/Hey Luv.mp3",
                    poster: "images/sukha.jpeg"
                }, {
                    title: "Sangdi",
                    file: "Sukha/Sangdi.mp3",
                    poster: "images/Sangdi.jpeg"
                }]
            },
            navaan: {
                name: "Navaan Sandhu",
                image: "images/navaan.jpeg",
                songs: [{
                    title: "90's Typa Love",
                    file: "Navaan Sandhu/90s Typa Love.mp3",
                    poster: "images/90's Typa Love.jpeg"
                }, {
                    title: "Kath Lagda",
                    file: "Navaan Sandhu/Kath Lagda.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Hood Ambience",
                    file: "Navaan Sandhu/Hood Ambience.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "City Dreams",
                    file: "Navaan Sandhu/City Dreams.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Moodshift",
                    file: "Navaan Sandhu/Moodshift.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Naveezy Era",
                    file: "Navaan Sandhu/Naveezy Era.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Yaara ve yaara",
                    file: "Navaan Sandhu/Yaara ve yaara.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "She ain't easy",
                    file: "Navaan Sandhu/She Aint easy.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Star Girl",
                    file: "Navaan Sandhu/Star Girl.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Yaad",
                    file: "Navaan Sandhu/Yaad.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Kaare",
                    file: "Navaan Sandhu/Kaare.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Headliner",
                    file: "Navaan Sandhu/Headliner.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Bodyguard",
                    file: "Navaan Sandhu/Bodyguard.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Boozed Up",
                    file: "Navaan Sandhu/Boozed Up.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "My Prime",
                    file: "Navaan Sandhu/My Prime.mp3",
                    poster: "images/Naveezy.jpeg"
                }, {
                    title: "Rukh",
                    file: "Navaan Sandhu/Rukh.mp3",
                    poster: "images/Rukh.jpeg"
                }, {
                    title: "Rehan Deyan",
                    file: "Navaan Sandhu/Rehan Deyan.mp3",
                    poster: "images/Naveezy.jpeg"
                }, {
                    title: "Naveezy",
                    file: "Navaan Sandhu/Naveezy.mp3",
                    poster: "images/Naveezy.jpeg"
                }, {
                    title: "Dil Lagiyan",
                    file: "Navaan Sandhu/Dil Lagiyan.mp3",
                    poster: "images/Naveezy.jpeg"
                }, {
                    title: "Kach Wangu",
                    file: "Navaan Sandhu/Kach Wangu.mp3",
                    poster: "images/Naveezy.jpeg"
                }, {
                    title: "Jail",
                    file: "Navaan Sandhu/Jail.mp3",
                    poster: "images/Naveezy.jpeg"
                }, {
                    title: "Dinar",
                    file: "Navaan Sandhu/Dinar.mp3",
                    poster: "images/Naveezy.jpeg"
                }, {
                    title: "Sit Down Son",
                    file: "Navaan Sandhu/Sit Down Son.mp3",
                    poster: "images/Sit Down Son.jpeg"
                }, {
                    title: "Culture Clicks",
                    file: "Navaan Sandhu/Culture Clicks.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Dapper Dan",
                    file: "Navaan Sandhu/Dapper Dan.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Eyes On Us",
                    file: "Navaan Sandhu/Eyes On Us.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Levels N Graphs",
                    file: "Navaan Sandhu/Levels N Graphs.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Navior",
                    file: "Navaan Sandhu/Navior.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Racks On Racks",
                    file: "Navaan Sandhu/Racks On Racks.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Regret",
                    file: "Navaan Sandhu/Regret.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Sajda",
                    file: "Navaan Sandhu/Sajda.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Tabaah",
                    file: "Navaan Sandhu/Tabaah.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Deewane",
                    file: "Navaan Sandhu/Deewane.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Raah",
                    file: "Navaan Sandhu/Raah.mp3",
                    poster: "images/Raah.jpeg"
                }, {
                    title: "2 Asle",
                    file: "Navaan Sandhu/2 Asle.mp3",
                    poster: "images/2 Asle.jpeg"
                }, {
                    title: "24/7",
                    file: "Navaan Sandhu/241.mp3",
                    poster: "images/241.jpeg"
                }, {
                    title: "Black Life Original",
                    file: "Navaan Sandhu/Black Life Original.mp3",
                    poster: "images/Black Life Original.jpeg"
                }, {
                    title: "Black Life",
                    file: "Navaan Sandhu/Black Life.mp3",
                    poster: "images/Black Life.jpeg"
                }, {
                    title: "Do Asle",
                    file: "Navaan Sandhu/Do Asle.mp3",
                    poster: "images/Do Asle.jpeg"
                }, {
                    title: "Do Pal",
                    file: "Navaan Sandhu/Do Pal.mp3",
                    poster: "images/Do Pal.jpeg"
                }, {
                    title: "Hanji Hanji",
                    file: "Navaan Sandhu/Hanji Hanji.mp3",
                    poster: "images/Hanji Hanji.jpeg"
                }, {
                    title: "Hero",
                    file: "Navaan Sandhu/Hero.mp3",
                    poster: "images/Hero.jpeg"
                }, {
                    title: "Hirni",
                    file: "Navaan Sandhu/Hirni.mp3",
                    poster: "images/Hirni.jpeg"
                }, {
                    title: "In Demand",
                    file: "Navaan Sandhu/In Demand.mp3",
                    poster: "images/In Demand.jpeg"
                }, {
                    title: "Majha Forever",
                    file: "Navaan Sandhu/Majha Forever.mp3",
                    poster: "images/Majha Forever.jpeg"
                }, {
                    title: "Mann Di Nahi",
                    file: "Navaan Sandhu/Mann Di Nahi.mp3",
                    poster: "images/Mann Di Nahi.jpeg"
                }, {
                    title: "NO MIDMAN",
                    file: "Navaan Sandhu/NO MIDMAN.mp3",
                    poster: "images/NO MIDMAN.jpeg"
                }, {
                    title: "Picture Perfect",
                    file: "Navaan Sandhu/Picture Perfect.mp3",
                    poster: "images/Picture Perfect.jpeg"
                }, {
                    title: "Plug Talk",
                    file: "Navaan Sandhu/Plug Talk.mp3",
                    poster: "images/Plug Talk.jpeg"
                }, {
                    title: "Sandhu Takeover",
                    file: "Navaan Sandhu/Sandhu Takeover.mp3",
                    poster: "images/Sandhu Takeover.jpeg"
                }, {
                    title: "Sherni Banke",
                    file: "Navaan Sandhu/Sherni Banke.mp3",
                    poster: "images/Sherni Banke.jpeg"
                }, {
                    title: "Sick Tone",
                    file: "Navaan Sandhu/Sick Tone.mp3",
                    poster: "images/Sick Tone.jpeg"
                }, {
                    title: "So Mean",
                    file: "Navaan Sandhu/So Mean.mp3",
                    poster: "images/So Mean.jpeg"
                }, {
                    title: "Unbothered",
                    file: "Navaan Sandhu/Unbothered.mp3",
                    poster: "images/Unbothered.jpeg"
                }, {
                    title: "Taaz",
                    file: "Navaan Sandhu/Taaz.mp3",
                    poster: "images/Taaz.jpeg"
                }, {
                    title: "Waare Waare",
                    file: "Navaan Sandhu/Waare Waare.mp3",
                    poster: "images/Waare Waare.jpeg"
                }, {
                    title: "Ziddi Generation",
                    file: "Navaan Sandhu/Ziddi Generation.mp3",
                    poster: "images/Ziddi Generation.jpeg"
                }, {
                    title: "Ziddi Generation (Alt)",
                    file: "Navaan Sandhu/Ziddi_Generation.mp3",
                    poster: "images/Zidddi Generation.jpeg"
                }]
            },
            cheema: {
                name: "Cheema Y",
                image: "images/cheema.jpeg",
                songs: [{
                    title: "Cartel",
                    file: "Cheema Y/Cartel.mp3",
                    poster: "images/bermuda.jpeg"
                }, {
                    title: "CEO",
                    file: "Cheema Y/CEO.mp3",
                    poster: "images/bermuda.jpeg"
                }, {
                    title: "Jackpot",
                    file: "Cheema Y/Jackpot.mp3",
                    poster: "images/bermuda.jpeg"
                }, {
                    title: "Komagata Maru",
                    file: "Cheema Y/Komagata Maru.mp3",
                    poster: "images/bermuda.jpeg"
                }, {
                    title: "Love Salary",
                    file: "Cheema Y/Love Salary.mp3",
                    poster: "images/bermuda.jpeg"
                }, {
                    title: "Money 2X",
                    file: "Cheema Y/Money 2X.mp3",
                    poster: "images/bermuda.jpeg"
                },{
                    title: "Rebel",
                    file: "Cheema Y/Rebel.mp3",
                    poster: "images/bermuda.jpeg"
                },{
                    title: "Shady",
                    file: "Cheema Y/Shady.mp3",
                    poster: "images/bermuda.jpeg"
                }]
            },
            bilall: {
                name: "Bilal Saeed",
                image: "images/bilal.jpeg",
                songs: [{
                    title: "12 Saal",
                    file: "Bilal Saeed/12 Saal.mp3",
                    poster: "images/12.jpeg"
                }, {
                    title: "Adhi Adhi Raat",
                    file: "Bilal Saeed/Adhi Adhi Raat.mp3",
                    poster: "images/12.jpeg"
                }]
            },
            deep: {
                name: "Deep Dhaliwal",
                image: "images/deep.jpeg",
                songs: [{
                    title: "Hypnotic",
                    file: "Deep Dhaliwal/Hypnotic.mp3",
                    poster: "images/Hypnotic.jpeg"
                }, {
                    title: "Na Na",
                    file: "Deep Dhaliwal/Na NA.mp3",
                    poster: "images/nana.jpeg"
                }]
            },
            jind: {
                name: "Jind Universe",
                image: "images/jinduniverse.jpeg",
                songs: [{
                    title: "High On You",
                    file: "Jind Universe/High On You.mp3",
                    poster: "images/highonu.jpeg"
                }, {
                    title: "Love Exit",
                    file: "Jind Universe/Love Exit.mp3",
                    poster: "images/loveexit.jpeg"
                }, {
                    title: "I Know Love",
                    file: "Jind Universe/I Know Love.mp3",
                    poster: "images/iknowlove.jpeg"
                }]
            },
            talwinder: {
                name: "Talwinder",
                image: "images/talwinder.jpeg",
                songs: [{
                    title: "Pal Pal",
                    file: "Talwinder/Pal Pal.mp3",
                    poster: "images/palpal.jpeg"
                }, {
                    title: "To The Moon",
                    file: "Talwinder/To The Moon.mp3",
                    poster: "images/tothemoon.jpeg"
                }, {
                    title: "Wishes",
                    file: "Talwinder/Wishes.mp3",
                    poster: "images/wishes.jpeg"
                }, {
                    title: "Haseen",
                    file: "Talwinder/Haseen.mp3",
                    poster: "images/haseen.jpeg"
                }, {
                    title: "Jhol",
                    file: "Talwinder/Jhol.mp3",
                    poster: "images/Jhol.jpeg"
                }, {
                    title: "Dhundhala",
                    file: "Talwinder/Dhundhala.mp3",
                    poster: "images/Dhundhala.jpeg"
                }, {
                    title: "Khayaal",
                    file: "Talwinder/Khayaal.mp3",
                    poster: "images/Khayaal.jpeg"
                },{
                    title: "Sajna Da Dil Torya",
                    file: "Talwinder/Sajna.mp3",
                    poster: "images/sajna.jpeg"
                }]
            },
            amrindergill: {
                name: "Amrinder Gill",
                image: "images/amrindergill.jpeg",
                songs: [{
                    title: "Adore",
                    file: "Amrinder Gill/Adore.mp3",
                    poster: "images/adorre.jpeg"
                }, {
                    title: "Asi Gabhru Punjabi",
                    file: "Amrinder Gill/Asi Gabhru Punjabi.mp3",
                    poster: "images/ju.jpeg"
                }, {
                    title: "Bahut Nede",
                    file: "Amrinder Gill/Bahut Nede.mp3",
                    poster: "images/bahutnede.jpeg"
                }, {
                    title: "Dildarian",
                    file: "Amrinder Gill/Dildarian.mp3",
                    poster: "images/ju.jpeg"
                }, {
                    title: "That Girl",
                    file: "Amrinder Gill/That Girl.mp3",
                    poster: "images/thatgirl.jpeg"
                }, {
                    title: "Judda",
                    file: "Amrinder Gill/Judda.mp3",
                    poster: "images/ju.jpeg"
                }]
            },
            hardy: {
                name: "Harddy Sandhu",
                image: "images/hardy.jpeg",
                songs: [{
                    title: "Soch",
                    file: "Harddy Sandhu/Soch.mp3",
                    poster: "images/Sochh.jpeg"
                }]
            },
            anuvjain: {
                name: "Anuv Jain",
                image: "images/anuv.jpeg",
                songs: [{
                    title: "Afsos",
                    file: "Anuv Jain/Afsos.mp3",
                    poster: "images/afsos.jpeg"
                }, {
                    title: "Inaam",
                    file: "Anuv Jain/Inaam.mp3",
                    poster: "images/inaam.jpeg"

                }, {
                    title: "Baarishein",
                    file: "Anuv Jain/BAARISHEIN.mp3",
                    poster: "images/Baarishein.jpeg"
                }, {
                    title: "Gul",
                    file: "Anuv Jain/Gul.mp3",
                    poster: "images/Gul.jpeg"
                }, {
                    title: "Antariksh",
                    file: "Anuv Jain/ANTARIKSH.mp3",
                    poster: "images/Antariksh.jpeg"
                }, {
                    title: "Jo Tum Mere Ho",
                    file: "Anuv Jain/Jo Tum Mere Ho.mp3",
                    poster: "images/Jo Tum Mere Ho.jpeg"
                }, {
                    title: "Riha",
                    file: "Anuv Jain/Riha.mp3",
                    poster: "images/Riha.jpeg"
                }, {
                    title: "Alag Aasmaan",
                    file: "Anuv Jain/Alag Aasmaan.mp3",
                    poster: "images/alag.jpeg"
                }, {
                    title: "Husn",
                    file: "Anuv Jain/Husn.mp3",
                    poster: "images/Husn.jpeg"
                }, {
                    title: "Maula",
                    file: "Anuv Jain/Maula.mp3",
                    poster: "images/maula.jpeg"
                }, {
                    title: "Meri Baaton Mein Tu",
                    file: "Anuv Jain/Meri Baaton Mein Tu.mp3",
                    poster: "images/meri.jpeg"
                }]
            },
            mehro: {
                name: "Mehro",
                image: "images/mehro.jpeg",
                songs: [{
                    title: "Chance With You",
                    file: "Mehro/Chance With You.mp3",
                    poster: "images/chance.jpeg"
                }, {
                    title: "Perfum",
                    file: "Mehro/Perfum.mp3",
                    poster: "images/chance.jpeg"
                }, {
                    title: "Hideous",
                    file: "Mehro/Hideous.mp3",
                    poster: "images/chance.jpeg"
                }]
            },
            diljit: {
                name: "Diljit Dosanjh",
                image: "images/diljit.jpeg",
                songs: [{
                    title: "Born To Shine",
                    file: "Diljit Dosanjh/Born To Shine.mp3",
                    poster: "images/B2S.jpeg"
                }, {
                    title: "G.O.A.T",
                    file: "Diljit Dosanjh/G.O.A.T.mp3",
                    poster: "images/GOAT.jpeg"
                }]
            },
            karan: {
                name: "Karan Aujla",
                image: "images/karan.jpeg",
                songs: [{
                    title: "5-7",
                    file: "Karan Aujla/5 7.mp3",
                    poster: "images/5 7.jpeg"
                }, {
                    title: "Low Fade",
                    file: "Karan Aujla/Low Fade.mp3",
                    poster: "images/Low Fade.jpeg"
                }, {
                    title: "Guilty",
                    file: "Karan Aujla/Guilty.mp3",
                    poster: "images/Guilty.jpeg"
                }, {
                    title: "Top Fella",
                    file: "Karan Aujla/Top Fella.mp3",
                    poster: "images/Top Fella.jpeg"
                }, {
                    title: "Don't Look",
                    file: "Karan Aujla/Don'nt Look.mp3",
                    poster: "images/Don'nt Look.jpeg"
                }, {
                    title: "Courtside",
                    file: "Karan Aujla/Courtside.mp3",
                    poster: "images/Courtside.jpeg"
                }, {
                    title: "MF Gabhru",
                    file: "Karan Aujla/MF Gabhru.mp3",
                    poster: "images/MF Gabhru.jpeg"
                }, {
                    title: "Jhanjar",
                    file: "Karan Aujla/Jhanjar.mp3",
                    poster: "images/Jhanjar.jpeg"
                }, {
                    title: "Kya Baat Aa",
                    file: "Karan Aujla/Kya Baat Aa.mp3",
                    poster: "images/Kya Baat Aa.jpeg"
                }, {
                    title: "7 7 Magnitude",
                    file: "Karan Aujla/7 7 Magnitude.mp3",
                    poster: "images/MF Gabhru.jpeg"
                }, {
                    title: "52 Bars",
                    file: "Karan Aujla/52 Bars.mp3",
                    poster: "images/52 Bars.jpeg"
                }, {
                    title: "Admirin You",
                    file: "Karan Aujla/Admirin You.mp3",
                    poster: "images/Admirin You.jpeg"
                }, {
                    title: "Antidote",
                    file: "Karan Aujla/Antidote.mp3",
                    poster: "images/IDK How.jpeg"
                }, {
                    title: "Boyfriend",
                    file: "Karan Aujla/Boyfriend.mp3",
                    poster: "images/MF Gabhru.jpeg"
                }, {
                    title: "Fallin Apart",
                    file: "Karan Aujla/FallinApart.mp3",
                    poster: "images/Nothing Lasts.jpeg"
                }, {
                    title: "For A Reason",
                    file: "Karan Aujla/For A Reason.mp3",
                    poster: "images/MF Gabhru.jpeg"
                }, {
                    title: "Game Over",
                    file: "Karan Aujla/Game Over.mp3",
                    poster: "images/Game Over.jpeg"
                }, {
                    title: "Goin Off",
                    file: "Karan Aujla/Goin Off.mp3",
                    poster: "images/Goin Off.jpeg"
                }, {
                    title: "HIM",
                    file: "Karan Aujla/HIM.mp3",
                    poster: "images/MF Gabhru.jpeg"
                }, {
                    title: "I Really Do",
                    file: "Karan Aujla/I Really Do.mp3",
                    poster: "images/MF Gabhru.jpeg"
                }, {
                    title: "IDK How",
                    file: "Karan Aujla/IDK How.mp3",
                    poster: "images/IDK How.jpeg"
                }, {
                    title: "Let em Play",
                    file: "Karan Aujla/Let em Play.mp3",
                    poster: "images/Let em Play.jpeg"
                }, {
                    title: "Mexico",
                    file: "Karan Aujla/Mexico.mp3",
                    poster: "images/Mexico.jpeg"
                }, {
                    title: "Nothing Lasts",
                    file: "Karan Aujla/Nothing Lasts.mp3",
                    poster: "images/Nothing Lasts.jpeg"
                }, {
                    title: "On Top",
                    file: "Karan Aujla/On Top.mp3",
                    poster: "images/On Top.jpeg"
                }, {
                    title: "P POP CULTURE",
                    file: "Karan Aujla/P POP CULTURE.mp3",
                    poster: "images/MF Gabhru.jpeg"
                }, {
                    title: "Soch",
                    file: "Karan Aujla/Soch.mp3",
                    poster: "images/Soch.jpeg"
                }, {
                    title: "Take It Easy",
                    file: "Karan Aujla/Take It Easy.mp3",
                    poster: "images/52 Bars.jpeg"
                }, {
                    title: "Tareefan",
                    file: "Karan Aujla/Tareefan.mp3",
                    poster: "images/Nothing Lasts.jpeg"
                }, {
                    title: "Wavy",
                    file: "Karan Aujla/Wavy.mp3",
                    poster: "images/Wavy.jpeg"
                }, {
                    title: "Winning Speech",
                    file: "Karan Aujla/Winning Speech.mp3",
                    poster: "images/Winning Speech.jpeg"
                }]
            },
            smg: {
                name: "S.M.G",
                image: "images/smg.jpeg",
                songs: [{
                    title: "NYPD",
                    file: "SMG/NYPD.mp3",
                    poster: "images/FATHER.JPEG"
                }, {
                    title: "3 AM IN MUMBAI",
                    file: "SMG/3 AM IN MUMBAI.mp3",
                    poster: "images/FATHER.JPEG"
                }, {
                    title: "ALL I NEED",
                    file: "SMG/ALL I NEED.mp3",
                    poster: "images/FATHER.JPEG"
                }, {
                    title: "OVERSEAS",
                    file: "SMG/OVERSEAS.mp3",
                    poster: "images/FATHER.JPEG"
                }, {
                    title: "Bexley Road",
                    file: "SMG/Bexley Road.mp3",
                    poster: "images/Bexley Road.jpeg"
                }, {
                    title: "C R E A M POSSE",
                    file: "SMG/C R E A M POSSE.mp3",
                    poster: "images/STIFF KIN.jpeg"
                }, {
                    title: "G.O.D",
                    file: "SMG/G.O.D.mp3",
                    poster: "images/G.O.D.jpeg"
                }, {
                    title: "HIGH ROLLERZ",
                    file: "SMG/HIGH ROLLERZ.mp3",
                    poster: "images/STIFF KIN.jpeg"
                }, {
                    title: "Intezaar",
                    file: "SMG/Intezaar.mp3",
                    poster: "images/Intezaar.jpeg"
                }, {
                    title: "LMK",
                    file: "SMG/LMK.mp3",
                    poster: "images/LMK.jpeg"
                }, {
                    title: "Lord Knows",
                    file: "SMG/Lord Knows.mp3",
                    poster: "images/Lord Knows.jpeg"
                }, {
                    title: "STIFF KIN",
                    file: "SMG/STIFF KIN.mp3",
                    poster: "images/STIFF KIN.jpeg"
                }, {
                    title: "WHY",
                    file: "SMG/Why.mp3",
                    poster: "images/Why.jpeg"
                }, {
                    title: "EX-FILES",
                    file: "SMG/EX FILES.mp3",
                    poster: "images/Ex.jpeg"
                }]
            },
            jerry: {
                name: "Jerry",
                image: "images/jerry.jpeg",
                songs: [{
                    title: "Zero Cares",
                    file: "Jerry/Zero Cares.mp3",
                    poster: "images/Zero Cares.jpeg"
                }, {
                    title: "Young G",
                    file: "Jerry/Young G.mp3",
                    poster: "images/Young G.jpeg"
                }, {
                    title: "Weakness",
                    file: "Jerry/Weakness.mp3",
                    poster: "images/Weakness.jpeg"
                }, {
                    title: "Vehnde Vehnde",
                    file: "Jerry/Vehnde Vehnde.mp3",
                    poster: "images/Vehnde Vehnde.jpeg"
                }, {
                    title: "Trippin",
                    file: "Jerry/Trippin.mp3",
                    poster: "images/Trippin.jpeg"
                }, {
                    title: "Tera Hassna",
                    file: "Jerry/Tera Hassna.mp3",
                    poster: "images/Tera Hassna.jpeg"
                }, {
                    title: "Tease",
                    file: "Jerry/Tease.mp3",
                    poster: "images/Tease.jpeg"
                }, {
                    title: "Street Style",
                    file: "Jerry/Street Style.mp3",
                    poster: "images/Street Style.jpeg"
                }, {
                    title: "Step Off",
                    file: "Jerry/Step Off.mp3",
                    poster: "images/Step Off.jpeg"
                }, {
                    title: "Statement",
                    file: "Jerry/Statement.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Sinner",
                    file: "Jerry/Sinner.mp3",
                    poster: "images/Sinner.jpeg"
                }, {
                    title: "Showstopper",
                    file: "Jerry/Showstopper.mp3",
                    poster: "images/Showstopper.jpeg"
                }, {
                    title: "She S The One",
                    file: "Jerry/She S The One.mp3",
                    poster: "images/She S The One.jpeg"
                }, {
                    title: "Pyaar Na Di Cheez",
                    file: "Jerry/Pyaar Na Di Cheez.mp3",
                    poster: "images/Pyaar Na Di Cheez.jpeg"
                }, {
                    title: "Pta Ni",
                    file: "Jerry/Pta Ni.mp3",
                    poster: "images/Pta Ni.jpeg"
                }, {
                    title: "Pta Kro",
                    file: "Jerry/Pta Kro.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Pricey",
                    file: "Jerry/Pricey.mp3",
                    poster: "images/Tease.jpeg"
                }, {
                    title: "President",
                    file: "Jerry/President.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Photo",
                    file: "Jerry/Photo.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Palm Angels",
                    file: "Jerry/Palm Angels.mp3",
                    poster: "images/Palm Angels.jpeg"
                }, {
                    title: "One Of One",
                    file: "Jerry/One Of One.mp3",
                    poster: "images/Tease.jpeg"
                }, {
                    title: "Miami Flow",
                    file: "Jerry/Miami Flow.mp3",
                    poster: "images/Tease.jpeg"
                }, {
                    title: "Mainu Nai Pehchaandi",
                    file: "Jerry/Mainu Nai Pehchaandi.mp3",
                    poster: "images/Mainu Nai Pehchaandi.jpeg"
                }, {
                    title: "LV",
                    file: "Jerry/LV.mp3",
                    poster: "images/LV.jpeg"
                }, {
                    title: "Link Up",
                    file: "Jerry/Link Up.mp3",
                    poster: "images/Tease.jpeg"
                }, {
                    title: "January",
                    file: "Jerry/January.mp3",
                    poster: "images/January.jpeg"
                }, {
                    title: "Illegal Whip",
                    file: "Jerry/Illegal Whip.mp3",
                    poster: "images/Illegal Whip.jpeg"
                }, {
                    title: "Icon",
                    file: "Jerry/Icon.mp3",
                    poster: "images/Icon.jpeg"
                }, {
                    title: "Holy Faak",
                    file: "Jerry/Holy Faak.mp3",
                    poster: "images/Holy Faak.jpeg"
                }, {
                    title: "Hanju",
                    file: "Jerry/Hanju.mp3",
                    poster: "images/Hanju.jpeg"
                }, {
                    title: "Hall Of Fame",
                    file: "Jerry/Hall Of Fame.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Gunda Van",
                    file: "Jerry/Gunda Van.mp3",
                    poster: "images/Gunda Van.jpeg"
                }, {
                    title: "Goddamn",
                    file: "Jerry/Goddamn.mp3",
                    poster: "images/Goddamn.jpeg"
                }, {
                    title: "Gaani",
                    file: "Jerry/Gaani.mp3",
                    poster: "images/Gaani.jpeg"
                }, {
                    title: "Fidah",
                    file: "Jerry/Fidah.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Destiny",
                    file: "Jerry/Destiny.mp3",
                    poster: "images/Tease.jpeg"
                }, {
                    title: "Damn Good",
                    file: "Jerry/Damn Good.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Culture",
                    file: "Jerry/Culture.mp3",
                    poster: "images/Culture.jpeg"
                }, {
                    title: "Confess",
                    file: "Jerry/Confess.mp3",
                    poster: "images/Confess.jpeg"
                }, {
                    title: "College Dropout",
                    file: "Jerry/College Dropout.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Cheetah",
                    file: "Jerry/Cheetah.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Casanova",
                    file: "Jerry/Casanova.mp3",
                    poster: "images/Casanova.jpeg"
                }, {
                    title: "Bet On Me",
                    file: "Jerry/Bet On Me.mp3",
                    poster: "images/Bet On Me.jpeg"
                }, {
                    title: "Bae Call",
                    file: "Jerry/Bae Call.mp3",
                    poster: "images/Bae Call.jpeg"
                }, {
                    title: "Badtmeeji",
                    file: "Jerry/Badtmeejifho.mp3",
                    poster: "images/Badtmeeji.jpeg"
                }, {
                    title: "Attwadi Dasde",
                    file: "Jerry/Attwadi Dasde.mp3",
                    poster: "images/Attwadi Dasde.jpeg"
                }, {
                    title: "Antisocial",
                    file: "Jerry/Antisocial.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Alpha",
                    file: "Jerry/Alpha.mp3",
                    poster: "images/Tease.jpeg"
                }, {
                    title: "Aint Gonna Stop",
                    file: "Jerry/Aint Gonna Stop.mp3",
                    poster: "images/Aint Gonna Stop.jpeg"
                }, {
                    title: "Adore",
                    file: "Jerry/Adore.mp3",
                    poster: "images/Adore.jpeg"
                }, {
                    title: "999",
                    file: "Jerry/999.mp3",
                    poster: "images/999.jpeg"
                }, {
                    title: "80 Lac",
                    file: "Jerry/80 Lac.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "38",
                    file: "Jerry/38.mp3",
                    poster: "images/38.jpeg"
                }, {
                    title: "9 2 11",
                    file: "Jerry/9 2 11.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "7 Saal",
                    file: "Jerry/7 Saal.mp3",
                    poster: "images/7 Saal.jpeg"
                }]
            },
            gurindergill: {
                name: "Gurinder Gill",
                image: "images/gurinder.jpeg",
                songs: [{
                    title: "LATE KNIGHTS",
                    file: "Gurinder Gill/Late Knights.mp3",
                    poster: "images/Late Knight.jpeg"
                }, {
                    title: "RICH HEART",
                    file: "Gurinder Gill/Rich Heart.mp3",
                    poster: "images/Rich Heart.jpeg"
                }]
            },
            gurnambhullar: {
                name: "GURNAM BHULLAR",
                image: "images/gurnam bhullar.jpeg",
                songs: [{
                    title: "DIAMOND",
                    file: "Gurnam Bhullar/Diamond.mp3",
                    poster: "images/Diamond.jpeg"
                }, {
                    title: "Wakh Ho Jana",
                    file: "Gurnam Bhullar/Wakh Ho Jana.mp3",
                    poster: "images/wakh.jpeg"
                }]
            },
            mankirataulakh: {
                name: "Mankirat Aulakh",
                image: "images/mankirat.jpeg",
                songs: [{
                    title: "GODDESS",
                    file: "Mankirat Aulakh/Goddess.mp3",
                    poster: "images/Goddess.jpeg"
                }]
            },
            parmishverma: {
                name: "Parmish Verma",
                image: "images/parmish.jpeg",
                songs: [{
                    title: "Aam Jahe Munde",
                    file: "Parmish Verma/Aam Jahe Munde.mp3",
                    poster: "images/Aam Jahe Munde.jpeg"
                }, {
                    title: "Car Culture",
                    file: "Parmish Verma/Car Culture.mp3",
                    poster: "images/carculture.jpeg"
                }, {
                    title: "Check It Out",
                    file: "Parmish Verma/Check It Out.mp3",
                    poster: "images/check it out.jpeg"
                }, {
                    title: "Dil Da Showroom",
                    file: "Parmish Verma/Dil Da Showroom.mp3",
                    poster: "images/dildashowroom.jpeg"
                }]
            },
            arjan: {
                name: "Arjan Dhillon",
                image: "images/arjan.jpeg",
                songs: [{
                    title: "Mohabbat",
                    file: "Arjan Dhillon/Mohabbat.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "Ik Tarfa",
                    file: "Arjan Dhillon/Ik Tarfa.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "No Shortcut",
                    file: "Arjan Dhillon/No Shortcut.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Enigma",
                    file: "Arjan Dhillon/Enigma.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Counting Gems",
                    file: "Arjan Dhillon/Counting Gems.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "One Call Away",
                    file: "Arjan Dhillon/One Call Away.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Skyfull",
                    file: "Arjan Dhillon/Skyfull.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "420 Miles",
                    file: "Arjan Dhillon/420 Miles.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Me Vs Me",
                    file: "Arjan Dhillon/Me Vs Me.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Ruthless",
                    file: "Arjan Dhillon/Ruthless.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Better With Me",
                    file: "Arjan Dhillon/Better With Me.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Culture",
                    file: "Arjan Dhillon/Culture.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Mahila Mittar",
                    file: "Arjan Dhillon/Mahila Mittar.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Last Goodbye",
                    file: "Arjan Dhillon/No Shortcut.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Raw Rich Rare",
                    file: "Arjan Dhillon/Raw Rich Rare.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "25-25",
                    file: "Arjan Dhillon/25-25.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "Hazur",
                    file: "Arjan Dhillon/Hazur.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "Trucker",
                    file: "Arjan Dhillon/Trucker.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "AKAD",
                    file: "Arjan Dhillon/AKAD.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "Din Te Gin",
                    file: "Arjan Dhillon/Din Te Gin.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "Hawa Banke",
                    file: "Arjan Dhillon/Hawa Banke.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "Karma Walia Akhan",
                    file: "Arjan Dhillon/Karma Walia Akhan.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "Kavita",
                    file: "Arjan Dhillon/Kavita.mp3",
                    poster: "images/Hawa Banke.jpeg"
                }, {
                    title: "Khat Likhi",
                    file: "Arjan Dhillon/Khat Likhi.mp3",
                    poster: "images/Hawa Banke.jpeg"
                }, {
                    title: "Pakka Ghar",
                    file: "Arjan Dhillon/Pakka Ghar.mp3",
                    poster: "images/Hawa Banke.jpeg"
                }, {
                    title: "Taj Mahal",
                    file: "Arjan Dhillon/Taj Mahal.mp3",
                    poster: "images/Hawa Banke.jpeg"
                }, {
                    title: "Tattoo",
                    file: "Arjan Dhillon/Tatoo.mp3",
                    poster: "images/Hawa Banke.jpeg"
                }, {
                    title: "Trucker (Alt)",
                    file: "Arjan Dhillon/trucker.mp3",
                    poster: "images/Hawa Banke.jpeg"
                }, {
                    title: "2-2 Asle",
                    file: "Arjan Dhillon/2 2 Asle.mp3",
                    poster: "images/youngsters.jpeg"
                }, {
                    title: "Greatest",
                    file: "Arjan Dhillon/Greatest.mp3",
                    poster: "images/youngsters.jpeg"
                }, {
                    title: "ILzaam",
                    file: "Arjan Dhillon/ILzaam.mp3",
                    poster: "images/youngsters.jpeg"
                }, {
                    title: "Kalli Sohni",
                    file: "Arjan Dhillon/Kalli Sohni.mp3",
                    poster: "images/sohni.jpeg"
                }, {
                    title: "Kath",
                    file: "Arjan Dhillon/Kath.mp3",
                    poster: "images/kath.jpeg"
                }, {
                    title: "Never Ever",
                    file: "Arjan Dhillon/Never Ever.mp3",
                    poster: "images/youngsters.jpeg"
                }, {
                    title: "Setting",
                    file: "Arjan Dhillon/Setting.mp3",
                    poster: "images/setting.jpeg"
                }]
            },
            apdhillon: {
                name: "AP Dhillon",
                image: "images/apdhillon.jpeg",
                songs: [{
                    title: "Excuses",
                    file: "AP Dhillon/Excuses.mp3",
                    poster: "images/excuses.jpeg"
                }, {
                    title: "STFU",
                    file: "AP Dhillon/STFU.mp3",
                    poster: "images/STFU.jpeg"

                }]
            },
            bohemia: {
                name: "Bohemia",
                image: "images/bohemia.jpeg",
                songs: [{
                    title: "Ek Tera Pyar",
                    file: "Bohemia/Ek Tera Pyar.mp3",
                    poster: "images/Ek Tera Pyar.jpeg"
                }]
            },
            boss: {
                name: "Boss",
                image: "images/boss.jpeg",
                songs: [{
                    title: "BOSS",
                    file: "Boss/Boss.mp3",
                    poster: "images/Boss.jpeg"
                }]
            },
            dhanda: {
                name: "Dhanda",
                image: "images/dhanda.jpeg",
                songs: [{
                    title: "Dhandha",
                    file: "Dhandha/Dhandha.mp3",
                    poster: "images/Dhandha.jpeg"
                }]
            },
            dulla: {
                name: "Dulla Bhatti",
                image: "images/dulla.jpeg",
                songs: [{
                    title: "Dulla Bhatti",
                    file: "Dulla Bhatti/Dulla Bhatti.mp3",
                    poster: "images/Dulla Bhatti.jpeg"
                }]
            },
            gursidhu: {
                name: "Gursidhu",
                image: "images/Gursidhu.jpeg",
                songs: [{
                    title: "Gursidhu",
                    file: "Gursidhu/Gursidhu.mp3",
                    poster: "images/Gursidhu.jpeg"
                }]
            },
            harkirataulakh: {
                name: "Harkirat Aulakh",
                image: "images/harkirat.jpeg",
                songs: [{
                    title: "Harkirat Aulakh",
                    file: "Harkirat Aulakh/Harkirat Aulakh.mp3",
                    poster: "images/Harkirat.jpeg"
                }]
            },
            honey: {
                name: " Yo Yo Honey Singh",
                image: "images/honey.jpeg",
                songs: [{
                    title: "Yo Yo Honey Singh",
                    file: "Yo Yo Honey Singh/Yo Yo Honey Singh.mp3",
                    poster: "images/Yo Yo Honey Singh.jpeg"
                }]

            },
            iqbal: {
                name: "Iqbal",
                image: "images/iq.jpeg",
                songs: [{
                    title: "Hath Haula",
                    file: "Iqbal/Hath Haula.mp3",
                    poster: "images/hathhola.jpeg"
                },{
                     title: "Koor Koor",
                    file: "Iqbal/Koor Koor.mp3",
                    poster: "images/koor.jpeg"
                }]
            },
            jassi: {
                name: "Jassi Gill",
                image: "images/jassi.jpeg",
                songs: [{
                    title: "Jassi Gill",
                    file: "Jassi Gill/Jassi Gill.mp3",
                    poster: "images/Jassi.jpeg"
                }]
            },
            jordansandhu: {
                name: "Jordan Sandhu",
                image: "images/jrdan.jpeg",
                songs: [{
                    title: "Banda Bamb",
                    file: "Jordan Sandhu/Banda Bamb.mp3",
                    poster: "images/bamb.jpeg"
                }]
            },
            nijjar: {
                name: "Nijjar",
                image: "images/nijjar.jpeg",
                songs: [{
                    title: "Nijjar",
                    file: "Nijjar/Nijjar.mp3",
                    poster: "images/Nijjar.jpeg"
                }]
            },
            pardeep: {
                name: "Pardeep Jeed",
                image: "images/pardeep.jpeg",
                songs: [{
                    title: "Pardeep Jeed",
                    file: "Pardeep Jeed/Pardeep Jeed.mp3",
                    poster: "images/Pardeep.jpeg"
                }]
            },
            saabi: {
                name: "Saabi",
                image: "images/saabi.jpeg",
                songs: [{
                    title: "Sabbir",
                    file: "Sabbir/Sabbir.mp3",
                    poster: "images/Sabbir.jpeg"
                }]
            },
            sultaan: {
                name: "Sultan",
                image: "images/suli.jpeg",
                songs: [{
                    title: "Sultan",
                    file: "Sultan/Sultan.mp3",
                    poster: "images/Sultan.jpeg"
                }]
            },
        };

    function getSongFolderArtistName(song) {
        const folder = String(song?.file || '').replace(/\\/g, '/').split('/')[0]?.trim();
        return folder || '';
    }

    function getArtistCatalogEntry(key, sourceArtists = artists) {
        const artist = sourceArtists[key];
        if (!artist || !Array.isArray(artist.songs) || !artist.songs.length) return null;
        const folderCounts = new Map();
        artist.songs.forEach((song) => {
            const folder = getSongFolderArtistName(song);
            if (folder) folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);
        });
        const folderName = [...folderCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || '';
        const name = (folderName || String(artist.name || '').trim() || key).trim();
        return {
            key,
            name,
            originalName: String(artist.name || '').trim(),
            image: artist.image,
            songs: artist.songs
        };
    }

    function getArtistCatalogEntries(sourceArtists = artists) {
        return Object.keys(sourceArtists).map((key) => getArtistCatalogEntry(key, sourceArtists)).filter(Boolean);
    }

    function getArtistDisplayNameByKey(key, fallback = '', sourceArtists = artists) {
        return getArtistCatalogEntry(key, sourceArtists)?.name || String(fallback || sourceArtists[key]?.name || '').trim();
    }

    function createArtistController(deps) {
        const getSortType = () => deps.getArtistSortType();
        const getCurrentArtistKey = () => deps.getCurrentArtistKey();
        const getCurrentSongs = () => deps.getCurrentSongs();
        const getCurrentSong = () => deps.getCurrentSong();

        function buildSidebar() {
            const sb = document.getElementById('sidebarArtists');
            if (!sb) return;
            sb.innerHTML = '';
            getArtistCatalogEntries().forEach((entry) => {
                sb.innerHTML += `<div class="artist-item" id="sb_${deps.escA(entry.key)}" onclick="openArtist('${deps.escA(entry.key)}')"><img src="${deps.escH(entry.image)}" onerror="this.style.background='#282828'"><span class="artist-item-name">${deps.escH(entry.name)}</span></div>`;
            });
        }

        function buildLibrarySongPool() {
            const pool = [];
            getArtistCatalogEntries().forEach((entry) => {
                entry.songs.forEach((song, idx) => {
                    const normalized = deps.normalizeSongForSorting({
                        ...song,
                        artistKey: entry.key,
                        artistName: entry.name,
                        artist: entry.name,
                        __baseIndex: idx
                    }, idx, { scope: 'library', artistName: entry.name, artistKey: entry.key });
                    pool.push({
                        ...normalized,
                        index: idx,
                        plays: normalized.playCount || 0
                    });
                });
            });
            return pool;
        }

        function artistCardHTML(key, artistEntryByKey) {
            const artist = artistEntryByKey[key];
            return `<div class="artist-card hx-artist-card" onclick="openArtist('${deps.escA(key)}')"><div class="artist-card-img-wrap"><img src="${deps.escH(artist.image)}" onerror="this.style.background='#282828'" loading="lazy"><button class="card-play-btn" onclick="event.stopPropagation();playArtist('${deps.escA(key)}')">${deps.uiIcon('play')}</button></div><div class="artist-card-name">${deps.escH(artist.name)}</div><div class="artist-card-count">${artist.songs.length} tracks</div></div>`;
        }

        function loadArtists() {
            deps.setNavActive('navHome');
            deps.setMobileBack(false);
            const artistEntries = getArtistCatalogEntries();
            const keys = artistEntries.map((entry) => entry.key);
            const artistEntryByKey = Object.fromEntries(artistEntries.map((entry) => [entry.key, entry]));
            const songPool = buildLibrarySongPool();
            const currentSong = getCurrentSong();
            const currentArtistKey = getCurrentArtistKey();
            const featuredSong = currentSong ? ({
                ...currentSong,
                artistName: currentArtistKey && artistEntryByKey[currentArtistKey] ? artistEntryByKey[currentArtistKey].name : (currentSong.artistName || deps.getPlayerArtistText() || '')
            }) : (deps.getContinueListening()[0] || songPool[0] || null);
            const trendingSongs = [...songPool].sort((a, b) => (b.plays || 0) - (a.plays || 0) || a.title.localeCompare(b.title)).slice(0, 10);
            const likedSongs = deps.getLikedSongs();
            const likedPool = songPool.filter((song) => likedSongs.has(song.file));
            const recommendationSeed = likedPool.length ? likedPool : songPool;
            const recommendSongs = [...recommendationSeed].sort((a, b) => (b.plays || 0) - (a.plays || 0) || a.artistName.localeCompare(b.artistName)).slice(0, 8);
            const albumGroups = [...songPool.reduce((map, song) => {
                const album = deps.deriveSongAlbum(song, song.artistName);
                const id = `${album}|${song.artistName}`;
                if (!map.has(id)) map.set(id, { album, artistName: song.artistName, poster: song.poster, songs: [], plays: 0 });
                const group = map.get(id);
                group.songs.push(song);
                group.plays += song.plays || song.playCount || 0;
                return map;
            }, new Map()).values()].sort((a, b) => b.songs.length - a.songs.length || b.plays - a.plays || a.album.localeCompare(b.album)).slice(0, 6);
            const recentSongs = deps.getContinueListening().slice(0, 6);
            const onDeckSongs = recentSongs.length ? recentSongs : trendingSongs.slice(0, 6);
            const leadSongs = [featuredSong, ...trendingSongs, ...recommendSongs].filter(Boolean);
            const stationSongs = leadSongs.filter((song, index, arr) => arr.findIndex((item) => item.file === song.file) === index).slice(0, 4);
            const recListSongs = recommendSongs.length ? recommendSongs : trendingSongs.slice(0, 6);
            const libraryTrackCount = songPool.length;
            const totalPlays = songPool.reduce((sum, song) => sum + (song.plays || song.playCount || 0), 0);
            const heroSubtitle = featuredSong ? `${deps.escH(featuredSong.artistName || 'FalconX Curated')} sets the tone for a cinematic black-and-gold listening session.` : 'A cinematic launchpad for new music, favorites, and deep cuts.';
            const playClick = (song) => `playSongByFile('${deps.escA(song.file)}')`;
            const historyClick = (song) => `playFromHistory('${deps.escA(song.file)}','${deps.escA(song.artistKey || '')}')`;
            const miniRowHTML = (song, useHistory = false, icon = 'plus') => `<div class="home-mini-row hx-row" onclick="${useHistory ? historyClick(song) : playClick(song)}"><img src="${deps.escH(song.poster)}" onerror="this.style.background='var(--surface3)'" loading="lazy"><div class="home-text"><div class="home-title">${deps.songTitleHTML(song)}</div><div class="home-meta">${deps.escH(song.artistName || '')}</div></div><button class="home-icon-action" onclick="event.stopPropagation();addSongToQueueByFile('${deps.escA(song.file)}', false)" title="Add to queue">${deps.uiIcon(icon)}</button></div>`;
            const trendCardHTML = (song, i) => `<div class="hx-trend-card" onclick="${playClick(song)}"><div class="hx-trend-rank">${String(i + 1).padStart(2, '0')}</div><img src="${deps.escH(song.poster)}" onerror="this.style.background='var(--surface3)'" loading="lazy"><div class="home-text"><div class="home-title">${deps.songTitleHTML(song)}</div><div class="home-meta">${deps.escH(song.artistName)} - ${song.plays || song.playCount || 0} plays</div></div><button class="home-icon-action" onclick="event.stopPropagation();addSongToQueueByFile('${deps.escA(song.file)}', false)" title="Add to queue">${deps.uiIcon('list-plus')}</button></div>`;
            const recCardHTML = (song, i) => `<div class="hx-rec-card" onclick="${playClick(song)}"><div class="hx-rec-art"><img src="${deps.escH(song.poster)}" onerror="this.style.background='var(--surface3)'" loading="lazy"><button class="card-play-btn" onclick="event.stopPropagation();${playClick(song)}">${deps.uiIcon('play')}</button></div><div class="home-title">${deps.songTitleHTML(song)}</div><div class="home-meta">${deps.escH(song.artistName || '')}${i === 0 ? ' - Prime pick' : ''}</div></div>`;
            const albumCardHTML = (album) => `<div class="home-album-card hx-album-card" onclick="${playClick(album.songs[0])}"><img src="${deps.escH(album.poster)}" onerror="this.style.background='var(--surface3)'" loading="lazy"><div class="home-album-title"><span class="title-with-badge"><span class="title-text">${deps.escH(album.album)}</span>${deps.collectionNewBadgeHTML(album.songs)}</span></div><div class="home-album-meta">${deps.escH(album.artistName)} - ${album.songs.length} track${album.songs.length !== 1 ? 's' : ''}</div></div>`;
            const moodTilesHTML = [
                { icon: 'heart', title: 'Gold Favorites', meta: `${likedSongs.size} saved tracks`, action: 'showLikedSongs()' },
                { icon: 'list-music', title: 'Private Playlists', meta: `${Object.keys(deps.getPlaylists() || {}).length} collections`, action: 'showPlaylists()' },
                { icon: 'download', title: 'Offline Vault', meta: `${deps.getDownloadedFiles().size} downloads`, action: 'showDownloads()' },
                { icon: 'sliders-horizontal', title: 'Audio Suite', meta: 'Shape the sound', action: 'renderAudioPage()' }
            ].map((tile) => `<button class="hx-action-tile" onclick="${tile.action}"><span>${deps.uiIcon(tile.icon)}</span><div><strong>${tile.title}</strong><em>${tile.meta}</em></div></button>`).join('');
            const featuredHTML = featuredSong ? `<section class="hx-stage">
                <div class="hx-feature-card">
                    <div class="hx-feature-orbit" aria-hidden="true"></div>
                    <div class="hx-feature-copy">
                        <div class="home-eyebrow">${deps.uiIcon('sparkles')}<span>FalconX Signature</span></div>
                        <h1>${deps.songTitleHTML(featuredSong, 'Featured Sound')}</h1>
                        <p>${heroSubtitle}</p>
                        <div class="hx-feature-meta"><span>${deps.escH(featuredSong.artistName || 'FalconX')}</span><span>${libraryTrackCount} tracks</span><span>${totalPlays} plays</span></div>
                        <div class="home-hero-actions">
                            <button class="home-play-primary" onclick="${playClick(featuredSong)}">${deps.uiIcon('play')}<span>Play Feature</span></button>
                            <button class="home-action-ghost" onclick="addSongToQueueByFile('${deps.escA(featuredSong.file)}', true)">${deps.uiIcon('list-plus')}<span>Play Next</span></button>
                        </div>
                    </div>
                    <div class="hx-feature-art">
                        <img src="${deps.escH(featuredSong.poster || '')}" alt="${deps.escH(featuredSong.title || 'Featured song')}" onerror="this.style.background='var(--surface3)'" loading="lazy">
                    </div>
                </div>
                <aside class="hx-now-card">
                    <div class="home-section-headline"><div><div class="home-section-kicker">${deps.uiIcon(recentSongs.length ? 'history' : 'radio')}<span>${recentSongs.length ? 'Resume' : 'On Deck'}</span></div><div class="home-section-title">${recentSongs.length ? 'Continue Listening' : 'Start Your Session'}</div></div><div class="home-section-meta">${onDeckSongs.length} Picks</div></div>
                    <div class="hx-now-list home-rail">${onDeckSongs.map((song) => miniRowHTML(song, !!recentSongs.length, recentSongs.length ? 'plus' : 'list-plus')).join('')}</div>
                </aside>
            </section>` : '';

            const mainArea = document.getElementById('mainArea');
            mainArea.innerHTML = `
            <div class="main-topbar">
                <div class="nav-arrows"><button class="nav-arrow-btn" title="Back">${deps.uiIcon('chevron-left')}</button><button class="nav-arrow-btn" title="Forward">${deps.uiIcon('chevron-right')}</button></div>
                <div class="search-box">
                    <span class="search-icon">${deps.uiIcon('search')}</span>
                    <input type="text" id="searchBar" placeholder="Search artists or songs..." oninput="globalSearch()">
                    <button class="search-clear" id="searchClear" onclick="clearSearch()">${deps.uiIcon('x')}</button>
                </div>
                <div class="topbar-actions">
                    <button class="topbar-menu-btn" onclick="openMobileDrawer()" title="Menu">${deps.uiIcon('menu')}</button>
                    <button class="topbar-icon-btn" onclick="showLikedSongs()" title="Favorites">${deps.uiIcon('heart')}</button>
                    <button class="topbar-icon-btn" onclick="showPlaylists()" title="Playlists">${deps.uiIcon('list-music')}</button>
                </div>
            </div>
            <div class="home-shell hx-home">
                ${featuredHTML}
                <section class="home-section hx-command-strip">
                    ${moodTilesHTML}
                </section>
                <section class="home-section hx-grid-block">
                    <div class="hx-chart-panel">
                        <div class="home-section-headline"><div><div class="home-section-kicker">${deps.uiIcon('flame')}<span>Pulse Chart</span></div><div class="home-section-title">Trending Now</div></div><div class="home-section-meta">${trendingSongs.length} Tracks</div></div>
                        <div class="hx-trend-list">${trendingSongs.map((song, i) => trendCardHTML(song, i)).join('') || '<div class="home-empty-note">No tracks available.</div>'}</div>
                    </div>
                    <div class="hx-station-panel">
                        <div class="home-section-headline"><div><div class="home-section-kicker">${deps.uiIcon('radio')}<span>Stations</span></div><div class="home-section-title">Instant Mixes</div></div><div class="home-section-meta">FalconX</div></div>
                        <div class="hx-station-grid">${stationSongs.map((song, i) => `<button class="hx-station-card" onclick="${playClick(song)}"><img src="${deps.escH(song.poster)}" onerror="this.style.background='var(--surface3)'" loading="lazy"><span>${['After Dark', 'Gold Room', 'Focus Drive', 'Deep Cut'][i] || 'Prime Mix'}</span><em>${deps.escH(song.artistName || 'FalconX')}</em></button>`).join('') || '<div class="home-empty-note">No stations yet.</div>'}</div>
                    </div>
                </section>
                <section class="home-section">
                    <div class="home-section-headline"><div><div class="home-section-kicker">${deps.uiIcon('gem')}<span>Curated</span></div><div class="home-section-title">Recommended For You</div></div><div class="home-section-meta">${likedPool.length ? 'Personalized' : 'Fresh Picks'}</div></div>
                    <div class="hx-rec-grid home-rail">
                        ${recListSongs.map((song, i) => recCardHTML(song, i)).join('') || '<div class="home-empty-note">No recommendations yet.</div>'}
                    </div>
                </section>
                <section class="home-section">
                    <div class="home-section-headline"><div><div class="home-section-kicker">${deps.uiIcon('disc-3')}<span>New Energy</span></div><div class="home-section-title">Albums & Collections</div></div><div class="home-section-meta">${albumGroups.length} Picks</div></div>
                    <div class="home-album-grid home-rail">${albumGroups.map((album) => albumCardHTML(album)).join('') || '<div class="home-empty-note">No albums available.</div>'}</div>
                </section>
                <section class="home-section home-artists">
                    <div class="home-section-headline"><div><div class="home-section-kicker">${deps.uiIcon('users')}<span>Spotlight</span></div><div class="home-section-title">Popular Artists</div></div><div class="home-section-meta">${keys.length} Artists</div></div>
                    <div class="artists-grid">
                        ${keys.map((key) => artistCardHTML(key, artistEntryByKey)).join('')}
                    </div>
                </section>
            </div>`;
            deps.initSearchClear();
            deps.renderLucideIcons(mainArea);
            deps.scheduleNewBadgeExpiryRefresh(mainArea);
            console.log("Unique artists:", artistEntries.length);
            console.log("Rendered artist cards:", mainArea.querySelectorAll('.home-artists .artist-card').length);
        }

        function getSortedArtistSongs(key, type = getSortType()) {
            const artist = getArtistCatalogEntry(key);
            if (!artist) return [];
            const base = artist.songs.map((song, index) => ({
                ...song,
                artistName: artist.name,
                artist: artist.name,
                artistKey: key,
                liked: deps.getLikedSongs().has(song.file),
                downloaded: deps.isDownloaded(song.file),
                playCount: deps.getSongPlayCounts()[song.file] || 0,
                __baseIndex: index
            }));
            return deps.applySorting('artist', base, type, { artistName: artist.name, artistKey: key });
        }

        function openArtist(key) {
            const a = getArtistCatalogEntry(key);
            if (!a) return;
            const sortedSongs = getSortedArtistSongs(key);
            deps.setCurrentArtistKey(key);
            deps.setCurrentSongs(sortedSongs);
            setSidebarActive(key);
            deps.setMobileBack(true);
            const mainArea = document.getElementById('mainArea');
            mainArea.innerHTML = `
            <div class="main-topbar">
                <div class="nav-arrows"><button class="nav-arrow-btn" onclick="loadArtists()">${deps.uiIcon('chevron-left')}</button></div>
                <div class="search-box"><span class="search-icon">${deps.uiIcon('search')}</span><input type="text" id="searchBar" placeholder="Search in ${a.name}…" oninput="globalSearch()"><button class="search-clear" id="searchClear" onclick="clearSearch()">${deps.uiIcon('x')}</button></div>
                <div class="topbar-actions"><button class="topbar-menu-btn" onclick="openMobileDrawer()" title="Menu">${deps.uiIcon('menu')}</button></div>
            </div>
            <div class="artist-hero"><div class="artist-hero-bg" style="background-image:url('${a.image}')"></div><div class="artist-hero-overlay"></div><div class="artist-hero-content"><img class="artist-hero-img" src="${a.image}" onerror="this.style.background='#282828'"><div><div class="artist-hero-tag">Artist</div><div class="artist-hero-name">${a.name}</div><div style="font-size:.8rem;color:var(--text2);margin-bottom:16px">${a.songs.length} songs</div><div class="artist-hero-actions"><button class="btn btn-white" onclick="playArtist('${key}')">${deps.uiIcon('play')}<span>Play</span></button><button class="btn btn-outline" onclick="shuffleArtist('${key}')">${deps.uiIcon('shuffle')}<span>Shuffle</span></button></div></div></div></div>
            <div class="songs-section" style="padding-top:20px">
                ${deps.sortControlHTML('artist', getSortType(), deps.getSortSectionOptions().artist, 'Sort Artist Songs')}
                <div class="songs-table-header"><span class="th">#</span><span class="th">Title</span><span class="th"></span></div>
                <div id="songsList" class="sort-song-list"></div>
            </div>`;
            deps.initSearchClear();
            deps.renderLucideIcons(mainArea);
            renderArtistSongs(key, true);
        }

        function songRowHTML(song, i, artistName) {
            const currentSong = getCurrentSong();
            const playing = currentSong && currentSong.file === song.file && !deps.isAudioPaused();
            const liked = deps.getLikedSongs().has(song.file);
            const rowArtist = song.artistName || song.artist || artistName || '';
            return `<div class="song-row${playing?' playing':''}" id="row_${i}" data-file="${deps.escH(song.file)}" onclick="playSong(${i},true)"><div class="song-num">${playing?'<div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>':i+1}</div><div class="song-row-info"><img src="${deps.escH(song.poster)}" onerror="this.style.background='#282828'" loading="lazy"><div class="song-row-text"><h4>${deps.songTitleHTML(song)}</h4><p>${deps.escH(rowArtist)}</p></div></div><div class="song-actions"><button class="like-btn${liked?' liked':''}" onclick="event.stopPropagation();toggleLike('${deps.escA(song.file)}',${i})" title="${liked?'Unlike':'Like'}">${liked?deps.uiIcon('heart'):deps.uiIcon('heart-off')}</button><button class="song-more-btn" onclick="event.stopPropagation();showSongRowActionsMenu(event,'${deps.escA(song.file)}',${i})" title="More options">${deps.uiIcon('more-horizontal')}</button></div></div>`;
        }

        function updateArtistPlayingState(autoScrollActive = false) {
            if (!getCurrentArtistKey()) return;
            const list = document.getElementById('songsList');
            if (!list) return;
            const currentSongs = getCurrentSongs();
            const currentSong = getCurrentSong();
            list.querySelectorAll('.song-row').forEach((row, i) => {
                const song = currentSongs[i];
                const isPlaying = !!(song && currentSong && currentSong.file === song.file && !deps.isAudioPaused());
                row.classList.toggle('playing', isPlaying);
                const num = row.querySelector('.song-num');
                if (!num) return;
                if (isPlaying) {
                    num.innerHTML = '<div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>';
                } else {
                    num.textContent = String(i + 1);
                }
            });
        }

        function renderArtistSongs(key = getCurrentArtistKey(), autoScrollActive = false) {
            if (!key) return;
            const list = document.getElementById('songsList');
            if (!list) return;
            const artist = getArtistCatalogEntry(key);
            if (!artist) return;
            const sortedSongs = getSortedArtistSongs(key, getSortType());
            deps.setCurrentSongs(sortedSongs);
            deps.setCurrentArtistKey(key);
            deps.renderSortedList(list, sortedSongs.map((song, i) => songRowHTML(song, i, artist.name)).join(''), '.song-row', () => {
                deps.renderLucideIcons(list);
                deps.updateSortUI('artist', getSortType());
                updateArtistPlayingState(autoScrollActive);
            });
        }

        function refreshSongRows() {
            if (!getCurrentArtistKey()) return;
            const list = document.getElementById('songsList');
            if (!list) return;
            renderArtistSongs(getCurrentArtistKey(), false);
        }

        function playArtist(key) {
            deps.setCurrentSongs(getSortedArtistSongs(key, getSortType()));
            deps.setCurrentArtistKey(key);
            deps.setCurrentIndex(0);
            deps.playSong(0, true);
        }

        function shuffleArtist(key) {
            const songs = getSortedArtistSongs(key, getSortType());
            deps.setCurrentSongs(songs);
            deps.setCurrentArtistKey(key);
            deps.setCurrentIndex(Math.floor(Math.random() * songs.length));
            deps.playSong(deps.getCurrentIndex(), true);
        }

        function openArtistAndPlay(key, index) {
            const file = artists[key]?.songs?.[index]?.file || '';
            deps.setCurrentArtistKey(key);
            openArtist(key);
            const sortedIndex = getCurrentSongs().findIndex((song) => song.file === file);
            deps.playSong(sortedIndex >= 0 ? sortedIndex : 0, true);
        }

        function searchArtistCardHTML(result, query) {
            return `<div class="artist-card" onclick="openArtist('${deps.escA(result.key)}')"><div class="artist-card-img-wrap"><img src="${deps.escH(result.image)}" onerror="this.style.background='#282828'" loading="lazy"><button class="card-play-btn" onclick="event.stopPropagation();playArtist('${deps.escA(result.key)}')">${deps.uiIcon('play')}</button></div><div class="artist-card-name">${deps.highlightedText(result.name, query)}</div><div class="artist-card-count">${result.songCount} songs</div></div>`;
        }

        function setSidebarActive(key) {
            document.querySelectorAll('.artist-item').forEach((e) => e.classList.remove('active'));
            const e = document.getElementById('sb_' + key);
            if (e) e.classList.add('active');
        }

        return {
            buildSidebar,
            buildLibrarySongPool,
            loadArtists,
            getSortedArtistSongs,
            openArtist,
            songRowHTML,
            updateArtistPlayingState,
            renderArtistSongs,
            refreshSongRows,
            playArtist,
            shuffleArtist,
            openArtistAndPlay,
            searchArtistCardHTML,
            setSidebarActive
        };
    }

    global.FalconXArtists = artists;
    global.artists = artists;
    global.FalconXArtistModule = {
        artists,
        getSongFolderArtistName,
        getArtistCatalogEntry,
        getArtistCatalogEntries,
        getArtistDisplayNameByKey,
        createArtistController
    };
})(window);
