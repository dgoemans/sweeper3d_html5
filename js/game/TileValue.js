define(["Three"],
    function(Three)
    {
        function TileValue(threeScene, x, y, z)
        {
            this.geometry = new Three.BoxGeometry(0.1,0.1,0.1);

            this.material = new Three.MeshLambertMaterial( { color: 0x0000ff } );

            this.sceneObject = new Three.Mesh( this.geometry, this.material );

            this.sceneObject.position.set(x,y,z);

            this.value = 0;

            threeScene.add( this.sceneObject );
        }

        TileValue.prototype.setValue = function(value)
        {
            this.value = value;

            this.sceneObject.scale.multiplyScalar((value+1));
            // TODO: Set texture
        };

        return TileValue;
    }
);