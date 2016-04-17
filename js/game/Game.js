define(["Pixi", "Three"],
function(Pixi, Three)
{
    function Game(root, pixiRenderer, threeScene, threeCamera)
    {
        this.totalElapsed = 0;
        this.container = new Pixi.Container();
        root.addChild(this.container);
        
        this.sprites = [];
        var texture = Pixi.Texture.fromImage('assets/white_32.png');
        
        this.mouse = pixiRenderer.plugins.interaction.mouse ? pixiRenderer.plugins.interaction.mouse.global : null;
        
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

        this.initThree(threeScene, threeCamera);

    };

    Game.prototype.initThree = function(threeScene, threeCamera)
    {
        var geometry = new Three.BoxGeometry( 1, 1, 1 );
        var material = new Three.MeshLambertMaterial( { color: 0x00ff00 } );
        this.cube = new Three.Mesh( geometry, material );
        threeScene.add( this.cube );
        threeCamera.position.z = 5;

        var ambientLight = new Three.AmbientLight( 0x777777 );
        threeScene.add( ambientLight );

        var directionalLight = new Three.DirectionalLight( 0xffffff, 0.5 );
        directionalLight.position.set( 3, 10, 0 );
        threeScene.add( directionalLight );
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
            
            if(this.mouse)
            {
                var radius = window.innerHeight/3;
                var dist = Math.sqrt( (this.mouse.x - sprite.position.x)*(this.mouse.x - sprite.position.x) + (this.mouse.y - sprite.position.y)*(this.mouse.y - sprite.position.y) );
                dist = (radius - dist)/radius;
                dist = Math.min(Math.max(0,dist),1);
                
                mouseFactor = dist * 0.25;
            }
            
            sprite.tint = this.toHex(xResult + mouseFactor, yFactor + mouseFactor, 0.5 + mouseFactor);
            
            if(Math.random()<0.008)
                sprite.alpha = 0.9 + 0.1 * Math.random();
                
        }, this);

        this.cube.rotateX(1*delta);
        this.cube.rotateY(1*delta);
        //this.cube.rotateOnAxis(new Three.Vector3(0.2,0.2,0.2), 10*delta);
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