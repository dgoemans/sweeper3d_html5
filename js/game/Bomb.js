define(["Three"],
    function(Three)
    {
        function Bomb(threeScene, x, y, z)
        {
            this.geometry = new Three.SphereGeometry(0.5, 32, 32);

            this.material = new Three.MeshLambertMaterial( { color: 0x000000 } );

            this.sceneObject = new Three.Mesh( this.geometry, this.material );

            this.sceneObject.position.set(x,y,z);

            this.value = 0;

            threeScene.add( this.sceneObject );
        }

        return Bomb;
    }
);