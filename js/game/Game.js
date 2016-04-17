define([
    "Pixi",
    "Three",
    "game/Cube"],
function(Pixi, Three, Cube)
{
    function Game(root, pixiRenderer, threeScene, threeCamera)
    {
        this.totalElapsed = 0;
        this.container = new Pixi.Container();

        root.addChild(this.container);
        
        this.sprites = [];
        var texture = Pixi.Texture.fromImage('assets/white_32.png');
        
        this.mouse = pixiRenderer.plugins.interaction.mouse ? pixiRenderer.plugins.interaction.mouse : null;
        
        var minSize = Math.min(window.innerHeight,window.innerWidth);
        
        var size = Math.ceil(minSize/25);
        var scale = 0.95 * size/32;
        
        for(var y = 0; y<=window.innerHeight;y+=size)
        {
            for(var x=0; x<=window.innerWidth; x+=size)
            {
                var sprite = new Pixi.Sprite(texture);
                sprite.pivot.set(size/2,size/2);
                
                sprite.position.x = x + size/4;
                sprite.position.y = y + size/4;
                sprite.tint = Math.random() * 0xffffff;
                sprite.scale.set(scale,scale);
                sprite.alpha = 0.9 + 0.1 * Math.random();
                
                this.sprites.push(sprite);
                this.container.addChild(sprite);
            }
        }

        document.body.addEventListener('mousedown',  function(e){ this.mouseDown(e) }.bind(this), true);

        this.initThree(threeScene, threeCamera);
    };

    Game.prototype.mouseDown = function()
    {
        this.cube.updateInput(this.mouse, true);
    };

    Game.prototype.initThree = function(threeScene, threeCamera)
    {
        threeCamera.position.z = 7;

        var ambientLight = new Three.AmbientLight( 0x777777 );
        threeScene.add( ambientLight );

        var directionalLight = new Three.DirectionalLight( 0xffffff, 0.5 );
        directionalLight.position.set( 3, 10, 0 );
        threeScene.add( directionalLight );


        this.cube = new Cube(threeScene, threeCamera);

    };

    Game.prototype.update = function(delta)
    {
        this.totalElapsed += delta;
        
        this.sprites.forEach(function(sprite){
            var xFactor = sprite.position.x/window.innerWidth;
            var yFactor = sprite.position.y/window.innerHeight;
            
            var xResult = Math.sin(this.totalElapsed / 2 + xFactor) * 0.5 + 0.5;
            var timeFactor = Math.sin(this.totalElapsed);
            
            var blueFuzz = Math.random()*0.30 * yFactor + 0.5;
            var mouseFactor = 0;

            var mousePosition = this.mouse.global;

            if(mousePosition)
            {
                var radius = window.innerHeight/3;
                var dist = Math.sqrt( (mousePosition.x - sprite.position.x)*(mousePosition.x - sprite.position.x) + (mousePosition.y - sprite.position.y)*(mousePosition.y - sprite.position.y) );
                dist = (radius - dist)/radius;
                dist = Math.min(Math.max(0,dist),1);
                
                mouseFactor = dist * 0.25;
            }
            
            sprite.tint = this.toHex(xResult + mouseFactor, yFactor + mouseFactor, 0.5 + mouseFactor);
            
            if(Math.random()<0.008)
                sprite.alpha = 0.9 + 0.1 * Math.random();
                
        }, this);

        if (this.mouse)
        {
            this.cube.updateInput(this.mouse, false);
        }

        this.cube.update(delta);

    };
    
    Game.prototype.render = function()
    {
        
    };
    
    
    Game.prototype.toHex = function(r,g,b)
    {
        var red = Math.min(255,Math.floor(255*r));
        var green = Math.min(255,Math.floor(255*g));
        var blue = Math.min(255,Math.floor(255*b));
        
        return ((red << 16) + (green << 8) + blue);
    };
    
    
    
    return Game;
});