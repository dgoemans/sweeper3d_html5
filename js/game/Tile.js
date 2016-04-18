define(["Three"],
    function(Three)
    {
        function Tile(threeScene, x, y, z)
        {
            this.geometry = new Three.BoxGeometry( Tile.SIZE, Tile.SIZE, Tile.SIZE );

            this.material = new Three.MeshLambertMaterial( { color: 0xffffff } );

            this.sceneObject = new Three.Mesh( this.geometry, this.material );

            threeScene.add( this.sceneObject );

            this.state = Tile.State.NORMAL;

            this.sceneObject.position.set(x,y,z);
        }

        Tile.State = {
            NORMAL: 1,
            FLAGGED: 2,
            CLEARED: 3
        };

        Tile.SIZE = 0.95;

        Tile.prototype.flag = function()
        {
            if (this.state !== Tile.State.NORMAL)
            {
                return;
            }

            this.state = Tile.State.FLAGGED;

            this.material.color.set( 0x00ff00 );
        };

        Tile.prototype.clear = function()
        {
            if (this.state !== Tile.State.NORMAL)
            {
                return;
            }

            this.state = Tile.State.CLEARED;

            // TODO: If bomb, explode

            this.sceneObject.parent.remove(this.sceneObject);


        };


        Tile.prototype.select = function()
        {
            if (this.state !== Tile.State.NORMAL)
            {
                return;
            }

            this.material.color.set( 0xff0000 );
        };

        Tile.prototype.deselect = function()
        {
            if (this.state !== Tile.State.NORMAL)
            {
                return;
            }

            this.material.color.set( 0xffffff );
        };

        return Tile;
    }
);