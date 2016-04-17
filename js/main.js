requirejs.config({
    baseUrl: 'js',
    paths: {
        Pixi: '../bower_components/pixi/bin/pixi',
        Three: '../bower_components/three.js/build/three'
    },
    shim: {
        Three: {
            exports: "THREE"
        }
    }
});

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate || function(){};

require(["game/Game", 
    "Pixi",
    "Three"],
function(Game, Pixi, Three) {
    var root = new Pixi.Container(0x6699FF);

    var pixiRenderer = Pixi.autoDetectRenderer(window.innerWidth, window.innerHeight, {view: document.getElementById('pixiCanvas')});

    var threeScene = new Three.Scene();
    var threeCamera = new Three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    var threeRenderer = new Three.WebGLRenderer({canvas: document.getElementById('threeCanvas'), alpha: true});
    threeRenderer.setSize( window.innerWidth, window.innerHeight );
    threeRenderer.setClearColor( 0xffffff, 0.0 );

    var game = new Game(root, pixiRenderer, threeScene, threeCamera);

    var lastTime = Date.now();

    requestAnimationFrame( animate );

    var delta = 0;

    function animate() {

        var now = Date.now();

        delta = (now - lastTime)/1000;
        delta = Math.min(delta,0.33);

        requestAnimationFrame( animate );

        game.update(delta);
        game.render();

        // render the stage
        pixiRenderer.render(root);

        threeRenderer.clear();
        threeRenderer.render( threeScene, threeCamera );

        lastTime = now;
    }
});