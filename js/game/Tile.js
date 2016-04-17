define(["Three"],
    function(Three)
    {
        function Tile(threeScene, x, y, z)
        {
            this.geometry = new Three.BoxGeometry( Tile.SIZE, Tile.SIZE, Tile.SIZE );

            this.material = new Three.MeshLambertMaterial( { color: 0xffffff } );

            this.sceneObject = new Three.Mesh( this.geometry, this.material );

            threeScene.add( this.sceneObject );

            this.sceneObject.position.set(x,y,z);
        }

        Tile.SIZE = 0.95;

        Tile.prototype.activate = function()
        {
            this.material.color.set( 0x00ff00 );
        };


        Tile.prototype.select = function()
        {
            this.material.color.set( 0xff0000 );
        };

        Tile.prototype.deselect = function()
        {
            this.material.color.set( 0xffffff );
        };

        return Tile;
    }
);