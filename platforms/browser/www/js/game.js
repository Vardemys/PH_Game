var app = {

    inicio : function(){

        velocidadX =0;
        velocidadY=0;
        dificultad = 0;
        puntuacion = 0;
        ballwidth = 50;
        alto = document.documentElement.clientHeight;
        ancho = document.documentElement.clientWidth;
        app.vigilaSensores();

        app.iniciaJuego();
    },

    vigilaSensores : function(){
        function onError(){
            console.log("onError!");
        }
        function onSuccess(datosAceleracion){
            app.registraDirecction(datosAceleracion);

            app.detectaAgitacion(datosAceleracion);
        }
        navigator.accelerometer.watchAcceleration(onSuccess, onError,{frequency:30});
    },
    
    detectaAgitacion : function(datosAceleracion){
        agitacionX = datosAceleracion.x >10;
        agitacionY = datosAceleracion.y > 10;

        if(agitacionX || agitacionY){
            setTimeout(app.recomienza,1000);
        }
    },


    recomienza : function(){
        document.location.reload(true);
    },

    registraDirecction : function(datosAceleracion){
        velocidadX = datosAceleracion.x;
        velocidadY = datosAceleracion.y;
    },

    iniciaJuego : function(){
        function preload(){

            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.stage.backgroundColor = "#f27d0c";

            game.load.image("bola", "img/ball.png");
            game.load.image("objetivo","img/marcador.png");

        }

        function create(){
            scoreText =game.add.text(15,15,puntuacion,{fontSize:"100px",fill:"#757676"});

            objetivo = game.add.sprite(app.inicioX(), app.inicioY(),"objetivo");
            bola = game.add.sprite(app.inicioX(), app.inicioY(),"bola");
            

            game.physics.arcade.enable(bola);
            game.physics.arcade.enable(objetivo);

            bola.body.collideWorldBounds = true;
            bola.body.onWorldBounds = new Phaser.Signal();
            bola.body.onWorldBounds.add(app.decrementPuntuation,this);
        }

        function update(){

            var factordificultad = (300+(dificultad*100));
            bola.body.velocity.x = (velocidadX*-1*factordificultad);
            bola.body.velocity.y = (velocidadY*factordificultad);

            game.physics.arcade.overlap(bola, objetivo, app.incrementarPuntos,null,this);
        }
        
        var estados ={preload:preload, create:create, update:update};
        var game = new Phaser.Game(ancho,alto,Phaser.CANVAS,"phaser",estados);
    },

    incrementarPuntos : function(){
        puntuacion = puntuacion+1;
        scoreText.text = puntuacion;

        objetivo.body.x = app.inicioX();
        objetivo.body.y = app.inicioY();

        if(puntuacion>1){
            dificultad = dificultad+1;
        }
    },

    decrementPuntuation : function(){
        puntuacion = puntuacion-1;
        scoreText.text = puntuacion;    
    },

    inicioX : function(){
        return app.numeroAleatorioHasta(ancho-ballwidth);
    },

    inicioY : function(){
        return app.numeroAleatorioHasta(alto-ballwidth);
    },

    numeroAleatorioHasta : function(limite){
        return Math.floor(Math.random()*limite);
    }

};

if("addEventListener" in document){
    document.addEventListener("DOMContentLoaded", function(){
        app.inicio();
    }, false);
}